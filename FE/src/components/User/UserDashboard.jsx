// ==================== All Import
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/User/UserDashboard/Sidebar";
import MobileTopBar from "@/components/User/UserDashboard/MobileTopBar";
import MobileDrawer from "@/components/User/UserDashboard/MobileDrawer";

const menuOptions = [
  { label: "Đặt Món", path: "book" },
  { label: "Lịch Sử Đặt Món", path: "history" },
  { label: "Thông Tin Tài Khoản", path: "profile" },
];

// ==================== All Components
const UserDashboard = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentSegment = location.pathname.replace(/^\/user\/?/, "") || "book";
  const activeMenu =
    menuOptions.find((item) => item.path === currentSegment) || menuOptions[0];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleMenuClick = (path) => {
    navigate(`/user/${path}`);
    closeMenu();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar
        menuOptions={menuOptions}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        onLogout={onLogout}
      />

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <MobileTopBar
          activeLabel={activeMenu.label}
          onOpenMenu={() => setIsMenuOpen(true)}
        />

        <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-md">
          <Outlet />
        </div>
      </main>

      <MobileDrawer
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

export default UserDashboard;

UserDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
