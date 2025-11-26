const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    discountPercent: { type: Number, min: 0, max: 100, required: true },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

discountSchema.virtual("status").get(function () {
  const now = new Date();
  if (!this.isActive) return "inactive";
  if (now < this.startDate) return "upcoming";
  if (now > this.endDate) return "expired";
  return "active";
});

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;

