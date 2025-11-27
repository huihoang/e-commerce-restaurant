// ==================== All Import
import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/Admin/AdminDashboard/AdminSidebar";
import AdminMobileTopBar from "@/components/Admin/AdminDashboard/AdminMobileTopBar";
import AdminMobileDrawer from "@/components/Admin/AdminDashboard/AdminMobileDrawer";

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
      <AdminSidebar
        isAdmin={isAdmin}
        menuOptions={menuOptions}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        onLogout={onLogout}
      />

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <AdminMobileTopBar
          isAdmin={isAdmin}
          activeLabel={activeMenu.label}
          onOpenMenu={() => setIsMenuOpen(true)}
        />

        <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-md">
          <Outlet />
        </div>
      </main>

      <AdminMobileDrawer
        isAdmin={isAdmin}
        isMenuOpen={isMenuOpen}
        menuOptions={menuOptions}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        onLogout={onLogout}
        onClose={closeMenu}
      />
    </div>
  );
};

export default AdminDashboard;

AdminDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};