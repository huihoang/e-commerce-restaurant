const OrderTypeInfoSection = ({ booking }) => {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
            booking.orderType === "dine-in" ? "bg-blue-500" : "bg-purple-500"
          }`}
        >
          {booking.orderType === "dine-in" ? "🍽️ Ăn tại quán" : "📦 Đem đi"}
        </span>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            booking.isPaid
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {booking.isPaid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}
        </span>
      </div>

      {booking.orderType === "dine-in" && booking.tableNumber && (
        <div className="bg-white rounded-xl p-4">
          <p className="text-sm text-slate-600 mb-1">Số bàn</p>
          <p className="text-2xl font-bold text-blue-600">Bàn số {booking.tableNumber}</p>
        </div>
      )}

      {booking.orderType === "takeaway" && booking.shippingInfo && (
        <div className="bg-white rounded-xl p-4 space-y-3">
          <h5 className="font-semibold text-slate-900 mb-3">📦 Thông Tin Giao Hàng</h5>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-600">Người giao hàng</p>
              <p className="font-semibold text-slate-900">{booking.shippingInfo.shipperName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Số điện thoại</p>
              <p className="font-semibold text-slate-900">{booking.shippingInfo.shipperPhone}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Thời gian dự kiến</p>
              <p className="font-semibold text-slate-900">{booking.shippingInfo.estimatedTime}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-slate-600">Địa chỉ giao hàng</p>
              <p className="font-semibold text-slate-900">{booking.shippingInfo.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTypeInfoSection;

