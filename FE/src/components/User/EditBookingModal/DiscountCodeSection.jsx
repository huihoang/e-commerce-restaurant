import { useState, useMemo } from "react";

const DiscountCodeSection = ({ booking, onSelectDiscount, onRemoveDiscount }) => {
  const [showDiscountList, setShowDiscountList] = useState(false);
  const [searchDiscount, setSearchDiscount] = useState("");

  const mockDiscountCodes = [
    { code: "WELCOME10", discount: 10, description: "Giảm 10% cho khách hàng mới" },
    { code: "SAVE20", discount: 20, description: "Giảm 20% cho đơn hàng trên 500k" },
    { code: "WEEKEND15", discount: 15, description: "Giảm 15% vào cuối tuần" },
    { code: "VIP25", discount: 25, description: "Giảm 25% cho thành viên VIP" },
    { code: "HAPPY30", discount: 30, description: "Giảm 30% cho đơn hàng lớn" },
    { code: "FIRST5", discount: 5, description: "Giảm 5% cho đơn đầu tiên" },
    { code: "BIRTHDAY20", discount: 20, description: "Giảm 20% nhân dịp sinh nhật" },
    { code: "SUMMER15", discount: 15, description: "Giảm 15% mùa hè" },
  ];

  const filteredDiscountCodes = useMemo(() => {
    return mockDiscountCodes.filter(
      (code) =>
        code.code.toLowerCase().includes(searchDiscount.toLowerCase()) ||
        code.description.toLowerCase().includes(searchDiscount.toLowerCase())
    );
  }, [searchDiscount]);

  const handleSelect = (code) => {
    onSelectDiscount(code);
    setShowDiscountList(false);
    setSearchDiscount("");
  };

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-900">🎟️ Mã Giảm Giá</h4>
        <button
          type="button"
          onClick={() => setShowDiscountList(!showDiscountList)}
          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          {showDiscountList ? "Ẩn danh sách" : "Chọn mã giảm giá"}
        </button>
      </div>

      {booking.discountCode ? (
        <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
          <div>
            <p className="font-semibold text-slate-900">
              🎁 {booking.discountCode}
            </p>
            <p className="text-sm text-slate-600">Giảm {booking.discount}%</p>
          </div>
          <button
            type="button"
            onClick={onRemoveDiscount}
            className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-200"
          >
            ✕ Xóa
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-600">
          Chưa có mã giảm giá được áp dụng
        </p>
      )}

      {showDiscountList && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm mã giảm giá..."
              value={searchDiscount}
              onChange={(e) => setSearchDiscount(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-inner transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            <div className="space-y-2">
              {filteredDiscountCodes.length === 0 ? (
                <p className="text-center text-sm text-slate-500">
                  Không tìm thấy mã giảm giá
                </p>
              ) : (
                filteredDiscountCodes.map((code) => (
                  <button
                    key={code.code}
                    type="button"
                    onClick={() => handleSelect(code)}
                    className="w-full flex items-center justify-between rounded-xl border-2 border-slate-200 bg-white p-3 text-left transition hover:border-amber-300 hover:shadow-md"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        🎟️ {code.code}
                      </p>
                      <p className="text-xs text-slate-600">{code.description}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
                      -{code.discount}%
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCodeSection;

