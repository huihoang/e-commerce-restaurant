const DiscountFormModal = ({
  isOpen,
  isEditing,
  form,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const triggerPicker = (event) => {
    event.currentTarget.showPicker?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xl font-semibold text-slate-900">
            {isEditing ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mã giảm giá
              </label>
              <input
                name="code"
                value={form.code}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
                placeholder="Ví dụ: SUMMER20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phần trăm giảm
              </label>
              <input
                name="discountPercent"
                type="number"
                min="0"
                max="100"
                value={form.discountPercent}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Mô tả
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={onChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
              placeholder="Mô tả ngắn cho khách hàng"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Bắt đầu (tuỳ chọn)
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={form.startDate}
                onChange={onChange}
                onClick={triggerPicker}
                onFocus={triggerPicker}
                className="mt-1 w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Kết thúc (tuỳ chọn)
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={form.endDate}
                onChange={onChange}
                onClick={triggerPicker}
                onFocus={triggerPicker}
                className="mt-1 w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Giới hạn sử dụng (tuỳ chọn)
              </label>
              <input
                type="number"
                min="0"
                name="usageLimit"
                value={form.usageLimit}
                onChange={onChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
                placeholder="Ví dụ: 100"
              />
            </div>
            <label className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={onChange}
                className="h-5 w-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
              />
              <span>Đang kích hoạt</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-green-700 hover:to-emerald-700"
            >
              {isEditing ? "Lưu thay đổi" : "Tạo mã"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountFormModal;

