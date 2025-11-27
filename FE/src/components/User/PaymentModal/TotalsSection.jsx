const TotalsSection = ({ booking, amounts }) => {
  return (
    <div className="mb-6 space-y-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
      {amounts.itemDiscountAmount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">
            Tổng giá gốc
          </span>
          <span className="text-base font-bold text-slate-900">
            {amounts.originalSubtotal.toLocaleString("vi-VN")} đ
          </span>
        </div>
      )}
      {amounts.itemDiscountAmount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-orange-600">
            🔥 Giảm giá trên món
          </span>
          <span className="text-base font-bold text-orange-600">
            -{amounts.itemDiscountAmount.toLocaleString("vi-VN")} đ
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600">Tạm tính</span>
        <span className="text-base font-bold text-slate-900">
          {amounts.subtotal.toLocaleString("vi-VN")} đ
        </span>
      </div>
      {booking.discount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-blue-600">
            🎫 Giảm giá mã ({booking.discountCode || "Mã giảm giá"}): (
            {booking.discount}%)
          </span>
          <span className="text-base font-bold text-blue-600">
            -{amounts.discountCodeAmount.toLocaleString("vi-VN")} đ
          </span>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-slate-200 pt-2">
        <span className="text-lg font-bold text-slate-700">💰 Tổng cộng:</span>
        <div className="text-right">
          {(amounts.itemDiscountAmount > 0 ||
            amounts.discountCodeAmount > 0) && (
            <p className="text-sm text-slate-400 line-through">
              {amounts.itemDiscountAmount > 0
                ? amounts.originalSubtotal.toLocaleString("vi-VN")
                : amounts.subtotal.toLocaleString("vi-VN")}{" "}
              đ
            </p>
          )}
          <span className="text-2xl font-bold text-green-700">
            {amounts.total.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalsSection;


