const express = require('express')
const router = express.Router()
const menuController = require('../controllers/menuController')
// ==================== GET all menu items
router.get('/', menuController.getMenuItems)

// ==================== POST new menu item
router.post('/', menuController.getMenuItem)

// ==================== PUT update a menu item
router.put('/:id', menuController.updateMenuItem)

// ==================== DELETE a menu item
router.delete('/:id', menuController.deleteMenuItem)

module.exports = router
