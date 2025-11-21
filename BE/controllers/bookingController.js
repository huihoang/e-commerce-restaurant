// controllers/bookingController.js
const Booking = require('../models/Booking')
const MenuItem = require('../models/MenuItem')
const moment = require('moment');

// ==================== Tính tổng tiền
const calculateTotalAmount = async (selectedDishes) => {
    let total = 0;
    for (const item of selectedDishes) {
        const menuItem = await MenuItem.findById(item.dishId);
        if (menuItem) {
            total += menuItem.price * item.quantity;
        }
    }
    return total;
};

const createBooking = async (req, res) => {
    try {
        const { name, phone, date, time, ship, people, note, selectedDishes, payment, totalAmount } = req.body;

        if (!name || !phone || !date || !time || !people) {
            return res
                .status(400)
                .json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
        }

        const userId = req.user?.id || null; // Có thể không có user nếu là public booking

        const formattedDishes =
            selectedDishes?.map((dish) => ({
                dishId: dish.dishId,
                quantity: dish.quantity || 1,
            })) || [];

        // tính tiền tại quầy, ko giảm giá
        if (formattedDishes.length > 0
            && (userId != null || totalAmount == null)) {
            totalAmount = await calculateTotalAmount(formattedDishes);
        }

        if (totalAmount < 0) {
            totalAmount = 30000; // Giá trị mặc định nếu chỉ đặt bàn không món ăn
        }

        const newBooking = new Booking({
            userId,
            name,
            phone,
            date,
            time,
            ship,
            people,
            note,
            selectedDishes: formattedDishes,
            payment: payment || { orderId: moment(date).format('DDHHmmss') },
            totalAmount: totalAmount,
        });
        await newBooking.save();

        res.status(201)
            .json({ code: 201, message: "Để hoàn tất đặt món, vui lòng thanh toán!", data: { payment, paymentUrl: req.body.paymentUrl } });
    } catch (err) {
        console.error("❌ Lỗi khi tạo đơn đặt món:", err.message);
        res
            .status(500)
            .json({ message: "Lỗi khi tạo đơn đặt món. Vui lòng thử lại sau." });
    }
};

const getBookingHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.find({
            $or: [
                { userId: req.user.id },
                { userId: null }
            ]
        })
            .sort({ date: -1 })
            .populate("selectedDishes.dishId");

        res.json(bookings);
    } catch (err) {
        console.error("❌ Lỗi khi lấy lịch sử đặt món:", err.message);
        res.status(500).json({ message: "Lỗi khi lấy lịch sử đặt món" });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { name, phone, date, time, people, note, selectedDishes } = req.body;
        const userId = req.user.id;

        if (!name || !phone || !date || !time || !people) {
            return res
                .status(400)
                .json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
        }

        const formattedDishes =
            selectedDishes?.map((dish) => ({
                dishId: dish.dishId,
                quantity: dish.quantity || 1,
            })) || [];

        const totalAmount = await calculateTotalAmount(formattedDishes);

        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: req.params.bookingId, userId },
            {
                name,
                phone,
                date,
                time,
                people,
                note,
                selectedDishes: formattedDishes,
                totalAmount,
            },
            { new: true }
        );

        if (!updatedBooking) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy đặt bàn cần chỉnh sửa." });
        }

        res.json({ message: "Cập nhật thành công!", booking: updatedBooking });
    } catch (err) {
        console.error("❌ Lỗi khi chỉnh sửa đặt bàn:", err.message);
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

        const totalAmount = await calculateTotalAmount(
            updatedBooking.selectedDishes
        );
        updatedBooking.totalAmount = totalAmount;
        await updatedBooking.save();

        res.json({ message: "Thêm món ăn thành công!", booking: updatedBooking });
    } catch (err) {
        console.error("❌ Lỗi khi thêm món ăn:", err.message);
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

        const totalAmount = await calculateTotalAmount(
            updatedBooking.selectedDishes
        );
        updatedBooking.totalAmount = totalAmount;
        await updatedBooking.save();

        res.json({ message: "Xóa món ăn thành công!", booking: updatedBooking });
    } catch (err) {
        console.error("❌ Lỗi khi xóa món ăn:", err.message);
        res.status(500).json({ message: "Lỗi khi xóa món ăn." });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedBooking = await Booking.findOneAndDelete({
            _id: req.params.bookingId,
            userId,
        });

        if (!deletedBooking) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy đặt bàn cần xóa." });
        }

        res.json({ message: "Đặt bàn đã được xóa thành công." });
    } catch (err) {
        console.error("❌ Lỗi khi xóa đặt bàn:", err.message);
        res.status(500).json({ message: "Lỗi khi xóa đặt bàn." });
    }
};

const updateBookingPay = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.bookingId;

        const booking = await Booking.findOne({ _id: bookingId, userId });

        if (!booking) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy đơn đặt bàn để thanh toán." });
        }

        booking.payment.isPaid = true;
        booking.payment.paidAt = new Date();
        await booking.save();

        res.json({ message: "Thanh toán thành công!", booking });
    } catch (err) {
        console.error("❌ Lỗi khi cập nhật thanh toán:", err.message);
        res.status(500).json({ message: "Lỗi khi thanh toán." });
    }
};

module.exports = {
    createBooking,
    getBookingHistory,
    updateBooking,
    addDish,
    removeDish,
    deleteBooking,
    updateBookingPay
};