const express = require("express");
const router = express.Router();
const contactController = require('../controllers/contactController');


// POST endpoint to handle contact form submission
router.post("/", contactController.createContact);

// GET route để lấy thông tin liên hệ đã lưu
router.get("/", contactController.getContact);

// DELETE route để xoá thông tin liên hệ theo ID
router.delete("/:id", contactController.deleteContact);
module.exports = router;
