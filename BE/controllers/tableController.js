const Table = require('../models/Table');

const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.json(tables);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách bàn:', err.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bàn.' });
  }
};

const getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn.' });
    }
    res.json(table);
  } catch (err) {
    console.error('❌ Lỗi khi lấy thông tin bàn:', err.message);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin bàn.' });
  }
};

const createTable = async (req, res) => {
  try {
    const { number, capacity, location, description, isActive = true } = req.body;

    if (!number || !capacity) {
      return res.status(400).json({ message: 'Vui lòng nhập số bàn và sức chứa.' });
    }

    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      return res.status(409).json({ message: 'Số bàn đã tồn tại.' });
    }

    const table = new Table({
      number,
      capacity,
      location,
      description,
      isActive,
    });

    await table.save();
    res.status(201).json({ message: 'Tạo bàn thành công!', table });
  } catch (err) {
    console.error('❌ Lỗi khi tạo bàn:', err.message);
    res.status(500).json({ message: 'Không thể tạo bàn.' });
  }
};

const updateTable = async (req, res) => {
  try {
    const { number, capacity, location, description, isActive } = req.body;

    if (number) {
      const existingTable = await Table.findOne({ number, _id: { $ne: req.params.id } });
      if (existingTable) {
        return res.status(409).json({ message: 'Số bàn đã tồn tại.' });
      }
    }

    const updateData = {};
    if (number !== undefined) updateData.number = number;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await Table.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy bàn.' });
    }

    res.json({ message: 'Cập nhật bàn thành công!', table: updated });
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật bàn:', err.message);
    res.status(500).json({ message: 'Không thể cập nhật bàn.' });
  }
};

const deleteTable = async (req, res) => {
  try {
    const deleted = await Table.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy bàn để xóa.' });
    }
    res.json({ message: 'Xóa bàn thành công!' });
  } catch (err) {
    console.error('❌ Lỗi khi xóa bàn:', err.message);
    res.status(500).json({ message: 'Không thể xóa bàn.' });
  }
};

module.exports = {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
};
