const AdminMobileDrawer = ({
  isAdmin,
  isMenuOpen,
  menuOptions,
  activeMenu,
  onMenuClick,
  onLogout,
  onClose,
}) => {
  const titleColor = isAdmin ? "text-blue-700" : "text-green-700";

  return (
    <>
      <button
        type="button"
        aria-label="Đóng menu quản trị"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-full bg-white z-50 shadow-xl lg:hidden transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className={`text-lg font-semibold ${titleColor}`}>
            {isAdmin ? "🛠️ Quản trị viên" : "👔 Nhân viên"}
          </h2>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-slate-100"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {menuOptions.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => onMenuClick(item.path)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition duration-200 ${
                activeMenu.path === item.path
                  ? isAdmin
                    ? "bg-blue-600 text-white shadow"
                    : "bg-green-600 text-white shadow"
                  : isAdmin
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 pb-6">
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-500 transition duration-200"
          >
            🚪 Đăng Xuất
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminMobileDrawer;


