// routes/auth.js
const express = require("express");
const authController = require('../controllers/authController');
const authenticateToken = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

// POST /signup
router.post("/signup", authController.signup);

// POST /login
router.post("/login", authController.login);

// GET /admin-only
router.get(
  "/admin-only",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    res.json({ message: "Welcome, Admin!" });
  }
);

module.exports = router;
