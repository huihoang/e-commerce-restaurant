import Pagination from "@/components/common/Pagination";

const BlogGrid = ({
  paginatedBlogs,
  truncateContent,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
      <div className="mt-2 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {paginatedBlogs.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
            Không tìm thấy bài viết phù hợp. Hãy thử từ khóa khác.
          </div>
        )}
        {paginatedBlogs.map((item) => (
          <article
            key={item._id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={item.image || "/blog-placeholder.png"}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
                {item.category || "Chưa phân loại"}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                  : "—"}
              </span>
              <h3 className="text-xl font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600">
                {truncateContent(item.content || "")}
              </p>
              <div className="mt-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="flex-1 rounded-full bg-indigo-600/10 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                >
                  ✏️ Sửa
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item._id)}
                  className="flex-1 rounded-full bg-rose-600/10 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
                >
                  🗑 Xoá
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
};

export default BlogGrid;


