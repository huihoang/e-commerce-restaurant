// ==================== All Import
import React, { useState, useEffect } from "react";
import UserAdmin from "./AdminUserManager";
import MenuAdmin from "../../../../../Admin/AdminMenuManager";
import BlogAdmin from "../../../../../Admin/AdminBlogList";
import BookingAdmin from "../../../../../Admin/AdminBookingList";
import ContactList from "./AdminContactList";

// ==================== All Components
const AdminDashboard = ({ onLogout }) => {
  const [selectedSection, setSelectedSection] = useState(() => {
    return localStorage.getItem("admin-section") || "Quản Lý Người Dùng";
  });

  useEffect(() => {
    localStorage.setItem("admin-section", selectedSection);
  }, [selectedSection]);

  const renderSection = () => {
    switch (selectedSection) {
      case "Quản Lý Người Dùng":
        return <UserAdmin />;
      case "Quản Lý Menu":
        return <MenuAdmin />;
      case "Quản Lý Blog":
        return <BlogAdmin />;
      case "Quản Lý Đặt Bàn":
        return <BookingAdmin />;
      case "Quản Lý Liên Hệ":
        return <ContactList />;
      default:
        return <p>Chọn mục quản lý để xem chi tiết.</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 space-y-3">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          🛠️ Quản trị viên
        </h2>
        {[
          "Quản Lý Người Dùng",
          "Quản Lý Menu",
          "Quản Lý Blog",
          "Quản Lý Đặt Bàn",
          "Quản Lý Liên Hệ",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setSelectedSection(item)}
            className={`block w-full text-left px-4 py-2 rounded-lg ${selectedSection === item
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100 text-gray-800"
              } transition duration-200`}
          >
            {item}
          </button>
        ))}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200"
        >🚪 Đăng Xuất </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-semibold text-blue-700 mb-4">{selectedSection}</h1>
        <div className="bg-white border rounded-xl p-6 shadow-md">{renderSection()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;