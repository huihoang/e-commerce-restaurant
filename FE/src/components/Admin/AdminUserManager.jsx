import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from "@/components/common/Pagination";
import DropdownSelect from "@/components/common/DropdownSelect";

const roleBadges = {
  admin: "bg-red-100 text-red-600",
  user: "bg-emerald-100 text-emerald-600",
};

const roleFilterOptions = [
  { label: "Tất cả vai trò", value: "all", badge: "bg-slate-100 text-slate-600" },
  { label: "Quản trị viên", value: "admin", badge: "bg-amber-100 text-amber-600" },
  { label: "Nhân viên", value: "user", badge: "bg-emerald-100 text-emerald-600" },
];

const roleOptions = [
  { label: "Nhân viên", value: "user", badge: "bg-emerald-100 text-emerald-600" },
  { label: "Quản trị viên", value: "admin", badge: "bg-amber-100 text-amber-600" },
];

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
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
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    await axios.put(`${API_BASE_URL}/api/users/${editingUserId}`, formData);
    setEditingUserId(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (confirm("Xác nhận xóa user này?")) {
      await axios.delete(`${API_BASE_URL}/api/users/${id}`);
      fetchUsers();
    }
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
          if (user.role === "user") acc.user += 1;
          return acc;
        },
        { total: 0, admin: 0, user: 0 }
      ),
    [users]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">
              Trung tâm người dùng
            </p>
            <h1 className="mt-1 text-3xl font-semibold">Quản lý tài khoản</h1>
            <p className="mt-2 text-sm text-white/70">
              Theo dõi, chỉnh sửa và phân quyền người dùng trong hệ thống.
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white outline-none transition hover:bg-white/20"
          >
            🔄 Làm mới dữ liệu
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
          {[
            {
              label: "Tổng người dùng",
              value: roleCounts.total,
              accent: "text-white",
            },
            {
              label: "Quản trị viên",
              value: roleCounts.admin,
              accent: "text-amber-300",
            },
            {
              label: "Nhân viên",
              value: roleCounts.user,
              accent: "text-emerald-300",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-widest text-white/70">
                {stat.label}
              </p>
              <p className={`mt-1 text-2xl font-semibold ${stat.accent}`}>
                {stat.value}
              </p>
            </div>
          ))}
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
            <table className="min-w-[720px] w-full border-collapse text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-50 text-slate-900">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                    Người dùng
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                    Email
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
                  const isEditing = editingUserId === user._id;
                  return (
                    <tr
                      key={user._id}
                      className={`border-t border-slate-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                      }`}
                    >
                      <td className="px-5 py-3">
                        {isEditing ? (
                          <input
                            name="username"
                            value={formData.username || ""}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                          />
                        ) : (
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
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {isEditing ? (
                          <input
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                          />
                        ) : (
                          <span className="text-slate-700">{user.email}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {isEditing ? (
                          <DropdownSelect
                            options={roleOptions}
                            value={formData.role || "user"}
                            onChange={(val) =>
                              setFormData((prev) => ({ ...prev, role: val }))
                            }
                            className="w-full"
                          />
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                              roleBadges[user.role] || "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "Nhân viên"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleUpdate}
                                className="rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-600 transition hover:bg-emerald-500/20"
                              >
                                💾 Lưu
                              </button>
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="rounded-full bg-slate-200 px-4 py-2 text-slate-600 transition hover:bg-slate-300"
                              >
                                ✖️ Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(user)}
                                className="rounded-full bg-blue-500/10 px-4 py-2 text-blue-600 transition hover:bg-blue-500/20"
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="rounded-full bg-rose-500/10 px-4 py-2 text-rose-600 transition hover:bg-rose-500/20"
                              >
                                🗑 Xóa
                              </button>
                            </>
                          )}
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
  );
};

export default AdminUserManager;