const TableFormModal = ({
  isOpen,
  isEditing,
  formData,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xl font-semibold text-slate-900">
            {isEditing ? "Chỉnh sửa bàn" : "Thêm bàn mới"}
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
                Số bàn <span className="text-red-500">*</span>
              </label>
              <input
                name="number"
                value={formData.number}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-indigo-500 focus:outline-none"
                placeholder="Ví dụ: Bàn 1, T1, A1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sức chứa (người) <span className="text-red-500">*</span>
              </label>
              <input
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-indigo-500 focus:outline-none"
                placeholder="Ví dụ: 4"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Vị trí
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={onChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-indigo-500 focus:outline-none"
              placeholder="Ví dụ: Tầng 1, Khu vực A"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={3}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-indigo-500 focus:outline-none"
              placeholder="Ghi chú về bàn (nếu có)..."
            />
          </div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={onChange}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-semibold text-slate-700">
              Đang hoạt động
            </span>
          </label>
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
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700"
            >
              {isEditing ? "Lưu thay đổi" : "Thêm bàn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableFormModal;

