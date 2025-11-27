const MenuHeroSection = ({ stats, onAddItem }) => {
  const cards = [
    { label: "Tổng món ăn", value: stats.totalItems, accent: "text-white" },
    { label: "Danh mục", value: stats.categoryCount, accent: "text-yellow-200" },
    { label: "Món nổi bật", value: stats.featuredText, accent: "text-white" },
  ];

  return (
    <section className="rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-white shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Trung tâm menu</p>
          <h1 className="mt-1 text-3xl font-semibold">Quản lý món ăn & giá bán</h1>
          <p className="mt-2 text-sm text-white/80">
            Cập nhật menu theo mùa, quản lý hình ảnh và giá chỉ với một cú click.
          </p>
        </div>
        <button
          onClick={onAddItem}
          className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white outline-none transition hover:bg-white/25"
        >
          ➕ Thêm món mới
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-widest text-white/80">{card.label}</p>
            <p className={`mt-1 text-xl font-semibold ${card.accent}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuHeroSection;

