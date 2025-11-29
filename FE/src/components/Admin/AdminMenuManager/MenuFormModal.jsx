import PropTypes from "prop-types";

const MenuFormModal = ({
  isOpen,
  isEditing,
  formData,
  onChange,
  onClose,
  onSubmit,
  categoryOptions,
  onCategorySelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xl font-semibold text-slate-900">
            {isEditing ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tên món
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-emerald-500 focus:outline-none"
                placeholder="Ví dụ: Bún bò Huế"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Giá (đ)
              </label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Mô tả
            </label>
            <textarea
              name="info"
              rows={3}
              value={formData.info}
              onChange={onChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-emerald-500 focus:outline-none"
              placeholder="Giới thiệu ngắn về món ăn..."
            />
          </div>

 		  <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hình ảnh (URL)
              </label>
              <input
                name="image"
                value={formData.image}
                onChange={onChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-emerald-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Danh mục
              </label>
              <select
                value={formData.category || ""}
                onChange={(e) => onCategorySelect(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-emerald-500 focus:outline-none"
                required
              >
                <option value="" disabled>
                  Chọn danh mục
                </option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Giảm giá (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={onChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-emerald-500 focus:outline-none"
              />
            </div>
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
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-emerald-700 hover:to-green-700"
            >
              {isEditing ? "Lưu thay đổi" : "Thêm món"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

MenuFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool,
  formData: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    info: PropTypes.string,
    image: PropTypes.string,
    discountPercent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  categoryOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  onCategorySelect: PropTypes.func.isRequired,
};

export default MenuFormModal;

