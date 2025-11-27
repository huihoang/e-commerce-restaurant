const AdminMobileTopBar = ({ isAdmin, activeLabel, onOpenMenu }) => {
  const colorClass = isAdmin ? "text-blue-700" : "text-green-700";

  return (
    <div className="lg:hidden flex items-center justify-between mb-6">
      <div>
        <p className="text-sm text-slate-500">
          {isAdmin ? "🛠️ Quản trị viên" : "👔 Nhân viên"}
        </p>
        <h1 className={`text-xl font-semibold ${colorClass}`}>{activeLabel}</h1>
      </div>
      <button
        type="button"
        className={`inline-flex flex-col gap-1 p-3 rounded-lg border shadow-sm ${
          isAdmin ? "border-blue-200 text-blue-700" : "border-green-200 text-green-700"
        }`}
        onClick={onOpenMenu}
        aria-label="Mở menu"
      >
        <span className={`w-6 h-0.5 ${isAdmin ? "bg-blue-700" : "bg-green-700"}`} />
        <span className={`w-6 h-0.5 ${isAdmin ? "bg-blue-700" : "bg-green-700"}`} />
        <span className={`w-6 h-0.5 ${isAdmin ? "bg-blue-700" : "bg-green-700"}`} />
      </button>
    </div>
  );
};

export default AdminMobileTopBar;


