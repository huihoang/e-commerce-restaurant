const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/roleMiddleware");
const adminController = require('../controllers/adminController');


// ==================== Lấy tất cả đơn đặt bàn (Admin)
router.get(
  "/",
  authenticateToken,
  authorizeAdmin("admin"),
  adminController.getAllBooking
);

// ==================== Cập nhật trạng thái thanh toán (Admin)
router.patch(
  "/:bookingId/pay",
  authenticateToken,
  authorizeAdmin("admin"),
  adminController.updateBookingPay
);

// ==================== Xóa đơn đặt bàn (Admin)
router.delete(
  "/:bookingId",
  authenticateToken,
  authorizeAdmin("admin"),
  adminController.deleteBooking
);

// ==================== Cập nhật đơn đặt bàn (Admin)
router.patch(
  "/:bookingId",
  authenticateToken,
  authorizeAdmin("admin"),
  adminController.updateBooking
);

module.exports = router;
