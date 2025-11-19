const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/authMiddleware')
const userController = require('../controllers/userController')

// Lấy thông tin người dùng hiện tại từ token
router.get('/me', authenticateToken, userController.getUser);

// Cập nhật thông tin người dùng hiện tại
router.put('/me', authenticateToken, userController.updateCurrentUser);

// Get all users
router.get('/', userController.getAll)

// Update username, email, or role
router.put('/:id', userController.updateUser)

// Delete user
router.delete('/:id', userController.deleteUser)

module.exports = router