const TableHeroSection = ({ stats, onAddTable }) => {
  const cards = [
    { label: "Tổng bàn", value: stats.total, accent: "text-white" },
    {
      label: "Đang hoạt động",
      value: stats.active,
      accent: "text-emerald-200",
    },
    {
      label: "Ngừng hoạt động",
      value: stats.inactive,
      accent: "text-rose-200",
    },
    {
      label: "Tổng sức chứa",
      value: stats.totalCapacity,
      accent: "text-yellow-200",
    },
  ];

  return (
    <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            Trung tâm quản lý bàn
          </p>
          <h1 className="mt-1 text-3xl font-semibold">Quản lý bàn ăn</h1>
          <p className="mt-2 text-sm text-white/80">
            Quản lý danh sách bàn, sức chứa và vị trí trong nhà hàng.
          </p>
        </div>
        <button
          onClick={onAddTable}
          className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white outline-none transition hover:bg-white/25"
        >
          ➕ Thêm bàn mới
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-4">
        {cards.map((stat) => (
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

export default TableHeroSection;

