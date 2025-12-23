// controllers/adminController.js
const Booking = require('../models/Booking');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');

const DEFAULT_DURATION_MINUTES = 60;

const timeToMinutes = (timeStr = "") => {
    const [h, m] = (timeStr || "").split(":").map((v) => Number(v));
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
};

const calculateTotalAmount = async (selectedDishes = []) => {
    let total = 0;
    for (const item of selectedDishes) {
        const dishId = item.dishId?._id || item.dishId;
        if (!dishId) continue;
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

const applyDiscount = (total = 0, discount = 0) => {
    const percent = Number(discount) || 0;
    const discounted = total - (total * percent) / 100;
    return Math.max(0, discounted);
};

const getAllBooking = async (req, res) => {
    try {
        // Lấy danh sách tất cả các đơn đặt bàn, sắp xếp theo ngày tạo giảm dần
        const bookings = await Booking.find()
            .sort({
                "payment.isPaid": 1, // unpaid first
                date: -1,
                time: -1,
                createdAt: -1,
            })
            .populate("selectedDishes.dishId") // Lấy thông tin món ăn
            .populate("tableId")
            .populate("userId", "name email"); // Lấy thông tin người dùng

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "Không có đơn đặt bàn nào." });
        }

        res.json(bookings);
    } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách đặt bàn:", err);
        res.status(500).json({ message: "Lỗi khi lấy danh sách đặt bàn." });
    }
}

const updateBookingPay = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt bàn." });
        }

        // Cập nhật trạng thái thanh toán
        const { isPaid } = req.body;
        const nextStatus = typeof isPaid === "boolean" ? isPaid : true;
        booking.payment.isPaid = nextStatus;
        booking.payment.paidAt = nextStatus ? new Date() : null;
        await booking.save();

        res.json({ message: "Cập nhật thanh toán thành công!", booking });
    } catch (err) {
        console.error("❌ Lỗi khi cập nhật thanh toán:", err);
        res.status(500).json({ message: "Lỗi khi cập nhật thanh toán." });
    }
}

const deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(
            req.params.bookingId
        );

        if (!deletedBooking) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy đơn đặt bàn để xóa." });
        }

        res.json({ message: "Đơn đặt bàn đã được xóa thành công." });
    } catch (err) {
        console.error("❌ Lỗi khi xóa đơn đặt bàn:", err);
        res.status(500).json({ message: "Lỗi khi xóa đơn đặt bàn." });
    }
}

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

const hasTableConflict = async ({ tableId, date, time, durationMinutes = DEFAULT_DURATION_MINUTES, excludeBookingId }) => {
    if (!tableId || !date || !time) return false;
    const query = {
        tableId,
        orderType: "dine-in",
        date,
    };
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const requestedStart = timeToMinutes(time);
    const requestedEnd = requestedStart != null
        ? requestedStart + (durationMinutes || DEFAULT_DURATION_MINUTES)
        : null;
    if (requestedStart == null || requestedEnd == null) return true;

    const bookings = await Booking.find(query);
    return bookings.some((booking) => {
        const start = timeToMinutes(booking.time);
        if (start == null) return false;
        const end = start + (booking.durationMinutes || DEFAULT_DURATION_MINUTES);
        const isOverlapping = requestedStart < end && requestedEnd > start;
        return isOverlapping;
    });
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
            discount,
            discountCode,
            tableId,
            orderType,
            deliveryAddress,
            deliveryEmail,
            durationMinutes,
        } = req.body;

        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt bàn." });
        }

        const normalizedDate = date ? toDateKey(date) : booking.date;
        const targetOrderType = orderType || booking.orderType || "dine-in";

        if (name) booking.name = name;
        if (phone) booking.phone = phone;
        if (time) booking.time = time;
        if (people) booking.people = people;
        if (orderType) booking.orderType = orderType;
        booking.date = normalizedDate;

        if (note !== undefined) booking.note = note;
        if (deliveryAddress !== undefined) booking.deliveryAddress = deliveryAddress;
        if (deliveryEmail !== undefined) booking.deliveryEmail = deliveryEmail;

        let shouldRecalculateTotal = false;

        if (Array.isArray(selectedDishes)) {
            booking.selectedDishes = selectedDishes.map((dish) => ({
                dishId: dish.dishId?._id || dish.dishId,
                quantity: dish.quantity || 1,
            }));
            shouldRecalculateTotal = true;
        }

        if (discount !== undefined) {
            booking.discount = Number(discount) || 0;
            shouldRecalculateTotal = true;
        }

        if (discountCode !== undefined) {
            booking.discountCode = discountCode || null;
        }

        if (durationMinutes !== undefined) {
            booking.durationMinutes = Number(durationMinutes) || DEFAULT_DURATION_MINUTES;
        } else if (!booking.durationMinutes) {
            booking.durationMinutes = DEFAULT_DURATION_MINUTES;
        }

        if (targetOrderType === "dine-in") {
            const nextTableId = tableId || booking.tableId;
            if (!nextTableId) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng chọn bàn hợp lệ." });
            }
            const table = await Table.findById(nextTableId);
            if (!table || !table.isActive || table.status === "maintenance") {
                return res
                    .status(400)
                    .json({ message: "Bàn không khả dụng." });
            }
            if (Number(table.capacity || 0) < Number(booking.people || 0)) {
                return res
                    .status(400)
                    .json({ message: "Số người vượt quá sức chứa của bàn này." });
            }
            const conflict = await hasTableConflict({
                tableId: table._id,
                date: booking.date,
                time: booking.time,
                durationMinutes: booking.durationMinutes || DEFAULT_DURATION_MINUTES,
                excludeBookingId: booking._id,
            });
            if (conflict) {
                return res
                    .status(409)
                    .json({ message: "Bàn này đã được đặt trong khung giờ hoặc đang chờ thanh toán." });
            }
            booking.tableId = table._id;
            booking.tableNumber = table.number?.toString();
        } else {
            booking.tableId = undefined;
            booking.tableNumber = undefined;
        }

        if (shouldRecalculateTotal) {
            const subtotal = await calculateTotalAmount(booking.selectedDishes);
            booking.totalAmount = applyDiscount(subtotal, booking.discount);
        }

        const updated = await booking.save();

        res.json({
            message: "Cập nhật đơn đặt bàn thành công!",
            booking: updated,
        });
    } catch (err) {
        console.error("❌ Lỗi khi cập nhật đơn đặt bàn:", err);
        res.status(500).json({ message: "Lỗi khi cập nhật đơn đặt bàn." });
    }
}

module.exports = { getAllBooking, updateBookingPay, deleteBooking, updateBooking };