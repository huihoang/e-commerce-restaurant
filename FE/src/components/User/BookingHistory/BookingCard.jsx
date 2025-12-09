import PropTypes from "prop-types";

const BookingCard = ({
  booking,
  amounts,
  formatPrice,
  onViewDetail,
  onEdit,
  onDelete,
  onPayment,
  userRole = "user",
}) => {
  const orderType = booking.orderType || "dine-in";
  const isPaid = booking.payment?.isPaid || false;
  const deliveryAddress = booking.deliveryAddress || booking.ship?.address;
  const deliveryEmail = booking.deliveryEmail || "";
  const tableInfo = booking.tableId;
  const tableLabel =
    tableInfo?.name ||
    (tableInfo?.number
      ? `Bàn ${tableInfo.number}`
      : booking.tableNumber
      ? `Bàn ${booking.tableNumber}`
      : null);
  const tableMeta = [];
  if (tableInfo?.capacity) {
    tableMeta.push(`${tableInfo.capacity} người`);
  }
  if (tableInfo?.area) {
    tableMeta.push(tableInfo.area);
  }
  const locationLabel = tableInfo?.location || booking.tableLocation;
  if (locationLabel) {
    tableMeta.push(locationLabel);
  }

  const durationMinutes = Number(booking.durationMinutes || 60);
  const endTime = (() => {
    if (!booking.time) return null;
    const [h, m] = booking.time.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    const total = h * 60 + m + durationMinutes;
    const normalized = ((total % (24 * 60)) + (24 * 60)) % (24 * 60);
    const hh = String(Math.floor(normalized / 60)).padStart(2, "0");
    const mm = String(normalized % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  })();

  return (
    <div
      className="group flex flex-col md:flex-row items-start md:items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-4 md:p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300"
    >
      {/* Left: Customer/Shipping Info */}
      <div className="flex-1 w-full md:w-auto">
        <div className="flex items-start gap-4">
          {/* Status & Type Badges */}
          <div className="flex flex-col gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                isPaid ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {isPaid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                orderType === "dine-in" ? "bg-blue-500" : "bg-purple-500"
              }`}
            >
              {orderType === "dine-in" ? "🍽️ Tại quán" : "📦 Đem đi"}
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

            {orderType === "dine-in" && endTime && (userRole === "staff" || userRole === "admin") && (
              <div className="text-sm text-slate-600">
                ⏳ Giờ trả bàn: <span className="font-semibold text-slate-900">{endTime}</span>
                <span className="text-xs text-slate-500"> ({durationMinutes} phút)</span>
              </div>
            )}

            {/* Dine-in: Table Number */}
            {orderType === "dine-in" && tableLabel && (
              <div className="inline-block rounded-lg bg-blue-50 px-3 py-1">
                <p className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                  <span>🪑 {tableLabel}</span>
                  {tableMeta.length > 0 && (
                    <span className="text-xs text-blue-500">
                      ({tableMeta.join(" • ")})
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Takeaway: Shipping Info */}
            {orderType === "takeaway" && (deliveryAddress || deliveryEmail) && (
              <div className="rounded-lg bg-purple-50 p-3 space-y-1">
                <p className="text-sm font-semibold text-purple-700">
                  📦 Đơn mang đi
                </p>
                {deliveryAddress && (
                  <p className="text-xs text-purple-600">📍 {deliveryAddress}</p>
                )}
                {deliveryEmail && (
                  <p className="text-xs text-purple-600">✉️ {deliveryEmail}</p>
                )}
              </div>
            )}

            {/* Ghi chú - chỉ hiển thị nếu không phải takeaway */}
            {booking.note && orderType !== "takeaway" && (
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
          {(amounts.itemDiscountAmount > 0 || amounts.discountCodeAmount > 0) ? (
            <div>
              <p className="text-sm text-slate-400 line-through">
                {formatPrice(amounts.itemDiscountAmount > 0 ? amounts.originalSubtotal : amounts.subtotal)}
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
          {(userRole === "admin" || userRole === "staff" || (userRole === "user" && isPaid)) && (
            <button
              type="button"
              onClick={() => onViewDetail(booking)}
              className="w-full md:w-auto px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              👁️ Xem chi tiết
            </button>
          )}
          {userRole === "admin" ? (
            <>
              {!isPaid && (
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
                </>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPayment(booking);
                }}
                className={`w-full md:w-auto px-4 py-2 rounded-xl text-white text-sm font-semibold transition ${
                  isPaid
                    ? "bg-slate-500 hover:bg-slate-600"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                }`}
              >
                {isPaid ? "↩️ Đánh dấu chưa thanh toán" : "✅ Đánh dấu đã thanh toán"}
              </button>
            </>
          ) : userRole === "staff" ? (
            <>
              {!isPaid && (
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
              {isPaid && (
                <div className="w-full md:w-auto px-4 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-semibold text-center">
                  ✅ Đã thanh toán
                </div>
              )}
            </>
          ) : (
            <>
              {!isPaid && (
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
                      onPayment(booking);
                    }}
                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition"
                  >
                    💳 Thanh toán
                  </button>
                </>
              )}
              {isPaid && (
                <div className="w-full md:w-auto px-4 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-semibold text-center">
                  ✅ Đã thanh toán
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

BookingCard.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    orderType: PropTypes.string,
    payment: PropTypes.shape({
      isPaid: PropTypes.bool,
    }),
    deliveryAddress: PropTypes.string,
    deliveryEmail: PropTypes.string,
    ship: PropTypes.shape({
      address: PropTypes.string,
    }),
    discount: PropTypes.number,
    name: PropTypes.string,
    phone: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    people: PropTypes.number,
      tableNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tableId: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        capacity: PropTypes.number,
        area: PropTypes.string,
      location: PropTypes.string,
      }),
    note: PropTypes.string,
    selectedDishes: PropTypes.arrayOf(
      PropTypes.shape({
        dishId: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            name: PropTypes.string,
            image: PropTypes.string,
            price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          }),
        ]),
        quantity: PropTypes.number,
      })
    ),
  }).isRequired,
  amounts: PropTypes.shape({
    originalSubtotal: PropTypes.number,
    itemDiscountAmount: PropTypes.number,
    subtotal: PropTypes.number,
    discountCodeAmount: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
  booking: PropTypes.shape({
    durationMinutes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  formatPrice: PropTypes.func.isRequired,
  onViewDetail: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPayment: PropTypes.func.isRequired,
  userRole: PropTypes.oneOf(["user", "staff", "admin"]),
};

export default BookingCard;

