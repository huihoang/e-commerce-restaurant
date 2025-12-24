// controllers/bookingController.js
const Booking = require('../models/Booking')
const MenuItem = require('../models/MenuItem')
const Table = require('../models/Table')
const moment = require('moment');

const DEFAULT_DURATION_MINUTES = 60;

const timeToMinutes = (timeStr = "") => {
    const [h, m] = (timeStr || "").split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
};

// ==================== Tính tổng tiền
const calculateTotalAmount = async (selectedDishes = []) => {
    let total = 0;
    for (const item of selectedDishes) {
        const dishId = item.dishId?._id || item.dishId;
        const menuItem = await MenuItem.findById(dishId);
        if (menuItem) {
            const basePrice = Number(menuItem.price) || 0;
            const discountPercent = Number(menuItem.discountPercent) || 0;
            const discountedPrice = basePrice * (1 - discountPercent / 100);
            total += discountedPrice * (item.quantity || 1);
        }
    }
    return total;
};

const applyDiscount = (total, discount = 0) => {
    if (!total) return 0;
    const percent = Number(discount) || 0;
    return total - (total * percent) / 100;
};

const resolveOrderType = (orderType, ship) => {
    if (orderType === "dine-in" || orderType === "takeaway") {
        return orderType;
    }
    return ship?.isShip ? "takeaway" : "dine-in";
};

const toDateKey = (value = "") => {
    if (!value) return "";
    if (typeof value === "string") {
        return value.split("T")[0];
    }
    try {
        return new Date(value).toISOString().split("T")[0];
    } catch {
        return value;
    }
};

const hasTableConflict = async ({
    tableNumber,
    tableId,
    date,
    time,
    durationMinutes = DEFAULT_DURATION_MINUTES,
    excludeBookingId,
}) => {
    if ((!tableNumber && !tableId) || !date || !time) return false;
    const query = {
        orderType: "dine-in",
        date,
    };
    if (tableId) {
        query.tableId = tableId;
    } else {
        query.tableNumber = tableNumber;
    }
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const requestedStart = timeToMinutes(time);
    const requestedEnd = requestedStart != null
        ? requestedStart + (durationMinutes || DEFAULT_DURATION_MINUTES)
        : null;

    if (requestedStart === null || requestedEnd === null) return true;

    const bookings = await Booking.find(query);
    return bookings.some((booking) => {
        const start = timeToMinutes(booking.time);
        if (start == null) return false;
        const end = start + (booking.durationMinutes || DEFAULT_DURATION_MINUTES);

        const isOverlapping = requestedStart < end && requestedEnd > start;
        return isOverlapping;
    });
};

