const PriceSummarySection = ({ amounts, discount, formatPrice }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <h4 className="mb-4 text-lg font-bold text-slate-900">💰 Tổng Kết Thanh Toán</h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-700">Tạm tính:</span>
          <span className="font-semibold text-slate-900">{formatPrice(amounts.subtotal)}</span>
        </div>
        {discount > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Giảm giá ({discount}%):</span>
              <span className="font-semibold text-red-600">
                -{formatPrice(amounts.discountAmount)}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Tổng cộng:</span>
                <div className="text-right">
                  <p className="text-sm text-slate-400 line-through">
                    {formatPrice(amounts.subtotal)}
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatPrice(amounts.total)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {discount === 0 && (
          <div className="border-t border-slate-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Tổng cộng:</span>
              <span className="text-2xl font-bold text-green-700">
                {formatPrice(amounts.total)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceSummarySection;

