const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discountController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/roleMiddleware");

router.get("/active", discountController.getActiveDiscounts);
router.get("/validate", discountController.validateDiscount);

router.get(
  "/",
  authenticateToken,
  authorizeAdmin("admin"),
  discountController.getAllDiscounts
);

router.post(
  "/",
  authenticateToken,
  authorizeAdmin("admin"),
  discountController.createDiscount
);

router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin("admin"),
  discountController.updateDiscount
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin("admin"),
  discountController.deleteDiscount
);

module.exports = router;

