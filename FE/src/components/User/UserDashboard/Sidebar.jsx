const Sidebar = ({ menuOptions, activeMenu, onMenuClick, onLogout }) => {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-100 border-r p-4 space-y-3 sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold text-green-700 mb-4">👤 Nhân Viên</h2>
      {menuOptions.map((item) => (
        <button
          key={item.path}
          onClick={() => onMenuClick(item.path)}
          className={`block w-full text-left px-4 py-2 rounded-lg ${
            activeMenu.path === item.path
              ? "bg-green-600 text-white"
              : "hover:bg-green-100 text-gray-800"
          } transition duration-200`}
          type="button"
        >
          {item.label}
        </button>
      ))}

      <button
        onClick={onLogout}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200"
        type="button"
      >
        🚪 Đăng Xuất
      </button>
    </aside>
  );
};

export default Sidebar;


