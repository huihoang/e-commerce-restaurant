import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const DiscountCodeSection = ({ booking, onSelectDiscount, onRemoveDiscount }) => {
  const [showDiscountList, setShowDiscountList] = useState(false);
  const [searchDiscount, setSearchDiscount] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/discounts/active`);
        setDiscounts(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy mã giảm giá:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, [API_BASE_URL]);

  const filteredDiscounts = useMemo(() => {
    return discounts.filter(
      (code) =>
        code.code.toLowerCase().includes(searchDiscount.toLowerCase()) ||
        (code.description || "")
          .toLowerCase()
          .includes(searchDiscount.toLowerCase())
    );
  }, [discounts, searchDiscount]);

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
              {loading ? (
                <p className="text-center text-sm text-slate-500">
                  Đang tải mã giảm giá...
                </p>
              ) : filteredDiscounts.length === 0 ? (
                <p className="text-center text-sm text-slate-500">
                  Không tìm thấy mã giảm giá
                </p>
              ) : (
                filteredDiscounts.map((code) => (
                  <button
                    key={code._id || code.code}
                    type="button"
                    onClick={() =>
                      handleSelect({
                        code: code.code,
                        discount: code.discountPercent,
                        description: code.description,
                      })
                    }
                    className="w-full flex items-center justify-between rounded-xl border-2 border-slate-200 bg-white p-3 text-left transition hover:border-amber-300 hover:shadow-md"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        🎟️ {code.code}
                      </p>
                      <p className="text-xs whitespace-pre-line text-slate-600">
                        {code.description || "Không có mô tả"}
                      </p>
                      <p className="text-xs text-slate-400">
                        HSD:{" "}
                        {code.endDate
                          ? new Date(code.endDate).toLocaleDateString("vi-VN")
                          : "Không giới hạn"}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
                      -{code.discountPercent}%
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

