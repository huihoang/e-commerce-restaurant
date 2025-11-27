const MobileTopBar = ({ activeLabel, onOpenMenu }) => {
  return (
    <div className="lg:hidden flex items-center justify-between mb-6">
      <div>
        <p className="text-sm text-slate-500">👤 Nhân Viên</p>
        <h1 className="text-xl font-semibold text-green-700">{activeLabel}</h1>
      </div>
      <button
        type="button"
        className="inline-flex flex-col gap-1 p-3 rounded-lg border border-green-200 text-green-700 shadow-sm"
        onClick={onOpenMenu}
        aria-label="Mở menu nhân viên"
      >
        <span className="w-6 h-0.5 bg-green-700" />
        <span className="w-6 h-0.5 bg-green-700" />
        <span className="w-6 h-0.5 bg-green-700" />
      </button>
    </div>
  );
};

export default MobileTopBar;


