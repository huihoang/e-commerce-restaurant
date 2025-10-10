// ==================== All Import
import React, { useState, useEffect } from "react";
import BookUser from "./BookUsers";
import BookingHistory from "./BookingHistory";
import UserProfile from "./UserProfile";

// ==================== All Components
const UserDashboard = ({ onLogout }) => {
  // Lấy trạng thái của selectedMenu từ localStorage khi trang tải lại
  const [selectedMenu, setSelectedMenu] = useState(
    localStorage.getItem("selectedMenu") || "Thông Tin Tài Khoản"
  );

  // Cập nhật lại selectedMenu vào localStorage mỗi khi người dùng thay đổi menu
  useEffect(() => {
    localStorage.setItem("selectedMenu", selectedMenu);
  }, [selectedMenu]);

  const renderContent = () => {
    switch (selectedMenu) {
      case "Đặt Bàn":
        return <BookUser />;
      case "Lịch Sử Đặt Bàn":
        return <BookingHistory />;
      case "Thông Tin Tài Khoản":
        return <UserProfile />;
      default:
        return <p>Chọn một mục để xem chi tiết.</p>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar menu bên trái */}
      <aside className="w-64 bg-gray-100 border-r p-4 space-y-3">
        <h2 className="text-xl font-bold text-green-700 mb-4">👤 Người Dùng</h2>
        {["Đặt Bàn", "Lịch Sử Đặt Bàn", "Thông Tin Tài Khoản"].map((item) => (
          <button
            key={item}
            onClick={() => setSelectedMenu(item)}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              selectedMenu === item
                ? "bg-green-600 text-white"
                : "hover:bg-green-100 text-gray-800"
            } transition duration-200`}
          >
            {item}
          </button>
        ))}

        {/* Đăng xuất */}
        <button
          onClick={onLogout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200"
        >
          🚪 Đăng Xuất
        </button>
      </aside>

      {/* Nội dung bên phải */}
      <main className="flex-1 p-10 bg-white">
        <h1 className="text-2xl font-semibold text-green-700 mb-4">
          {selectedMenu}
        </h1>
        <div className="bg-gray-50 border rounded-xl p-6 shadow-sm">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
