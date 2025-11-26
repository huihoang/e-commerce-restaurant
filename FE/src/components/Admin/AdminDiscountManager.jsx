import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import DropdownSelect from "@/components/common/DropdownSelect";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";

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

  const openModal = (discount) => {
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

  const closeModal = () => setIsModalOpen(false);

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
      closeModal();
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

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("vi-VN") + " đ";

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

  return (
    <>
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              Trung tâm khuyến mãi
            </p>
            <h1 className="mt-1 text-3xl font-semibold">
              Quản lý mã giảm giá
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Thiết lập và theo dõi mã giảm giá cho các chiến dịch bán hàng.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white outline-none transition hover:bg-white/25"
          >
            ➕ Thêm mã giảm giá
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-4">
          {[
            { label: "Tổng mã", value: discounts.length, accent: "text-white" },
            {
              label: "Sắp diễn ra",
              value: discounts.filter((d) => {
                if (!d.isActive) return false;
                if (!d.startDate) return false;
                return new Date(d.startDate) > new Date();
              }).length,
              accent: "text-yellow-200",
            },
            {
              label: "Đang diễn ra",
              value: discounts.filter((d) => {
                if (!d.isActive) return false;
                const now = new Date();
                const start = d.startDate ? new Date(d.startDate) : null;
                const end = d.endDate ? new Date(d.endDate) : null;
                if (start && now < start) return false;
                if (end && now > end) return false;
                return true;
              }).length,
              accent: "text-emerald-200",
            },
            {
              label: "Hết hạn",
              value: discounts.filter(
                (d) => d.endDate && new Date(d.endDate) < new Date()
              ).length,
              accent: "text-rose-200",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-widest text-white/80">
                {stat.label}
              </p>
              <p className={`mt-1 text-xl font-semibold ${stat.accent}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm theo mã hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-green-500 focus:outline-none"
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>
          </div>
          <DropdownSelect
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Trạng thái"
            className="w-full lg:w-48"
          />
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100">
          <table className="min-w-[960px] w-full text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Mã</th>
                 <th className="px-4 py-3 text-left w-[28%]">Mô tả</th>
                <th className="px-4 py-3 text-center">Giảm (%)</th>
                <th className="px-4 py-3 text-center">Hiệu lực</th>
                <th className="px-4 py-3 text-center">Giới hạn</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginatedDiscounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Không tìm thấy mã giảm giá nào.
                  </td>
                </tr>
              ) : (
                paginatedDiscounts.map((discount) => {
                  const now = new Date();
                  const start = discount.startDate
                    ? new Date(discount.startDate)
                    : null;
                  const end = discount.endDate
                    ? new Date(discount.endDate)
                    : null;
                  let status = "Đã tắt";
                  let badge =
                    "bg-slate-200 text-slate-600 border border-slate-200";
                  if (discount.isActive) {
                    if (start && now < start) {
                      status = "Sắp diễn ra";
                      badge =
                        "bg-amber-100 text-amber-700 border border-amber-200";
                    } else if (end && now > end) {
                      status = "Hết hạn";
                      badge =
                        "bg-rose-100 text-rose-700 border border-rose-200";
                    } else {
                      status = "Đang diễn ra";
                      badge =
                        "bg-emerald-100 text-emerald-700 border border-emerald-200";
                    }
                  }
                  return (
                    <tr key={discount._id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {discount.code}
                      </td>
                       <td className="px-4 py-3 whitespace-pre-line text-slate-600">
                        {discount.description || "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-emerald-600">
                        -{discount.discountPercent}%
                      </td>
                       <td className="px-4 py-3 text-center">
                        <div className="text-xs text-slate-500">
                          <p>Bắt đầu: {formatDate(discount.startDate)}</p>
                          <p>Kết thúc: {formatDate(discount.endDate)}</p>
                        </div>
                      </td>
                       <td className="px-4 py-3 text-center">
                        {discount.usageLimit
                          ? `${discount.usageCount || 0}/${discount.usageLimit}`
                          : "Không giới hạn"}
                      </td>
                       <td className="px-4 py-3">
                         <div className="flex justify-center">
                           <span
                             className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${badge}`}
                           >
                             {status}
                           </span>
                         </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <button
                            onClick={() => openModal(discount)}
                            className="rounded-full bg-blue-600/10 px-3 py-1 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                          >
                            ✏️
                          </button>
                             <button
                               onClick={() => openDeleteModal(discount._id)}
                               className="rounded-full bg-rose-600/10 px-3 py-1 font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
                             >
                               🗑
                             </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-semibold text-slate-900">
                {editingId ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá"}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mã giảm giá
                  </label>
                  <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
                    placeholder="Ví dụ: SUMMER20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phần trăm giảm
                  </label>
                  <input
                    name="discountPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={form.discountPercent}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
                    placeholder="Mô tả ngắn cho khách hàng"
                  />
                </div>
        <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Bắt đầu (tuỳ chọn)
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    onFocus={(e) => e.currentTarget.showPicker?.()}
                    className="mt-1 w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kết thúc (tuỳ chọn)
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    onFocus={(e) => e.currentTarget.showPicker?.()}
                    className="mt-1 w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Giới hạn sử dụng (tuỳ chọn)
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="usageLimit"
                    value={form.usageLimit}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-green-500 focus:outline-none"
                    placeholder="Ví dụ: 100"
                  />
                </div>
                <label className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <span>Đang kích hoạt</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-green-700 hover:to-emerald-700"
                >
                  {editingId ? "Lưu thay đổi" : "Tạo mã"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

