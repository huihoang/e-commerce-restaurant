const MenuCardsGrid = ({
  items,
  formatPrice,
  categoryColorMap,
  onEdit,
  onDelete,
}) => {
  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
        Không tìm thấy món ăn nào phù hợp. Hãy thử từ khóa khác.
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item._id}
          className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="relative h-44 w-full flex-shrink-0 overflow-hidden">
            <img
              src={item.image || "/placeholder.png"}
              alt={item.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${
                categoryColorMap[item.category] || "bg-slate-900/70"
              }`}
            >
              {item.category || "Chưa phân loại"}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {item.info || "Chưa có mô tả"}
              </p>
            </div>
            <div className="mt-1">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
                {formatPrice(item.price)}
              </span>
              {item.discountPercent ? (
                <span className="ml-2 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-500">
                  -{item.discountPercent}%
                </span>
              ) : null}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Cập nhật:{" "}
                {(item.updatedAt &&
                  new Date(item.updatedAt).toLocaleDateString("vi-VN")) ||
                  "—"}
              </span>
              <span>ID: {item._id.slice(-6)}</span>
            </div>
            <div className="mt-auto flex gap-2 pt-2">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
              >
                ✏️ Sửa
              </button>
              <button
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
  );
};

export default MenuCardsGrid;

