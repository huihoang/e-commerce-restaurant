import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";
import DiscountHeroSection from "@/components/Admin/AdminDiscountManager/DiscountHeroSection";
import DiscountFiltersBar from "@/components/Admin/AdminDiscountManager/DiscountFiltersBar";
import DiscountTable from "@/components/Admin/AdminDiscountManager/DiscountTable";
import DiscountFormModal from "@/components/Admin/AdminDiscountManager/DiscountFormModal";

const AdminDiscountManager = () => {
  const { showSuccess, showError } = useNotification();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountPercent: 10,
    startDate: "",
    endDate: "",
    isActive: true,
    usageLimit: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    discountId: null,
  });
  const ITEMS_PER_PAGE = 8;

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const tokenHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchDiscounts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/discounts`, {
        headers: tokenHeaders(),
      });
      setDiscounts(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy mã giảm giá:", err.message);
      showError("Không thể lấy danh sách mã giảm giá!");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showError]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleOpenModal = (discount) => {
    if (discount) {
      setForm({
        code: discount.code || "",
        description: discount.description || "",
        discountPercent: discount.discountPercent || 0,
        startDate: discount.startDate
          ? new Date(discount.startDate).toISOString().slice(0, 16)
          : "",
        endDate: discount.endDate
          ? new Date(discount.endDate).toISOString().slice(0, 16)
          : "",
        isActive: discount.isActive,
        usageLimit: discount.usageLimit || "",
      });
      setEditingId(discount._id);
    } else {
      setForm({
        code: "",
        description: "",
        discountPercent: 10,
        startDate: "",
        endDate: "",
        isActive: true,
        usageLimit: "",
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "discountPercent" || name === "usageLimit"
          ? value.replace(/\D/g, "")
          : value,
    }));
  };

  const toISOString = (value) => (value ? new Date(value).toISOString() : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      code: form.code,
      description: form.description,
      discountPercent: Number(form.discountPercent) || 0,
      startDate: toISOString(form.startDate),
      endDate: toISOString(form.endDate),
      isActive: form.isActive,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/discounts/${editingId}`, payload, {
          headers: tokenHeaders(),
        });
        showSuccess("Cập nhật mã giảm giá thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/api/discounts`, payload, {
          headers: tokenHeaders(),
        });
        showSuccess("Tạo mã giảm giá thành công!");
      }
      handleCloseModal();
      fetchDiscounts();
    } catch (err) {
      console.error("❌ Lỗi khi lưu mã giảm giá:", err.response?.data || err.message);
      showError(err.response?.data?.message || "Không thể lưu mã giảm giá!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/discounts/${id}`, {
        headers: tokenHeaders(),
      });
      showSuccess("Đã xoá mã giảm giá!");
      fetchDiscounts();
    } catch (err) {
      console.error("❌ Lỗi khi xoá mã giảm giá:", err.message);
      showError("Không thể xoá mã giảm giá!");
    }
  };

  const openDeleteModal = (discountId) => {
    setConfirmModal({ open: true, discountId });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ open: false, discountId: null });
  };

  const confirmDeleteDiscount = async () => {
    if (!confirmModal.discountId) return;
    await handleDelete(confirmModal.discountId);
    closeDeleteModal();
  };

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString("vi-VN") : "Không giới hạn";

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((discount) => {
      const matchesSearch =
        discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (discount.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter !== "all") {
        const now = new Date();
        const start = new Date(discount.startDate);
        const end = new Date(discount.endDate);
        const status = discount.isActive
          ? now < start
            ? "upcoming"
            : now > end
            ? "expired"
            : "active"
          : "inactive";
        matchesStatus = status === statusFilter;
      }
      return matchesSearch && matchesStatus;
    });
  }, [discounts, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDiscounts.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredDiscounts.length, statusFilter, searchTerm]);

  const paginatedDiscounts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDiscounts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDiscounts, currentPage]);

  const statusOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "Đang áp dụng", value: "active" },
    { label: "Sắp diễn ra", value: "upcoming" },
    { label: "Hết hạn", value: "expired" },
    { label: "Đã tắt", value: "inactive" },
  ];

  const discountStats = useMemo(() => {
    const now = new Date();
    const isUpcoming = (discount) => {
      if (!discount.isActive || !discount.startDate) return false;
      return new Date(discount.startDate) > now;
    };
    const isActive = (discount) => {
      if (!discount.isActive) return false;
      const start = discount.startDate ? new Date(discount.startDate) : null;
      const end = discount.endDate ? new Date(discount.endDate) : null;
      if (start && now < start) return false;
      if (end && now > end) return false;
      return true;
    };
    const isExpired = (discount) =>
      discount.endDate && new Date(discount.endDate) < now;

    return {
      total: discounts.length,
      upcoming: discounts.filter(isUpcoming).length,
      active: discounts.filter(isActive).length,
      expired: discounts.filter(isExpired).length,
    };
  }, [discounts]);

  return (
    <>
      <div className="space-y-6">
        <DiscountHeroSection stats={discountStats} onAddClick={handleOpenModal} />

        <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
          <DiscountFiltersBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            statusOptions={statusOptions}
            onStatusFilterChange={setStatusFilter}
          />

          <DiscountTable
            loading={loading}
            discounts={paginatedDiscounts}
            formatDate={formatDate}
            onEdit={handleOpenModal}
            onDelete={openDeleteModal}
          />

          {filteredDiscounts.length > ITEMS_PER_PAGE && (
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

      <DiscountFormModal
        isOpen={isModalOpen}
        isEditing={Boolean(editingId)}
        form={form}
        onChange={handleChange}
        onClose={handleCloseModal}
      onSubmit={handleSubmit}
      />
      <ConfirmModal
        open={confirmModal.open}
        title="Xóa mã giảm giá"
        message="Bạn có chắc chắn muốn xoá mã giảm giá này? Sau khi xoá, nhân viên và khách hàng sẽ không thể sử dụng mã nữa."
        confirmLabel="Xoá"
        cancelLabel="Huỷ"
        onConfirm={confirmDeleteDiscount}
        onCancel={closeDeleteModal}
      />
    </>
  );
};

export default AdminDiscountManager;

