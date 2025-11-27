const AdminSidebar = ({ isAdmin, menuOptions, activeMenu, onMenuClick, onLogout }) => {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r p-4 space-y-3 sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        {isAdmin ? "🛠️ Quản trị viên" : "👔 Nhân viên"}
      </h2>
      {menuOptions.map((item) => (
        <button
          key={item.path}
          type="button"
          onClick={() => onMenuClick(item.path)}
          className={`block w-full text-left px-4 py-2 rounded-lg ${
            activeMenu.path === item.path
              ? isAdmin
                ? "bg-blue-600 text-white"
                : "bg-green-600 text-white"
              : isAdmin
              ? "hover:bg-blue-100 text-gray-800"
              : "hover:bg-green-100 text-gray-800"
          } transition duration-200`}
        >
          {item.label}
        </button>
      ))}

      <button
        type="button"
        onClick={onLogout}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200"
      >
        🚪 Đăng Xuất
      </button>
    </aside>
  );
};

export default AdminSidebar;


