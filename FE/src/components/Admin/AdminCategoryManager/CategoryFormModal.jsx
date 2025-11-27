const CategoryFormModal = ({
  isOpen,
  editingId,
  form,
  onChange,
  onSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xl font-semibold text-slate-900">
            {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="category-name"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Tên danh mục
            </label>
            <input
              id="category-name"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-purple-500 focus:outline-none"
              placeholder="Ví dụ: Đồ uống"
            />
          </div>
          <div>
            <label
              htmlFor="category-description"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Mô tả
            </label>
            <textarea
              id="category-description"
              name="description"
              rows={3}
              value={form.description}
              onChange={onChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-purple-500 focus:outline-none"
              placeholder="Mô tả ngắn gọn về danh mục..."
            />
          </div>
          <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
              className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <span>Đang hoạt động</span>
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
              className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-purple-700 hover:to-indigo-700"
            >
              {editingId ? "Lưu thay đổi" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;


