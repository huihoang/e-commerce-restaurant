import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";
import UserStatsSection from "@/components/Admin/AdminUserManager/UserStatsSection";
import UserFiltersBar from "@/components/Admin/AdminUserManager/UserFiltersBar";
import UserTable from "@/components/Admin/AdminUserManager/UserTable";
import UserFormModal from "@/components/Admin/AdminUserManager/UserFormModal";

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
  const { showError, showSuccess } = useNotification();
  const initialFormState = {
    username: "",
    email: "",
    role: "user",
    fullName: "",
    phone: "",
    birthday: "",
    password: "",
  };
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ open: false, userId: null });
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
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingUserId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUsername = formData.username?.trim();
    const trimmedEmail = formData.email?.trim();

    if (!trimmedUsername || !trimmedEmail) {
      showError("Tên đăng nhập và email là bắt buộc.");
      return;
    }

    try {
      if (editingUserId) {
        const updatePayload = {
          ...formData,
          username: trimmedUsername,
          email: trimmedEmail,
        };
        delete updatePayload.password;
        await axios.put(
          `${API_BASE_URL}/api/users/${editingUserId}`,
          updatePayload
        );
        showSuccess("Cập nhật người dùng thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/api/signup`, {
          ...formData,
          username: trimmedUsername,
          email: trimmedEmail,
        });
        showSuccess("Tạo người dùng mới thành công!");
      }
      handleModalClose();
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi lưu người dùng:", err);
      showError("Lỗi khi lưu người dùng. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
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
    try {
      await handleDelete(confirmModal.userId);
      showSuccess("Đã xoá người dùng thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi xoá người dùng:", err);
      showError("Lỗi khi xoá người dùng!");
    } finally {
      closeDeleteModal();
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
        <UserStatsSection roleCounts={roleCounts} />

        <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
          <UserFiltersBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            roleFilterOptions={roleFilterOptions}
            onRoleFilterChange={setRoleFilter}
            onAddUser={handleOpenCreate}
          />

          <UserTable
            users={paginatedUsers}
            roleBadges={roleBadges}
            roleLabels={roleLabels}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
          />
        </section>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-4"
        />
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        isEditing={Boolean(editingUserId)}
        formData={formData}
        roleOptions={roleOptions}
        onChange={handleChange}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
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