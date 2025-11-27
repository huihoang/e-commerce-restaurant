import DropdownSelect from "@/components/common/DropdownSelect";

const BlogFormModal = ({
  isOpen,
  editId,
  form,
  categoryOptions,
  onChange,
  onCategoryChange,
  onSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-slate-900">
            {editId ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tiêu đề bài viết
              </label>
              <input
                name="title"
                placeholder="Nhập tiêu đề"
                value={form.title}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Danh mục
              </label>
              <DropdownSelect
                options={categoryOptions}
                value={form.category}
                onChange={onCategoryChange}
                placeholder="Chọn danh mục"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ảnh đại diện
              </label>
              <input
                name="image"
                placeholder="Link hình ảnh"
                value={form.image}
                onChange={onChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nội dung bài viết
            </label>
            <textarea
              name="content"
              rows={6}
              placeholder="Chia sẻ câu chuyện, công thức hoặc tin tức..."
              value={form.content}
              onChange={onChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01]"
            >
              {editId ? "Cập nhật bài viết" : "Đăng bài mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;


