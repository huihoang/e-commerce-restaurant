const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const authenticateToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Public: Lấy danh sách bàn (cho đặt món)
router.get('/', tableController.getAllTables);

// Admin only routes
const allowStaffOrAdmin = requireRole('admin', 'staff');

router.post('/', authenticateToken, allowStaffOrAdmin, tableController.createTable);
router.get('/:id', authenticateToken, allowStaffOrAdmin, tableController.getTableById);
router.put('/:id', authenticateToken, allowStaffOrAdmin, tableController.updateTable);
router.delete('/:id', authenticateToken, allowStaffOrAdmin, tableController.deleteTable);

module.exports = router;
