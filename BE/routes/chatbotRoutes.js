const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

router.post('/chat', chatbotController.chat);
router.get('/history/:sessionId', chatbotController.getHistory);
router.post('/end/:sessionId', chatbotController.endSession);

module.exports = router;