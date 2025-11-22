import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";

const PaymentModal = ({ booking, onClose, onPaymentSuccess }) => {
  const { showSuccess, showError } = useNotification();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/bookings/${booking._id}/pay`,
        { isPaid: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSuccess("Thanh toán thành công!");
      onPaymentSuccess(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi thanh toán:", err.message);
      showError("Lỗi khi thanh toán. Vui lòng thử lại!");
    }
  };

  const calculateLineTotal = (price, quantity) => price * quantity;

  const calculateTotalAmount = () => {
    return booking.selectedDishes.reduce((total, dishItem) => {
      return (
        total + calculateLineTotal(dishItem.dishId.price, dishItem.quantity)
      );
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-white">💳 Thanh toán</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-slate-400">
          {/* Booking Info */}
          <div className="mb-6 rounded-xl bg-slate-50 p-4">
            <div className="grid gap-2 text-sm">
              <p className="font-semibold text-slate-900">
                👤 Khách hàng: {booking.name || "N/A"}
              </p>
              <p className="text-slate-600">
                📅 {new Date(booking.date).toLocaleDateString("vi-VN")} - ⏰{" "}
                {booking.time}
              </p>
              <p className="text-slate-600">👥 {booking.people} người</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-[520px] w-full text-sm">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="p-4 text-left font-semibold text-slate-700">
                    Món ăn
                  </th>
                  <th className="p-4 text-center font-semibold text-slate-700">
                    Số lượng
                  </th>
                  <th className="p-4 text-right font-semibold text-slate-700">
                    Đơn giá
                  </th>
                  <th className="p-4 text-right font-semibold text-slate-700">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {booking.selectedDishes.map((dishItem, index) => (
                  <tr
                    key={index}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            dishItem.dishId?.image ||
                            "https://via.placeholder.com/50"
                          }
                          alt={dishItem.dishId?.name || "Món ăn"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-slate-900">
                          {dishItem.dishId?.name || "Tên món"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                        {dishItem.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-700">
                      {dishItem.dishId?.price?.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-emerald-600">
                        {calculateLineTotal(
                          dishItem.dishId.price,
                          dishItem.quantity
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Amount */}
          <div className="mb-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
            <span className="text-lg font-bold text-slate-700">
              💰 Tổng cộng:
            </span>
            <span className="text-2xl font-bold text-green-700">
              {calculateTotalAmount().toLocaleString("vi-VN")} đ
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handlePayment}
              className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
            >
              ✅ Xác nhận thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
