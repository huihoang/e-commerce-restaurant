const HeroStatsCard = ({ stats, onRefresh }) => {
  return (
    <div className="mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 text-white shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">📋 Lịch Sử Đặt Món</h2>
        <button
          onClick={onRefresh}
          className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
        >
          🔄 Làm mới
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90">Tổng đơn</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90">Đã thanh toán</p>
          <p className="text-2xl font-bold text-green-200">{stats.paid}</p>
        </div>
        <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90">Chưa thanh toán</p>
          <p className="text-2xl font-bold text-yellow-200">{stats.unpaid}</p>
        </div>
        <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90">Tổng chi tiêu</p>
          <p className="text-2xl font-bold">
            {stats.totalSpent.toLocaleString("vi-VN")} đ
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroStatsCard;

