import PropTypes from "prop-types";

const OrderTypeInfoSection = ({ booking }) => {
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
    tableNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableId: PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      capacity: PropTypes.number,
      area: PropTypes.string,
    }),
    deliveryAddress: PropTypes.string,
    deliveryEmail: PropTypes.string,
    ship: PropTypes.shape({
      address: PropTypes.string,
    }),
  }).isRequired,
};

export default OrderTypeInfoSection;

