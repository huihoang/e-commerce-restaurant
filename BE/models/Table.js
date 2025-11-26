const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true, min: 1 },
  location: { type: String }, // Ví dụ: "Tầng 1", "Khu vực A"
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