const createBooking = async (req, res) => {
    try {
        const {
            name,
            phone,
            date,
            time,
            ship,
            people,
            note,
            selectedDishes,
            payment,
            totalAmount: providedTotal,
            orderType,
            tableNumber,
            deliveryAddress,
            deliveryEmail,
            discount = 0,
            discountCode = null,
            durationMinutes = DEFAULT_DURATION_MINUTES,
        } = req.body;

        const initialShip = ship || {};
        const resolvedOrderType = resolveOrderType(orderType, initialShip);
        const isDineIn = resolvedOrderType === "dine-in";

        const normalizedDate = toDateKey(date);

        if (!name || !phone || !normalizedDate || !time || (isDineIn && !people)) {
            return res
                .status(400)
                .json({
                    message: isDineIn
                        ? "Vui lòng cung cấp đầy đủ thông tin (bao gồm số người/bàn)."
                        : "Vui lòng cung cấp đầy đủ thông tin.",
                });
        }

        // Staff/Admin đặt bàn cho khách hàng → không lưu userId của staff/admin
        // Chỉ user thường mới lưu userId của chính họ
        const userRole = req.user?.role;
        const isStaffOrAdmin = userRole === "staff" || userRole === "admin";
        const userId = isStaffOrAdmin ? null : (req.user?.id || null);

        let resolvedTable;
        if (isDineIn) {
            if (!tableNumber) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng chọn bàn cho đơn đặt tại quán." });
            }
            const table = await Table.findOne({ number: tableNumber });
            if (!table || !table.isActive) {
                return res
                    .status(400)
                    .json({ message: "Bàn không khả dụng hoặc đã bị vô hiệu." });
            }
            if (Number(table.capacity || 0) < Number(people || 0)) {
                return res
                    .status(400)
                    .json({ message: "Số người vượt quá sức chứa của bàn này." });
            }
            const conflict = await hasTableConflict({
                tableNumber,
                tableId: resolvedTable?._id,
                date: normalizedDate,
                time,
                durationMinutes,
            });
            if (conflict && payment?.isPaid === true) {
                return res
                    .status(409)
                    .json({ message: "Bàn này đã được đặt trong khung giờ hoặc đang chờ thanh toán." });
            }
            resolvedTable = table;
        }

        const formattedDishes =
            selectedDishes?.map((dish) => ({
                dishId: dish.dishId?._id || dish.dishId,
                quantity: dish.quantity || 1,
            })) || [];

        let resolvedTotal = providedTotal ?? 0;
        if (formattedDishes.length > 0 && (userId != null || providedTotal == null)) {
            const subtotal = await calculateTotalAmount(formattedDishes);
            resolvedTotal = applyDiscount(subtotal, discount);
        }

        if (!resolvedTotal || resolvedTotal < 0) {
            resolvedTotal = 30000; // Giá trị mặc định nếu chỉ đặt bàn không món ăn
        }

        const normalizedShip = {
            isShip: resolvedOrderType === "takeaway",
            address: initialShip?.address || deliveryAddress || "",
        };

        const paymentInfo = {
            orderId: moment(normalizedDate || date).format('DDHHmmss'),
            isPaid: false,
            paidAt: null,
            paymentMethod: "cash",
            ...(payment || {}),
        };

        const newBooking = new Booking({
            userId,
            name,
            phone,
            date: normalizedDate,
            time,
            ship: normalizedShip,
            people: isDineIn ? people : people || 1,
            note,
            orderType: resolvedOrderType,
            tableId: resolvedOrderType === "dine-in" ? resolvedTable?._id : undefined,
            tableNumber: resolvedOrderType === "dine-in" ? (resolvedTable?.number?.toString() || tableNumber) : undefined,
            deliveryAddress: resolvedOrderType === "takeaway" ? (deliveryAddress || normalizedShip.address) : undefined,
            deliveryEmail: resolvedOrderType === "takeaway" ? deliveryEmail : undefined,
            discount,
            discountCode,
            selectedDishes: formattedDishes,
            payment: paymentInfo,
            durationMinutes: durationMinutes || DEFAULT_DURATION_MINUTES,
            totalAmount: resolvedTotal,
        });
        const savedBooking = await newBooking.save();

        res.status(201).json({
            code: 201,
            message: "Đặt bàn thành công. Vui lòng thanh toán để hoàn tất nếu cần!",
            data: {
                booking: savedBooking,
                payment: paymentInfo,
                paymentUrl: req.body.paymentUrl,
            },
        });
    } catch (err) {
        console.error("❌ Lỗi khi tạo đơn đặt món:", err);
        res
            .status(500)
            .json({ message: "Lỗi khi tạo đơn đặt món. Vui lòng thử lại sau." });
    }
};

const getBookingHistory = async (req, res) => {
    try {
        // Nếu là staff hoặc admin, trả về tất cả bookings
        // Nếu là user thường, chỉ trả về bookings của chính họ
        const userRole = req.user?.role;
        const isStaffOrAdmin = userRole === "staff" || userRole === "admin";
        
        const query = isStaffOrAdmin 
            ? {} 
            : { userId: req.user.id };
        
        const bookings = await Booking.find(query)
            .sort({
                "payment.isPaid": 1, // unpaid first
                date: -1,
                time: -1,
                createdAt: -1,
            })
            .populate("selectedDishes.dishId")
            .populate("tableId")
            .populate("userId", "name email");

        res.json(bookings);
    } catch (err) {
        console.error("❌ Lỗi khi lấy lịch sử đặt món:", err);
        res.status(500).json({ message: "Lỗi khi lấy lịch sử đặt món" });
    }
};

const getAllBookings = async (_req, res) => {
    try {
        const bookings = await Booking.find()
            .sort({ date: -1, createdAt: -1 })
            .populate("selectedDishes.dishId")
            .populate("tableId");
        res.json(bookings);
    } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách đặt bàn:", err);
        res.status(500).json({ message: "Lỗi khi lấy danh sách đặt bàn." });
    }
};

