import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";

const UserProfile = () => {
  const { showSuccess, showError } = useNotification();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    birthday: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ==================== Mock Data Generator ====================
  const generateMockData = (userData) => {
    const mockNames = [
      "Nguyễn Văn An",
      "Trần Thị Bình",
      "Lê Văn Cường",
      "Phạm Thị Dung",
      "Hoàng Văn Em",
    ];
    const mockPhones = [
      "0901234567",
      "0912345678",
      "0923456789",
      "0934567890",
      "0945678901",
    ];

    return {
      ...userData,
      fullName: mockNames[Math.floor(Math.random() * mockNames.length)],
      birthday: new Date(
        1990 + Math.floor(Math.random() * 20),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
      phone: mockPhones[Math.floor(Math.random() * mockPhones.length)],
    };
  };

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Add mock data
      const userWithMock = generateMockData(res.data);
      setUser(userWithMock);
      setFormData({
        username: userWithMock.username,
        email: userWithMock.email,
        fullName: userWithMock.fullName || "",
        birthday: userWithMock.birthday || "",
        phone: userWithMock.phone || "",
      });
    } catch (err) {
      console.error("Lỗi khi lấy người dùng:", err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/users/me`,
        {
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          birthday: formData.birthday,
          phone: formData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showSuccess("Cập nhật thông tin thành công!");
      setIsEditing(false);
      await fetchUser();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err.response?.data || err.message);
      showError("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName || "",
      birthday: user.birthday || "",
      phone: user.phone || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-slate-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
        <p className="text-slate-500">Không thể tải thông tin người dùng</p>
      </div>
    );
  }

  const role = localStorage.getItem("role") || "user";
  const roleLabel = role === "admin" ? "Quản trị viên" : "Nhân viên";

  return (
    <div>
      {/* ==================== Hero Card ==================== */}
      <div className="mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
              {user.fullName?.charAt(0).toUpperCase() ||
                user.username?.charAt(0).toUpperCase() ||
                "U"}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">
              {user.fullName || user.username}
            </h2>
            <p className="text-emerald-100 mb-4">{user.email}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                👤 {roleLabel}
              </span>
              {user.createdAt && (
                <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                  📅 Tham gia: {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== Profile Form ==================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">📝 Thông Tin Tài Khoản</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg"
            >
              ✏️ Chỉnh sửa
            </button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                👤 Tên đăng nhập
              </label>
              {isEditing ? (
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Nhập tên đăng nhập"
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-slate-900 font-medium">{user.username}</p>
                </div>
              )}
            </div>

            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                🆔 Tên nhân viên
              </label>
              {isEditing ? (
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Nhập tên nhân viên"
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-slate-900 font-medium">
                    {user.fullName || "Chưa cập nhật"}
                  </p>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                📧 Email
              </label>
              {isEditing ? (
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Nhập email"
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-slate-900 font-medium">{user.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Birthday Field */}
            <div>
              <label
                htmlFor="birthday"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                🎂 Ngày sinh nhật
              </label>
              {isEditing ? (
                <input
                  id="birthday"
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-slate-900 font-medium">
                    {user.birthday
                      ? new Date(user.birthday).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </p>
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                📞 Số điện thoại
              </label>
              {isEditing ? (
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-slate-900 font-medium">
                    {user.phone || "Chưa cập nhật"}
                  </p>
                </div>
              )}
            </div>

            {/* Role Field (Read-only) */}
            <div>
              <p className="mb-2 block text-sm font-semibold text-slate-700">
                🎭 Vai trò
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-slate-900 font-medium">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-green-700 hover:to-emerald-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  Đang lưu...
                </span>
              ) : (
                "💾 Lưu thay đổi"
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ❌ Hủy bỏ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

