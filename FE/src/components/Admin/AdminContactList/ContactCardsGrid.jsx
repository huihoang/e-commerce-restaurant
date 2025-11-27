const ContactCardsGrid = ({
  loading,
  contacts,
  hasFiltersApplied,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
        {hasFiltersApplied
          ? "Không có liên hệ nào khớp điều kiện tìm kiếm."
          : "Chưa có liên hệ nào."}
      </div>
    );
  }

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString("vi-VN") : "—";

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {contacts.map((contact) => (
        <article
          key={contact._id}
          className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {contact.name}
              </p>
              <p className="text-xs text-slate-400">{contact.email}</p>
            </div>
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
              {contact.subject || "Chung"}
            </span>
          </div>

          <p className="mt-4 whitespace-pre-line text-sm text-slate-600">
            {contact.message}
          </p>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>{formatDate(contact.createdAt)}</span>
            <button
              onClick={() => onDelete(contact._id)}
              className="rounded-full bg-rose-600/10 px-4 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
            >
              🗑 Xoá
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ContactCardsGrid;

