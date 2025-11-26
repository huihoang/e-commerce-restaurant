const Category = require("../models/Category");

const sanitizeBoolean = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value === "true";
  }
  return fallback;
};

const getActiveCategories = async (_req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .lean();
    res.json(categories);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh mục:", err.message);
    res.status(500).json({ message: "Không thể lấy danh sách danh mục." });
  }
};

const getAllCategories = async (_req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    res.json(categories);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh mục:", err.message);
    res.status(500).json({ message: "Không thể lấy danh sách danh mục." });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc." });
    }
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Danh mục đã tồn tại." });
    }
    const category = new Category({
      name,
      description,
      isActive: sanitizeBoolean(isActive, true),
    });
    await category.save();
    res.status(201).json({ message: "Tạo danh mục thành công!", category });
  } catch (err) {
    console.error("❌ Lỗi khi tạo danh mục:", err.message);
    res.status(500).json({ message: "Không thể tạo danh mục." });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(isActive !== undefined ? { isActive: sanitizeBoolean(isActive) } : {}),
      },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }
    res.json({ message: "Cập nhật danh mục thành công!", category: updated });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật danh mục:", err.message);
    res.status(500).json({ message: "Không thể cập nhật danh mục." });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }
    res.json({ message: "Đã xoá danh mục." });
  } catch (err) {
    console.error("❌ Lỗi khi xoá danh mục:", err.message);
    res.status(500).json({ message: "Không thể xoá danh mục." });
  }
};

module.exports = {
  getActiveCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

