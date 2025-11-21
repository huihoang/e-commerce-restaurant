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

    people: { type: Number, default: false },
    note: String,
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
        total += menuItem.price * dish.quantity;
      }
    }

    // Gán lại totalAmount cho update
    update.totalAmount = total;
    this.setUpdate(update);

    next();
  } catch (err) {
    next(err);
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