const updateBooking = async (req, res) => {
    try {
        const {
            name,
            phone,
            date,
            time,
            people,
            note,
            selectedDishes,
            tableId,
            discount = 0,
            discountCode = null,
            durationMinutes = DEFAULT_DURATION_MINUTES,
        } = req.body;
        const userId = req.user.id;

        const normalizedDate = toDateKey(date);

        if (!name || !phone || !normalizedDate || !time || !people) {
            return res
                .status(400)
                .json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
        }

        const existingBooking = await Booking.findOne({
            _id: req.params.bookingId,
            userId,
        });

        if (!existingBooking) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy đặt bàn cần chỉnh sửa." });
        }

        const formattedDishes =
            selectedDishes?.map((dish) => ({
                dishId: dish.dishId?._id || dish.dishId,
                quantity: dish.quantity || 1,
            })) || [];

        const subtotal = await calculateTotalAmount(formattedDishes);
        const totalAmount = applyDiscount(subtotal, discount);

        const updatePayload = {
            name,
            phone,
            date: normalizedDate,
            time,
            people,
            note,
            discount,
            discountCode,
            selectedDishes: formattedDishes,
            totalAmount,
            durationMinutes: durationMinutes || existingBooking.durationMinutes || DEFAULT_DURATION_MINUTES,
        };

        if (existingBooking.orderType === "dine-in") {
            const targetTableId = tableId || existingBooking.tableId;
            if (!targetTableId) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng chọn bàn hợp lệ." });
            }
            const table = await Table.findById(targetTableId);
            if (!table || !table.isActive || table.status === "maintenance") {
                return res
                    .status(400)
                    .json({ message: "Bàn không khả dụng." });
            }
            if (Number(table.capacity || 0) < Number(people || 0)) {
                return res
                    .status(400)
                    .json({ message: "Số người vượt quá sức chứa của bàn này." });
            }
            const conflict = await hasTableConflict({
                tableNumber: table.number?.toString() || existingBooking.tableNumber,
                tableId: table._id,
                date: normalizedDate,
                time,
                durationMinutes: updatePayload.durationMinutes,
                excludeBookingId: existingBooking._id,
            });
            if (conflict) {
                return res
                    .status(409)
                    .json({ message: "Bàn này đã được đặt trong khung giờ hoặc đang chờ thanh toán." });
            }
            updatePayload.tableId = table._id;
            updatePayload.tableNumber = table.number?.toString();
        } else {
            updatePayload.tableId = undefined;
            updatePayload.tableNumber = undefined;
        }

        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: existingBooking._id, userId },
            updatePayload,
            { new: true }
        );

        res.json({ message: "Cập nhật thành công!", booking: updatedBooking });
    } catch (err) {
        console.error("❌ Lỗi khi chỉnh sửa đặt bàn:", err);
        res.status(500).json({ message: "Lỗi khi chỉnh sửa đặt bàn." });
    }
};

const addDish = async (req, res) => {
    try {
        const { dishId, quantity } = req.body;
        const userId = req.user.id;

        if (!dishId || !quantity) {
            return res
                .status(400)
                .json({ message: "Vui lòng cung cấp dishId và quantity." });
        }

        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: req.params.bookingId, userId },
            { $push: { selectedDishes: { dishId, quantity } } },
            { new: true }
        );

        if (!updatedBooking) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy đặt bàn cần thêm món." });
        }

        const subtotal = await calculateTotalAmount(
            updatedBooking.selectedDishes
        );
        updatedBooking.totalAmount = applyDiscount(
            subtotal,
            updatedBooking.discount || 0
        );
        await updatedBooking.save();

        res.json({ message: "Thêm món ăn thành công!", booking: updatedBooking });
    } catch (err) {
        console.error("❌ Lỗi khi thêm món ăn:", err);
        res.status(500).json({ message: "Lỗi khi thêm món ăn." });
    }
};

const removeDish = async (req, res) => {
    try {
        const { dishId } = req.body;
        const userId = req.user.id;

        if (!dishId) {
            return res
                .status(400)
                .json({ message: "Vui lòng cung cấp dishId để xóa." });
        }

        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: req.params.bookingId, userId },
            { $pull: { selectedDishes: { dishId } } },
            { new: true }
        );

        if (!updatedBooking) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy đặt bàn cần xóa món." });
        }

        const subtotal = await calculateTotalAmount(
            updatedBooking.selectedDishes
        );
        updatedBooking.totalAmount = applyDiscount(
            subtotal,
            updatedBooking.discount || 0
        );
        await updatedBooking.save();

        res.json({ message: "Xóa món ăn thành công!", booking: updatedBooking });
    } catch (err) {
        console.error("❌ Lỗi khi xóa món ăn:", err);
        res.status(500).json({ message: "Lỗi khi xóa món ăn." });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const bookingId = req.params.bookingId;

        const query =
            userRole === "admin" || userRole === "staff"
                ? { _id: bookingId }
                : { _id: bookingId, userId };

        const deletedBooking = await Booking.findOneAndDelete(query);

        if (!deletedBooking) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy đặt bàn cần xóa." });
        }

        res.json({ message: "Đặt bàn đã được xóa thành công." });
    } catch (err) {
        console.error("❌ Lỗi khi xóa đặt bàn:", err);
        res.status(500).json({ message: "Lỗi khi xóa đặt bàn." });
    }
};

const updateBookingPay = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const bookingId = req.params.bookingId;

        const query =
            userRole === "admin" || userRole === "staff"
                ? { _id: bookingId }
                : { _id: bookingId, userId };

        const booking = await Booking.findOne(query);

        if (!booking) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy đơn đặt bàn để thanh toán." });
        }

        booking.payment = booking.payment
            ? { ...booking.payment, isPaid: true, paidAt: new Date() }
            : { isPaid: true, paidAt: new Date() };
        await booking.save();

        res.json({ message: "Thanh toán thành công!", booking });
    } catch (err) {
        console.error("❌ Lỗi khi cập nhật thanh toán:", err);
        res.status(500).json({ message: "Lỗi khi thanh toán." });
    }
};

module.exports = {
    createBooking,
    getBookingHistory,
    getAllBookings,
    updateBooking,
    addDish,
    removeDish,
    deleteBooking,
    updateBookingPay
};