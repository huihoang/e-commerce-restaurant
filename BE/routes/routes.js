const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const menuRoutes = require("./menuRoutes");
const bookingsRoutes = require("./bookingsRoutes");
const blogRoutes = require("./blogRoutes");
const adminbookingsRoutes = require("./adminBookingRoutes");
const contactRoutes = require("./contactRoutes");

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin/bookings", adminbookingsRoutes);
app.use("/api/contact", contactRoutes);