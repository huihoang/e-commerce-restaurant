const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/roleMiddleware");

router.get("/", categoryController.getActiveCategories);

router.get(
  "/admin",
  authenticateToken,
  authorizeAdmin("admin"),
  categoryController.getAllCategories
);

router.post(
  "/",
  authenticateToken,
  authorizeAdmin("admin"),
  categoryController.createCategory
);

router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin("admin"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin("admin"),
  categoryController.deleteCategory
);

module.exports = router;

