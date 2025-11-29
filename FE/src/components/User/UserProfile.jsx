import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";
import ProfileHero from "@/components/User/UserProfile/ProfileHero";
import ProfileFormLeft from "@/components/User/UserProfile/ProfileFormLeft";
import ProfileFormRight from "@/components/User/UserProfile/ProfileFormRight";
import ProfileActions from "@/components/User/UserProfile/ProfileActions";

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

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalizedUser = {
        ...res.data,
      };
      setUser(normalizedUser);
      setFormData({
        username: normalizedUser.username || "",
        email: normalizedUser.email || "",
        fullName: normalizedUser.fullName || "",
        birthday: normalizedUser.birthday
          ? new Date(normalizedUser.birthday).toISOString().split("T")[0]
          : "",
        phone: normalizedUser.phone || "",
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
    if (!user) {
      return;
    }
    setFormData({
      username: user.username || "",
      email: user.email || "",
      fullName: user.fullName || "",
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().split("T")[0]
        : "",
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
  const roleLabelMap = {
    admin: "Quản trị viên",
    staff: "Nhân viên",
    user: "Người dùng",
  };
  const roleLabel = roleLabelMap[role] || "Khách";

  return (
    <section className="bg-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
      <ProfileHero user={user} roleLabel={roleLabel} />

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
          <ProfileFormLeft
            formData={formData}
            user={user}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <ProfileFormRight
            formData={formData}
            user={user}
            roleLabel={roleLabel}
            isEditing={isEditing}
            onChange={handleChange}
          />
        </div>

        <ProfileActions
          isEditing={isEditing}
          saving={saving}
          onSave={handleUpdate}
          onCancel={handleCancel}
        />
      </div>
      </div>
    </section>
  );
};

export default UserProfile;

