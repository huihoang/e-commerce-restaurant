import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";
import CategoryHeader from "@/components/Admin/AdminCategoryManager/CategoryHeader";
import CategoryFilters from "@/components/Admin/AdminCategoryManager/CategoryFilters";
import CategoryGrid from "@/components/Admin/AdminCategoryManager/CategoryGrid";
import CategoryFormModal from "@/components/Admin/AdminCategoryManager/CategoryFormModal";

const AdminCategoryManager = () => {
  const { showSuccess, showError } = useNotification();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    categoryId: null,
  });
  const ITEMS_PER_PAGE = 9;

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const tokenHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/categories/admin`, {
        headers: tokenHeaders(),
      });
      setCategories(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh mục:", err.message);
      showError("Không thể lấy danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showError]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (category) => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description || "",
        isActive: category.isActive,
      });
      setEditingId(category._id);
    } else {
      setForm({ name: "", description: "", isActive: true });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/api/categories/${editingId}`,
          form,
          { headers: tokenHeaders() }
        );
        showSuccess("Cập nhật danh mục thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/api/categories`, form, {
          headers: tokenHeaders(),
        });
        showSuccess("Tạo danh mục thành công!");
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      console.error("❌ Lỗi khi lưu danh mục:", err.response?.data || err.message);
      showError(err.response?.data?.message || "Không thể lưu danh mục!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${id}`, {
        headers: tokenHeaders(),
      });
      showSuccess("Đã xoá danh mục!");
      fetchCategories();
    } catch (err) {
      console.error("❌ Lỗi khi xoá danh mục:", err.message);
      showError("Không thể xoá danh mục!");
    }
  };

  const openDeleteModal = (categoryId) => {
    setConfirmModal({ open: true, categoryId });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ open: false, categoryId: null });
  };

  const confirmDeleteCategory = async () => {
    if (!confirmModal.categoryId) return;
    await handleDelete(confirmModal.categoryId);
    closeDeleteModal();
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? cat.isActive
          : !cat.isActive;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredCategories.length, statusFilter, searchTerm]);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  const statusOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "Đang hoạt động", value: "active" },
    { label: "Ngừng hoạt động", value: "inactive" },
  ];

  return (
    <>
      <div className="space-y-6">
        <CategoryHeader
          categories={categories}
          onAdd={() => handleOpenModal()}
        />

        <CategoryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusOptions={statusOptions}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <CategoryGrid
          loading={loading}
          paginatedCategories={paginatedCategories}
          filteredCount={filteredCategories.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEdit={handleOpenModal}
          onDelete={openDeleteModal}
        />
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        editingId={editingId}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />
      <ConfirmModal
        open={confirmModal.open}
        title="Xóa danh mục"
        message="Bạn có chắc chắn muốn xoá danh mục này? Các món gắn với danh mục sẽ cần được cập nhật lại."
        confirmLabel="Xoá"
        cancelLabel="Huỷ"
        onConfirm={confirmDeleteCategory}
        onCancel={closeDeleteModal}
      />
    </>
  );
};

export default AdminCategoryManager;

