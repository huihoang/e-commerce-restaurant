// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const authenticateTokenOptional = require("../middleware/authenticateTokenOptional");
const bookingController = require('../controllers/bookingController')

// ==================== Đặt bàn (POST)
router.post("/", authenticateTokenOptional, bookingController.createBooking);

// ==================== Lịch sử đặt bàn (GET)
router.get("/history", authenticateToken, bookingController.getBookingHistory);

// ==================== Chỉnh sửa đặt bàn (PUT)
router.put("/:bookingId", authenticateToken, bookingController.updateBooking);

// ==================== Thêm món ăn (PUT)
router.put("/:bookingId/addDish", authenticateToken, bookingController.addDish);

// ==================== Xóa món ăn (PUT)
router.put("/:bookingId/removeDish", authenticateToken, bookingController.removeDish);

// ==================== Xóa đặt bàn (DELETE)
router.delete("/:bookingId", authenticateToken, bookingController.deleteBooking);

// ==================== Cập nhật trạng thái thanh toán (PATCH)
router.patch("/:bookingId/pay", authenticateToken, bookingController.updateBookingPay);

module.exports = router;