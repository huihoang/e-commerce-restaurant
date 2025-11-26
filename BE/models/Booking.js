// models/Booking.js
const mongoose = require("mongoose");
const MenuItem = require("./MenuItem");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Thông tin liên hệ
    name: String,
    phone: String,

    // Thông tin ngày ăn / ngày giao hàng
    date: String,
    time: String,

    ship: {
      isShip: { type: Boolean, default: false },
      address: { type: String, required: false },
    },

    people: { type: Number, default: 1 },
    note: String,
    orderType: {
      type: String,
      enum: ["dine-in", "takeaway"],
      default: "dine-in",
    },
           tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
           tableNumber: { type: String },
    deliveryAddress: { type: String },
    deliveryEmail: { type: String },
    discount: { type: Number, default: 0 },
    discountCode: { type: String },
    selectedDishes: [
      {
        dishId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    payment: {
      orderId: Number,
      isPaid: { type: Boolean, default: false },
      paidAt: { type: Date, required: false },
      paymentMethod: { type: String, default: "cash" },
      vnp_TransactionStatus: { type: String, default: "01" }, // Trạng thái giao dịch từ VNPAY
      description_TransactionStatus: { type: String, default: "Đang xử lý" }, // Mô tả trạng thái từ VNPAY
    },
    totalAmount: { type: Number, default: 30000 },
  },
  {
    timestamps: true,
  }
);

bookingSchema.set("toJSON", { virtuals: true });
bookingSchema.set("toObject", { virtuals: true });

bookingSchema.virtual("isPaid").get(function () {
  return this.payment?.isPaid || false;
});

// ========== Tính tổng tiền khi tạo booking ==========
// bookingSchema.pre("save", async function (next) {
//   try {
//     let total = 0;
//     for (const dish of this.selectedDishes) {
//       const menuItem = await MenuItem.findById(dish.dishId);
//       if (menuItem) {
//         total += menuItem.price * dish.quantity;
//       }
//     }
//     this.totalAmount = total;
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// ========== Tính tổng tiền khi cập nhật booking ==========
bookingSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    // Nếu không có selectedDishes mới thì bỏ qua
    if (!update.selectedDishes) return next();

    let total = 0;
    for (const dish of update.selectedDishes) {
      const menuItem = await MenuItem.findById(dish.dishId);
      if (menuItem) {
        const basePrice = Number(menuItem.price) || 0;
        const discountPercent = Number(menuItem.discountPercent) || 0;
        const discountedPrice = basePrice * (1 - discountPercent / 100);
        total += discountedPrice * (dish.quantity || 1);
      }
    }

    const discountPercent =
      typeof update.discount === "number" ? update.discount : 0;
    update.totalAmount = total - (total * discountPercent) / 100;
    this.setUpdate(update);

    next();
  } catch (err) {
    next(err);
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
