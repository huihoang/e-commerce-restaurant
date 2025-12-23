const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const menuRoutes = require("./menuRoutes");
const bookingsRoutes = require("./bookingsRoutes");
const blogRoutes = require("./blogRoutes");
const adminbookingsRoutes = require("./adminBookingRoutes");
const contactRoutes = require("./contactRoutes");
const orderRoutes = require("./orderRoutes");
const categoryRoutes = require("./categoryRoutes");
const discountRoutes = require("./discountRoutes");
const tableRoutes = require("./tableRoutes");
const chatbotRoutes = require('./chatbotRoutes');

router.use("/api", authRoutes);
router.use("/api/users", userRoutes);
router.use("/api/menus", menuRoutes);
router.use("/api/bookings", bookingsRoutes);
router.use("/api/blogs", blogRoutes);
router.use("/api/admin/bookings", adminbookingsRoutes);
router.use("/api/contact", contactRoutes);
router.use("/api/order", orderRoutes);
router.use("/api/categories", categoryRoutes);
router.use("/api/discounts", discountRoutes);
router.use("/api/tables", tableRoutes);
router.use('/api/chatbot', chatbotRoutes);
module.exports = router;