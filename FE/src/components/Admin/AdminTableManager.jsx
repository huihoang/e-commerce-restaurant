import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";
import TableHeroSection from "@/components/Admin/AdminTableManager/TableHeroSection";
import TableFiltersBar from "@/components/Admin/AdminTableManager/TableFiltersBar";
import TableCardsGrid from "@/components/Admin/AdminTableManager/TableCardsGrid";
import TableFormModal from "@/components/Admin/AdminTableManager/TableFormModal";

const AdminTableManager = () => {
  const { showSuccess, showError } = useNotification();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initialFormState = {
    number: "",
    capacity: "",
    location: "",
    description: "",
    isActive: true,
  };
  const [form, setForm] = useState(initialFormState);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    tableId: null,
  });
  const ITEMS_PER_PAGE = 9;

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const tokenHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/tables`, {
        headers: tokenHeaders(),
      });
      setTables(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách bàn:", err.message);
      showError("Không thể lấy danh sách bàn!");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showError]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleOpenModal = (table) => {
    if (table) {
      setForm({
        number: table.number || "",
        capacity: table.capacity || "",
        location: table.location || "",
        description: table.description || "",
        isActive: table.isActive !== false,
      });
      setEditingId(table._id);
    } else {
      setForm(initialFormState);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "capacity"
          ? value.replace(/\D/g, "")
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity) || 1,
      };

      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/api/tables/${editingId}`,
          payload,
          { headers: tokenHeaders() }
        );
        showSuccess("Cập nhật bàn thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/api/tables`, payload, {
          headers: tokenHeaders(),
        });
        showSuccess("Tạo bàn thành công!");
      }
      handleCloseModal();
      fetchTables();
    } catch (err) {
      console.error("❌ Lỗi khi lưu bàn:", err.response?.data || err.message);
      showError(err.response?.data?.message || "Không thể lưu bàn!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tables/${id}`, {
        headers: tokenHeaders(),
      });
      showSuccess("Đã xoá bàn!");
      fetchTables();
    } catch (err) {
      console.error("❌ Lỗi khi xoá bàn:", err.message);
      showError("Không thể xoá bàn!");
    }
  };

  const openDeleteModal = (tableId) => {
    setConfirmModal({ open: true, tableId });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ open: false, tableId: null });
  };

  const confirmDeleteTable = async () => {
    if (!confirmModal.tableId) return;
    await handleDelete(confirmModal.tableId);
    closeDeleteModal();
  };

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesSearch =
        table.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (table.location || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (table.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? table.isActive
          : !table.isActive;
      return matchesSearch && matchesStatus;
    });
  }, [tables, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTables.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTables = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTables.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTables, currentPage]);

  const statusFilterOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "Đang hoạt động", value: "active" },
    { label: "Ngừng hoạt động", value: "inactive" },
  ];

  const stats = useMemo(() => {
    const total = tables.length;
    const active = tables.filter((t) => t.isActive).length;
    const inactive = total - active;
    const totalCapacity = tables.reduce((sum, t) => sum + (t.capacity || 0), 0);
    return { total, active, inactive, totalCapacity };
  }, [tables]);

  return (
    <>
      <div className="space-y-6">
        <TableHeroSection stats={stats} onAddTable={() => handleOpenModal(null)} />

        <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
          <TableFiltersBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            statusOptions={statusFilterOptions}
            onStatusFilterChange={setStatusFilter}
          />

          <TableCardsGrid
            loading={loading}
            tables={paginatedTables}
            hasFiltersApplied={Boolean(searchTerm || statusFilter !== "all")}
            onEdit={handleOpenModal}
            onDelete={openDeleteModal}
          />

          {filteredTables.length > ITEMS_PER_PAGE && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </section>
      </div>

      <TableFormModal
        isOpen={isModalOpen}
        isEditing={Boolean(editingId)}
        formData={form}
        onChange={handleChange}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        open={confirmModal.open}
        title="Xóa bàn"
        message="Bạn có chắc chắn muốn xoá bàn này? Thao tác này không thể hoàn tác."
        confirmLabel="Xoá"
        cancelLabel="Huỷ"
        onConfirm={confirmDeleteTable}
        onCancel={closeDeleteModal}
      />
    </>
  );
};

export default AdminTableManager;
