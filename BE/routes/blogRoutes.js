// routes/BlogRoutes.js
const express = require("express");
const router = express.Router();
const blogController = require('../controllers/blogController');

// ==============================
// Create new blog
// Tạo mới bài viết
router.post("/", blogController.createBlog);

// ==============================
// Get all blogs
router.get("/", blogController.getBlogs);

// ==============================
// Get blog by ID
router.get("/:id", blogController.getBlog);

// ==============================
// Update blog by ID
router.put("/:id", blogController.updateBlog);

// ==============================
// Delete blog by ID
router.delete("/:id", blogController.deleteBlog);

module.exports = router;