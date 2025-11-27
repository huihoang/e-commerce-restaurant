const DiscountHeroSection = ({ stats, onAddClick }) => {
  const cards = [
    { label: "Tổng mã", value: stats.total, accent: "text-white" },
    { label: "Sắp diễn ra", value: stats.upcoming, accent: "text-yellow-200" },
    { label: "Đang diễn ra", value: stats.active, accent: "text-emerald-200" },
    { label: "Hết hạn", value: stats.expired, accent: "text-rose-200" },
  ];

  return (
    <section className="rounded-3xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 text-white shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            Trung tâm khuyến mãi
          </p>
          <h1 className="mt-1 text-3xl font-semibold">Quản lý mã giảm giá</h1>
          <p className="mt-2 text-sm text-white/80">
            Thiết lập và theo dõi mã giảm giá cho các chiến dịch bán hàng.
          </p>
        </div>
        <button
          onClick={() => onAddClick()}
          className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white outline-none transition hover:bg-white/25"
        >
          ➕ Thêm mã giảm giá
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

export default DiscountHeroSection;

