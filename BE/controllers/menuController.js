// controllers/menuController.js
const MenuItem = require('../models/MenuItem')

const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find()
        res.json(items)
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách món' })
    }
};

const getMenuItem = async (req, res) => {
    try {
        const newItem = new MenuItem(req.body)
        await newItem.save()
        res.json(newItem)
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi thêm món mới' })
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật món' })
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id)
        res.json({ message: 'Món ăn đã được xoá thành công' })
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xoá món' })
    }
};
    
module.exports = {
    getMenuItems,
    getMenuItem,
    updateMenuItem,
    deleteMenuItem
};