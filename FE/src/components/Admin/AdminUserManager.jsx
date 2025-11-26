import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from "@/components/common/Pagination";
import DropdownSelect from "@/components/common/DropdownSelect";
import ConfirmModal from "@/components/common/ConfirmModal";

const roleBadges = {
  admin: "bg-red-100 text-red-600",
  staff: "bg-amber-100 text-amber-600",
  user: "bg-emerald-100 text-emerald-600",
};

const roleLabels = {
  user: "Người dùng",
  staff: "Nhân viên",
  admin: "Admin",
};

const roleFilterOptions = [
  { label: "Tất cả vai trò", value: "all", badge: "bg-slate-100 text-slate-600" },
  { label: roleLabels.admin, value: "admin", badge: roleBadges.admin },
  { label: roleLabels.staff, value: "staff", badge: roleBadges.staff },
  { label: roleLabels.user, value: "user", badge: roleBadges.user },
];

const roleOptions = [
  { label: roleLabels.user, value: "user", badge: roleBadges.user },
  { label: roleLabels.staff, value: "staff", badge: roleBadges.staff },
  { label: roleLabels.admin, value: "admin", badge: roleBadges.admin },
];

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    userId: null,
  });
  const ITEMS_PER_PAGE = 10;
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchUsers = useCallback(async () => {
    const res = await axios.get(`${API_BASE_URL}/api/users`);
    setUsers(res.data);
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      role: user.role || "user",
      fullName: user.fullName || "",
      phone: user.phone || "",
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().split("T")[0]
        : "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`${API_BASE_URL}/api/users/${editingUserId}`, formData);
    setEditingUserId(null);
    setIsModalOpen(false);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/api/users/${id}`);
    fetchUsers();
  };

  const openDeleteModal = (userId) => {
    setConfirmModal({ open: true, userId });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ open: false, userId: null });
  };

  const confirmDeleteUser = async () => {
    if (!confirmModal.userId) return;
    await handleDelete(confirmModal.userId);
    closeDeleteModal();
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        roleFilter === "all" ? true : user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const roleCounts = useMemo(
    () =>
      users.reduce(
        (acc, user) => {
          acc.total += 1;
          if (user.role === "admin") acc.admin += 1;
          if (user.role === "staff") acc.staff += 1;
          if (user.role === "user") acc.user += 1;
          return acc;
        },
        { total: 0, admin: 0, staff: 0, user: 0 }
      ),
    [users]
  );

  return (
    <>
    <div className="space-y-6">
      {/* Section số người dùng */}
      <section className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">📊 Thống kê người dùng</h2>
            <p className="mt-1 text-sm text-slate-600">
              Tổng số tài khoản đã đăng ký trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">{roleCounts.total}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mt-1">
                Tổng người dùng
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Quản trị viên</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{roleCounts.admin}</p>
              </div>
              <span className="text-3xl">👑</span>
            </div>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Nhân viên</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{roleCounts.staff}</p>
              </div>
              <span className="text-3xl">👔</span>
            </div>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Người dùng</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{roleCounts.user}</p>
              </div>
              <span className="text-3xl">👤</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-blue-500 focus:outline-none"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔍
              </span>
            </div>
            <DropdownSelect
              options={roleFilterOptions}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="Chọn vai trò"
              className="w-full sm:w-48"
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full border-collapse text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-50 text-slate-900">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                    Người dùng
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                    Email
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                    Họ tên
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                    Số điện thoại
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                    Ngày sinh
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                    Vai trò
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-widest">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-6 text-center text-sm text-slate-500"
                    >
                      Không tìm thấy người dùng phù hợp.
                    </td>
                  </tr>
                )}
                {paginatedUsers.map((user, index) => {
                  return (
                    <tr
                      key={user._id}
                      className={`border-t border-slate-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white">
                            {user.username?.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.username}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {user._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-slate-700">{user.email}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-slate-700">
                          {user.fullName || "Chưa cập nhật"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-slate-700">
                          {user.phone || "Chưa cập nhật"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-slate-700">
                          {user.birthday
                            ? new Date(user.birthday).toLocaleDateString("vi-VN")
                            : "Chưa cập nhật"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                            roleBadges[user.role] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {roleLabels[user.role] || "Không xác định"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-3 text-sm font-semibold whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(user)}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-4 py-2 text-blue-600 transition hover:bg-blue-500/20"
                          >
                            ✏️ <span>Sửa</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(user._id)}
                            className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-4 py-2 text-rose-600 transition hover:bg-rose-500/20"
                          >
                            🗑 <span>Xóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-4"
      />
    </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-semibold text-slate-900">Chỉnh sửa người dùng</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUserId(null);
                }}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tên đăng nhập
                  </label>
                  <input
                    name="username"
                    value={formData.username || ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Họ và tên
                  </label>
                  <input
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                    placeholder="Nhập họ tên nhân viên"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Số điện thoại
                  </label>
                  <input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday || ""}
                    onChange={handleChange}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    onFocus={(e) => e.currentTarget.showPicker?.()}
                    className="mt-1 w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vai trò
                  </label>
                  <select
                    name="role"
                    value={formData.role || "user"}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingUserId(null);
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        open={confirmModal.open}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xoá người dùng này khỏi hệ thống?"
        confirmLabel="Xóa"
        cancelLabel="Huỷ"
        onConfirm={confirmDeleteUser}
        onCancel={closeDeleteModal}
      />
    </>
  );
};

export default AdminUserManager;