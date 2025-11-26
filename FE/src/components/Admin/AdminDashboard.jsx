// ==================== All Import
import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const adminMenuOptions = [
  { label: "Quản Lý Người Dùng", path: "users" },
  { label: "Quản Lý Menu", path: "menu" },
  { label: "Quản Lý Danh Mục", path: "categories" },
  { label: "Quản Lý Bàn", path: "tables" },
  { label: "Quản Lý Giảm Giá", path: "discounts" },
  { label: "Quản Lý Blog", path: "blog" },
  { label: "Quản Lý Liên Hệ", path: "contacts" },
  { label: "Lịch Sử Đặt Bàn", path: "bookings" },
];

const staffMenuOptions = [
  { label: "Đặt Món", path: "book" },
  { label: "Lịch Sử Đặt Món", path: "history" },
  { label: "Thông Tin Tài Khoản", path: "profile" },
];

// ==================== All Components
const AdminDashboard = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const role = localStorage.getItem("role") || "user";
  const isAdmin = role === "admin";
  const menuOptions = useMemo(
    () => (isAdmin ? adminMenuOptions : staffMenuOptions),
    [isAdmin]
  );

  const currentSegment =
    location.pathname.replace(/^\/admin\/?/, "") || menuOptions[0].path;
  const activeMenu =
    menuOptions.find((item) => item.path === currentSegment) || menuOptions[0];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleMenuClick = (path) => {
    navigate(`/admin/${path}`);
    closeMenu();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Desktop - Fixed */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r p-4 space-y-3 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          {isAdmin ? "🛠️ Quản trị viên" : "👔 Nhân viên"}
        </h2>
        {menuOptions.map((item) => (
          <button
            key={item.path}
            onClick={() => handleMenuClick(item.path)}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeMenu.path === item.path
              ? isAdmin ? "bg-blue-600 text-white" : "bg-green-600 text-white"
              : isAdmin ? "hover:bg-blue-100 text-gray-800" : "hover:bg-green-100 text-gray-800"
              } transition duration-200`}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={onLogout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200"
        >
          🚪 Đăng Xuất
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-500">
              {isAdmin ? "🛠️ Quản trị viên" : "👔 Nhân viên"}
            </p>
            <h1 className={`text-xl font-semibold ${isAdmin ? "text-blue-700" : "text-green-700"}`}>
              {activeMenu.label}
            </h1>
          </div>
          <button
            className={`inline-flex flex-col gap-1 p-3 rounded-lg border shadow-sm ${
              isAdmin 
                ? "border-blue-200 text-blue-700" 
                : "border-green-200 text-green-700"
            }`}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Mở menu"
          >
            <span className={`w-6 h-0.5 ${isAdmin ? "bg-blue-700" : "bg-green-700"}`} />
            <span className={`w-6 h-0.5 ${isAdmin ? "bg-blue-700" : "bg-green-700"}`} />
            <span className={`w-6 h-0.5 ${isAdmin ? "bg-blue-700" : "bg-green-700"}`} />
          </button>
        </div>

        <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-md">
          <Outlet />
        </div>
      </main>

      {/* Mobile drawer */}
      <button
        type="button"
        aria-label="Đóng menu quản trị"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-full bg-white z-50 shadow-xl lg:hidden transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className={`text-lg font-semibold ${isAdmin ? "text-blue-700" : "text-green-700"}`}>
            {isAdmin ? "🛠️ Quản trị viên" : "👔 Nhân viên"}
          </h2>
          <button
            className="p-2 rounded-full hover:bg-slate-100"
            onClick={closeMenu}
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {menuOptions.map((item) => (
            <button
              key={item.path}
              onClick={() => handleMenuClick(item.path)}
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
            onClick={() => {
              onLogout();
              setIsMenuOpen(false);
            }}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-500 transition duration-200"
          >
            🚪 Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

AdminDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};