const DiscountTable = ({ loading, discounts, formatDate, onEdit, onDelete }) => {
  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
            Đang tải dữ liệu...
          </td>
        </tr>
      );
    }

    if (discounts.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
            Không tìm thấy mã giảm giá nào.
          </td>
        </tr>
      );
    }

    return discounts.map((discount) => {
      const now = new Date();
      const start = discount.startDate ? new Date(discount.startDate) : null;
      const end = discount.endDate ? new Date(discount.endDate) : null;
      let status = "Đã tắt";
      let badge = "bg-slate-200 text-slate-600 border border-slate-200";

      if (discount.isActive) {
        if (start && now < start) {
          status = "Sắp diễn ra";
          badge = "bg-amber-100 text-amber-700 border border-amber-200";
        } else if (end && now > end) {
          status = "Hết hạn";
          badge = "bg-rose-100 text-rose-700 border border-rose-200";
        } else {
          status = "Đang diễn ra";
          badge = "bg-emerald-100 text-emerald-700 border border-emerald-200";
        }
      }

      return (
        <tr key={discount._id} className="border-t border-slate-100">
          <td className="px-4 py-3 font-semibold text-slate-900">
            {discount.code}
          </td>
          <td className="px-4 py-3 w-[28%] whitespace-pre-line text-slate-600">
            {discount.description || "—"}
          </td>
          <td className="px-4 py-3 text-center font-semibold text-emerald-600">
            -{discount.discountPercent}%
          </td>
          <td className="px-4 py-3 text-center">
            <div className="text-xs text-slate-500">
              <p>Bắt đầu: {formatDate(discount.startDate)}</p>
              <p>Kết thúc: {formatDate(discount.endDate)}</p>
            </div>
          </td>
          <td className="px-4 py-3 text-center">
            {discount.usageLimit
              ? `${discount.usageCount || 0}/${discount.usageLimit}`
              : "Không giới hạn"}
          </td>
          <td className="px-4 py-3">
            <div className="flex justify-center">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${badge}`}
              >
                {status}
              </span>
            </div>
          </td>
          <td className="px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-2 text-xs">
              <button
                onClick={() => onEdit(discount)}
                className="rounded-full bg-blue-600/10 px-3 py-1 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(discount._id)}
                className="rounded-full bg-rose-600/10 px-3 py-1 font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
              >
                🗑
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100">
      <table className="min-w-[960px] w-full text-sm text-slate-700">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Mã</th>
            <th className="px-4 py-3 text-left">Mô tả</th>
            <th className="px-4 py-3 text-center">Giảm (%)</th>
            <th className="px-4 py-3 text-center">Hiệu lực</th>
            <th className="px-4 py-3 text-center">Giới hạn</th>
            <th className="px-4 py-3 text-center">Trạng thái</th>
            <th className="px-4 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
};

export default DiscountTable;

