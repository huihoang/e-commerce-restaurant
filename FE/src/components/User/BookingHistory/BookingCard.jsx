const BookingCard = ({
  booking,
  amounts,
  formatPrice,
  onViewDetail,
  onEdit,
  onDelete,
  onPayment,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className="group flex flex-col md:flex-row items-start md:items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-4 md:p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetail(booking)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewDetail(booking);
        }
      }}
    >
      {/* Left: Customer/Shipping Info */}
      <div className="flex-1 w-full md:w-auto">
        <div className="flex items-start gap-4">
          {/* Status & Type Badges */}
          <div className="flex flex-col gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                booking.isPaid ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {booking.isPaid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                booking.orderType === "dine-in" ? "bg-blue-500" : "bg-purple-500"
              }`}
            >
              {booking.orderType === "dine-in" ? "🍽️ Tại quán" : "📦 Đem đi"}
            </span>
            {booking.discount > 0 && (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold">
                🔥 -{booking.discount}%
              </span>
            )}
          </div>

          {/* Customer/Shipping Details */}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                👤 {booking.name || "Khách hàng"}
              </h3>
              {booking.phone && (
                <p className="text-sm text-slate-600">📞 {booking.phone}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              <p>
                📅 {new Date(booking.date).toLocaleDateString("vi-VN")} - ⏰{" "}
                {booking.time}
              </p>
              <p>👥 {booking.people} người</p>
            </div>

            {/* Dine-in: Table Number */}
            {booking.orderType === "dine-in" && booking.tableNumber && (
              <div className="inline-block rounded-lg bg-blue-50 px-3 py-1">
                <p className="text-sm font-semibold text-blue-700">
                  🪑 Bàn số {booking.tableNumber}
                </p>
              </div>
            )}

            {/* Takeaway: Shipping Info */}
            {booking.orderType === "takeaway" && booking.shippingInfo && (
              <div className="rounded-lg bg-purple-50 p-3 space-y-1">
                <p className="text-sm font-semibold text-purple-700">
                  📦 {booking.shippingInfo.shipperName}
                </p>
                <p className="text-xs text-purple-600">
                  📞 {booking.shippingInfo.shipperPhone} | ⏱️{" "}
                  {booking.shippingInfo.estimatedTime}
                </p>
                <p className="text-xs text-purple-600">
                  📍 {booking.shippingInfo.address}
                </p>
              </div>
            )}

            {/* Ghi chú - chỉ hiển thị nếu không phải takeaway */}
            {booking.note && booking.orderType !== "takeaway" && (
              <p className="text-sm text-slate-600 italic">📝 {booking.note}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right: Price & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
        {/* Price Info */}
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-1">
            🍽️ {booking.selectedDishes?.length || 0} món
          </p>
          {booking.discount > 0 ? (
            <div>
              <p className="text-sm text-slate-400 line-through">
                {formatPrice(amounts.subtotal)}
              </p>
              <p className="text-xl font-bold text-green-600">
                {formatPrice(amounts.total)}
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold text-green-600">
              {formatPrice(amounts.total)}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          {!booking.isPaid && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(booking);
                }}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition"
              >
                ✏️ Chỉnh sửa
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(booking._id);
                }}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
              >
                🗑️ Xóa
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPayment(booking);
                }}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition"
              >
                💳 Thanh toán
              </button>
            </>
          )}
          {booking.isPaid && (
            <div className="w-full md:w-auto px-4 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-semibold text-center">
              ✅ Đã thanh toán
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;

