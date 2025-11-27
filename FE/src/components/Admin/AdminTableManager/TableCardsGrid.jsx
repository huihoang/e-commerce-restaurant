const TableCardsGrid = ({
  loading,
  tables,
  hasFiltersApplied,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
        {hasFiltersApplied
          ? "Không tìm thấy bàn phù hợp."
          : "Chưa có bàn nào. Hãy thêm bàn mới!"}
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tables.map((table) => (
        <article
          key={table._id}
          className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-400">Bàn số</p>
              <h3 className="text-2xl font-semibold text-slate-900">
                {table.number}
              </h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                table.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {table.isActive ? "Đang hoạt động" : "Ngừng"}
            </span>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold">Sức chứa:</span>{" "}
              {table.capacity} người
            </p>
            {table.location && (
              <p>
                <span className="font-semibold">Vị trí:</span> {table.location}
              </p>
            )}
            {table.description && (
              <p className="line-clamp-2">{table.description}</p>
            )}
          </div>
          <div className="mt-auto flex gap-2 pt-4">
            <button
              onClick={() => onEdit(table)}
              className="flex-1 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              ✏️ Sửa
            </button>
            <button
              onClick={() => onDelete(table._id)}
              className="rounded-full bg-rose-600/10 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
            >
              🗑 Xoá
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default TableCardsGrid;

