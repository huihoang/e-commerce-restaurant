import Pagination from "@/components/common/Pagination";

const CategoryGrid = ({
  loading,
  paginatedCategories,
  filteredCount,
  itemsPerPage,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
      <div className="mt-2">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
            Đang tải dữ liệu...
          </div>
        ) : paginatedCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
            Không có danh mục nào phù hợp.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedCategories.map((cat) => (
              <article
                key={cat._id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase text-slate-400">
                      #{cat.slug}
                    </p>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {cat.name}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      cat.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {cat.isActive ? "Đang hoạt động" : "Ngừng"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                  {cat.description || "Chưa có mô tả"}
                </p>
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => onEdit(cat)}
                    className="flex-1 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(cat._id)}
                    className="rounded-full bg-rose-600/10 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
                  >
                    🗑 Xoá
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {filteredCount > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </section>
  );
};

export default CategoryGrid;


