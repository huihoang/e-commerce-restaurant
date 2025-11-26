const PriceSummarySection = ({ amounts, discount, discountCode, formatPrice }) => {
  const hasItemDiscount = amounts.itemDiscountAmount > 0;
  const hasDiscountCode = discount > 0;
  
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <h4 className="mb-4 text-lg font-bold text-slate-900">💰 Tổng Kết Thanh Toán</h4>
      <div className="space-y-3">
        {/* Tạm tính (sau khi giảm giá của từng món) */}
        <div className="flex justify-between items-center">
          <span className="text-slate-700">
            Tạm tính
            {hasItemDiscount && (
              <span className="text-xs text-orange-600 ml-2">(đã giảm giá trên món)</span>
            )}
          </span>
          <span className="font-semibold text-slate-900">
            {formatPrice(amounts.subtotal)}
          </span>
        </div>
        
        {/* Giảm giá mã giảm giá */}
        {hasDiscountCode && (
          <div className="flex justify-between items-center">
            <span className="text-slate-700">
              <span className="text-blue-600 font-semibold">🎫 Giảm giá mã ({discountCode || 'Mã giảm giá'}):</span>
              <span className="text-slate-500 text-sm ml-1">({discount}%)</span>
            </span>
            <span className="font-semibold text-blue-600">
              -{formatPrice(amounts.discountCodeAmount)}
            </span>
          </div>
        )}
        
        {/* Tổng cộng */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-slate-900">Tổng cộng:</span>
            <div className="text-right">
              {hasDiscountCode && (
                <p className="text-sm text-slate-400 line-through">
                  {formatPrice(amounts.subtotal)}
                </p>
              )}
              <p className="text-2xl font-bold text-green-700">
                {formatPrice(amounts.total)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSummarySection;

