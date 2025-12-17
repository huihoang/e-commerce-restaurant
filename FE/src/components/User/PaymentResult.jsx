import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const role = localStorage.getItem("role") || "user";
  const orderId =
    searchParams.get("vnp_TxnRef") || searchParams.get("orderId") || "";

  useEffect(() => {
    const fetchStatus = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/order/order_status/${orderId}`
        );
        setBooking(res.data?.data || null);
        setError("");
      } catch (err) {
        console.error("❌ Lỗi khi lấy trạng thái đơn:", err.message);
        setError("Không thể lấy trạng thái đơn hàng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [API_BASE_URL, orderId]);

  const historyPath =
    role === "admin" || role === "staff" ? "/admin/history" : "/history";

  const isPaid = booking?.payment?.isPaid || false;
  const orderType = booking?.orderType || "dine-in";

  return (
    <section className="bg-slate-100 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-3xl bg-white shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Kết quả thanh toán
          </h1>

          {loading ? (
            <p className="text-slate-600">Đang tải thông tin đơn hàng...</p>
          ) : error ? (
            <p className="text-red-600 font-semibold">{error}</p>
          ) : !booking ? (
            <p className="text-slate-600">Không tìm thấy đơn hàng.</p>
          ) : (
            <div className="space-y-4">
              <div
                className={`rounded-2xl p-4 text-white ${
                  isPaid
                    ? "bg-gradient-to-r from-emerald-500 to-green-600"
                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                }`}
              >
                <p className="text-lg font-semibold">
                  {isPaid ? "Thanh toán thành công" : "Đang chờ thanh toán"}
                </p>
                <p className="text-sm opacity-90">
                  Mã đơn: {booking.payment?.orderId || orderId}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                  <p className="text-sm text-slate-500">Tổng tiền</p>
                  <p className="text-xl font-bold text-slate-900">
                    {(booking.totalAmount || 0).toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                  <p className="text-sm text-slate-500">Loại đơn</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {orderType === "takeaway" ? "Giao hàng" : "Tại quán"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Thông tin liên hệ
                </h3>
                <p className="text-sm text-slate-700">
                  👤 {booking.name || "Khách hàng"}
                </p>
                {booking.phone && (
                  <p className="text-sm text-slate-700">📞 {booking.phone}</p>
                )}
                {booking.email && (
                  <p className="text-sm text-slate-700">✉️ {booking.email}</p>
                )}
              </div>

              {orderType === "takeaway" ? (
                <div className="rounded-xl border border-slate-200 p-4 bg-white">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Thông tin giao hàng
                  </h3>
                  <p className="text-sm text-slate-700">
                    📍 {booking.deliveryAddress || "Chưa cung cấp"}
                  </p>
                  {booking.deliveryEmail && (
                    <p className="text-sm text-slate-700">
                      ✉️ {booking.deliveryEmail}
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 p-4 bg-white">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Thông tin bàn
                  </h3>
                  <p className="text-sm text-slate-700">
                    🪑 Bàn:{" "}
                    {booking.tableId?.name ||
                      booking.tableId?.number ||
                      booking.tableNumber ||
                      "Chưa cung cấp"}
                  </p>
                  <p className="text-sm text-slate-700">
                    📅 {booking.date} - ⏰ {booking.time}
                  </p>
                  <p className="text-sm text-slate-700">
                    👥 {booking.people || 1} người
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate(historyPath, { replace: true })}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                  🔙 Xem lịch sử đặt món/bàn
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/", { replace: true })}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  🏠 Về trang chủ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentResult;


