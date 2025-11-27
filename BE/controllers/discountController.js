const Discount = require("../models/Discount");

const optionalDateCondition = (field, operator, date) => ({
  $or: [
    { [field]: { [operator]: date } },
    { [field]: { $exists: false } },
    { [field]: null },
  ],
});

const buildStatusFilter = (status) => {
  const now = new Date();
  switch (status) {
    case "active":
      return {
        isActive: true,
        ...optionalDateCondition("startDate", "$lte", now),
        $or: [
          { endDate: { $gte: now } },
          { endDate: { $exists: false } },
          { endDate: null },
        ],
      };
    case "upcoming":
      return {
        startDate: { $gt: now },
      };
    case "expired":
      return {
        endDate: { $exists: true, $ne: null, $lt: now },
      };
    default:
      return {};
  }
};

const createDiscount = async (req, res) => {
  try {
    const {
      code,
      description,
      discountPercent,
      startDate,
      endDate,
      isActive = true,
      usageLimit,
    } = req.body;

    if (!code || discountPercent === undefined) {
      return res.status(400).json({ message: "Vui lòng nhập mã và phần trăm giảm." });
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : null;
    if (start && end && start >= end) {
      return res.status(400).json({ message: "Ngày kết thúc phải lớn hơn ngày bắt đầu." });
    }

    const existing = await Discount.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(409).json({ message: "Mã giảm giá đã tồn tại." });
    }

    const discount = new Discount({
      code: code.toUpperCase(),
      description,
      discountPercent,
      startDate: start,
      endDate: end,
      isActive,
      usageLimit,
      createdBy: req.user?.id,
    });
    await discount.save();
    res.status(201).json({ message: "Tạo mã giảm giá thành công!", discount });
  } catch (err) {
    console.error("❌ Lỗi khi tạo mã giảm giá:", err);
    res.status(500).json({ message: "Không thể tạo mã giảm giá." });
  }
};

const getAllDiscounts = async (req, res) => {
  try {
    const filter = buildStatusFilter(req.query.status);
    const discounts = await Discount.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    res.json(discounts);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách mã giảm giá:", err);
    res.status(500).json({ message: "Không thể lấy danh sách mã giảm giá." });
  }
};

const getActiveDiscounts = async (_req, res) => {
  try {
    const now = new Date();
    const discounts = await Discount.find({
      isActive: true,
      ...optionalDateCondition("startDate", "$lte", now),
      $or: [
        { endDate: { $gte: now } },
        { endDate: { $exists: false } },
        { endDate: null },
      ],
    })
      .sort({ endDate: 1 })
      .lean();
    res.json(discounts);
  } catch (err) {
    console.error("❌ Lỗi khi lấy mã giảm giá:", err);
    res.status(500).json({ message: "Không thể lấy mã giảm giá." });
  }
};

const validateDiscount = async (req, res) => {
  try {
    const code = req.query.code?.toUpperCase();
    if (!code) {
      return res.status(400).json({ message: "Vui lòng cung cấp mã discount." });
    }
    const now = new Date();
    const discount = await Discount.findOne({
      code,
      isActive: true,
      ...optionalDateCondition("startDate", "$lte", now),
      $or: [
        { endDate: { $gte: now } },
        { endDate: { $exists: false } },
        { endDate: null },
      ],
    }).lean();
    if (!discount) {
      return res.status(404).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn." });
    }
    res.json({ message: "Mã giảm giá hợp lệ", discount });
  } catch (err) {
    console.error("❌ Lỗi khi kiểm tra mã giảm giá:", err);
    res.status(500).json({ message: "Không thể kiểm tra mã giảm giá." });
  }
};

const parseOptionalDate = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return new Date(value);
};

const updateDiscount = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    const start = parseOptionalDate(updateData.startDate);
    const end = parseOptionalDate(updateData.endDate);

    if (start && end && start >= end) {
      return res
        .status(400)
        .json({ message: "Ngày kết thúc phải lớn hơn ngày bắt đầu." });
    }

    if (start === undefined) {
      delete updateData.startDate;
    } else {
      updateData.startDate = start;
    }

    if (end === undefined) {
      delete updateData.endDate;
    } else {
      updateData.endDate = end;
    }

    const updated = await Discount.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá." });
    }
    res.json({ message: "Cập nhật mã giảm giá thành công!", discount: updated });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật mã giảm giá:", err);
    res.status(500).json({ message: "Không thể cập nhật mã giảm giá." });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const deleted = await Discount.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá." });
    }
    res.json({ message: "Đã xoá mã giảm giá." });
  } catch (err) {
    console.error("❌ Lỗi khi xoá mã giảm giá:", err);
    res.status(500).json({ message: "Không thể xoá mã giảm giá." });
  }
};

module.exports = {
  createDiscount,
  getAllDiscounts,
  getActiveDiscounts,
  validateDiscount,
  updateDiscount,
  deleteDiscount,
};

