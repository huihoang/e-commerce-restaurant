import PropTypes from "prop-types";

const OrderTypeInfoSection = ({ booking, userRole = "user" }) => {
  const orderType = booking.orderType || "dine-in";
  const isPaid = booking.payment?.isPaid || false;
  const deliveryAddress = booking.deliveryAddress || booking.ship?.address;
  const deliveryEmail = booking.deliveryEmail || "";
  const durationMinutes = Number(booking.durationMinutes || 60);
  const formatEndTime = () => {
    if (!booking.time) return null;
    const [h, m] = booking.time.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    const total = h * 60 + m + durationMinutes;
    const normalized = ((total % (24 * 60)) + (24 * 60)) % (24 * 60);
    const hh = String(Math.floor(normalized / 60)).padStart(2, "0");
    const mm = String(normalized % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  };
  const endTime = formatEndTime();
  const tableInfo = booking.tableId;
  let tableLabel = null;
  if (tableInfo?.name) {
    tableLabel = tableInfo.name;
  } else if (tableInfo?.number) {
    tableLabel = `Bàn ${tableInfo.number}`;
  } else if (booking.tableNumber) {
    tableLabel = `Bàn ${booking.tableNumber}`;
  }
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
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
            orderType === "dine-in" ? "bg-blue-500" : "bg-purple-500"
          }`}
        >
          {orderType === "dine-in" ? "🍽️ Ăn tại quán" : "📦 Đem đi"}
        </span>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            isPaid
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPaid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}
        </span>
      </div>

      {orderType === "dine-in" && tableLabel && (
        <div className="bg-white rounded-xl p-4">
          <p className="text-sm text-slate-600 mb-1">Bàn phục vụ</p>
          <p className="text-2xl font-bold text-blue-600">
            {tableLabel}
          </p>
          {tableMeta.length > 0 && (
            <p className="text-sm text-slate-500 mt-1">
              {tableMeta.join(" • ")}
            </p>
          )}
          <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            <div className="rounded-lg bg-blue-50 px-3 py-2">
              <p className="font-semibold">🕒 Giờ đến</p>
              <p className="text-slate-900">{booking.time || "N/A"}</p>
            </div>
            {endTime && (userRole === "staff" || userRole === "admin") && (
              <div className="rounded-lg bg-indigo-50 px-3 py-2">
                <p className="font-semibold">⏳ Giờ trả bàn</p>
                <p className="text-slate-900">
                  {endTime}{" "}
                  <span className="text-xs text-slate-500">
                    ({durationMinutes} phút)
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {orderType === "takeaway" && (deliveryAddress || deliveryEmail) && (
        <div className="bg-white rounded-xl p-4 space-y-3">
          <h5 className="font-semibold text-slate-900 mb-3">📦 Thông Tin Giao Hàng</h5>
          {deliveryAddress && (
            <div>
              <p className="text-sm text-slate-600">Địa chỉ giao hàng</p>
              <p className="font-semibold text-slate-900">{deliveryAddress}</p>
            </div>
          )}
          {deliveryEmail && (
            <div>
              <p className="text-sm text-slate-600">Email liên hệ</p>
              <p className="font-semibold text-slate-900">{deliveryEmail}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

OrderTypeInfoSection.propTypes = {
  booking: PropTypes.shape({
    orderType: PropTypes.string,
    payment: PropTypes.shape({
      isPaid: PropTypes.bool,
    }),
    time: PropTypes.string,
    tableNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableId: PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      capacity: PropTypes.number,
      area: PropTypes.string,
      location: PropTypes.string,
    }),
    tableLocation: PropTypes.string,
    deliveryAddress: PropTypes.string,
    deliveryEmail: PropTypes.string,
    ship: PropTypes.shape({
      address: PropTypes.string,
    }),
    durationMinutes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  userRole: PropTypes.oneOf(["user", "staff", "admin"]),
};

export default OrderTypeInfoSection;

