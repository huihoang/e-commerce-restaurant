const CategoryHeader = ({ categories, onAdd }) => {
  const total = categories.length;
  const active = categories.filter((c) => c.isActive).length;
  const inactive = total - active;

  return (
    <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            Trung tâm danh mục
          </p>
          <h1 className="mt-1 text-3xl font-semibold">
            Quản lý danh mục món ăn
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Tạo và cập nhật danh mục để đội ngũ bếp sử dụng thống nhất.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white outline-none transition hover:bg-white/25"
        >
          ➕ Thêm danh mục
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
        {[
          {
            label: "Tổng danh mục",
            value: total,
            accent: "text-white",
          },
          {
            label: "Đang hoạt động",
            value: active,
            accent: "text-emerald-200",
          },
          {
            label: "Ngừng hoạt động",
            value: inactive,
            accent: "text-amber-200",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-widest text-white/80">
              {stat.label}
            </p>
            <p className={`mt-1 text-xl font-semibold ${stat.accent}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryHeader;


