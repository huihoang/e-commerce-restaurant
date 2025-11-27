const UserStatsSection = ({ roleCounts }) => {
  return (
    <section className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">📊 Thống kê người dùng</h2>
          <p className="mt-1 text-sm text-slate-600">
            Tổng số tài khoản đã đăng ký trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{roleCounts.total}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
              Tổng người dùng
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Quản trị viên</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">{roleCounts.admin}</p>
            </div>
            <span className="text-3xl">👑</span>
          </div>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Nhân viên</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{roleCounts.staff}</p>
            </div>
            <span className="text-3xl">👔</span>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Người dùng</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{roleCounts.user}</p>
            </div>
            <span className="text-3xl">👤</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserStatsSection;

