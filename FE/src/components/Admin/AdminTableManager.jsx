import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from "@/components/common/Pagination";
import DropdownSelect from "@/components/common/DropdownSelect";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";

const AdminTableManager = () => {
  const { showSuccess, showError } = useNotification();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    number: "",
    capacity: "",
    location: "",
    description: "",
    isActive: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    tableId: null,
  });
  const ITEMS_PER_PAGE = 8;

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
      setForm({
        number: "",
        capacity: "",
        location: "",
        description: "",
        isActive: true,
      });
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
        <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                Trung tâm quản lý bàn
              </p>
              <h1 className="mt-1 text-3xl font-semibold">Quản lý bàn ăn</h1>
              <p className="mt-2 text-sm text-white/80">
                Quản lý danh sách bàn, sức chứa và vị trí trong nhà hàng.
              </p>
            </div>
            <button
              onClick={() => handleOpenModal(null)}
              className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white outline-none transition hover:bg-white/25"
            >
              ➕ Thêm bàn mới
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-4">
            {[
              {
                label: "Tổng bàn",
                value: stats.total,
                accent: "text-white",
              },
              {
                label: "Đang hoạt động",
                value: stats.active,
                accent: "text-emerald-200",
              },
              {
                label: "Ngừng hoạt động",
                value: stats.inactive,
                accent: "text-rose-200",
              },
              {
                label: "Tổng sức chứa",
                value: stats.totalCapacity,
                accent: "text-yellow-200",
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
                placeholder="Tìm kiếm theo số bàn, vị trí, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-indigo-500 focus:outline-none"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔍
              </span>
            </div>
            <div className="w-full lg:w-48">
              <DropdownSelect
                options={statusFilterOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Lọc trạng thái"
                className="w-full"
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              Đang tải dữ liệu...
            </div>
          ) : paginatedTables.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              {searchTerm || statusFilter !== "all"
                ? "Không tìm thấy bàn phù hợp."
                : "Chưa có bàn nào. Hãy thêm bàn mới!"}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedTables.map((table) => (
                <article
                  key={table._id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase text-slate-400">
                        Bàn số
                      </p>
                      <h3 className="text-2xl font-semibold text-slate-900">
                        {table.number}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        table.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {table.isActive ? "Đang hoạt động" : "Ngừng"}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold">Sức chứa:</span>{" "}
                      {table.capacity} người
                    </p>
                    {table.location && (
                      <p>
                        <span className="font-semibold">Vị trí:</span>{" "}
                        {table.location}
                      </p>
                    )}
                    {table.description && (
                      <p className="line-clamp-2">{table.description}</p>
                    )}
                  </div>
                  <div className="mt-auto flex gap-2 pt-4">
                    <button
                      onClick={() => handleOpenModal(table)}
                      className="flex-1 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => openDeleteModal(table._id)}
                      className="rounded-full bg-rose-600/10 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
                    >
                      🗑 Xoá
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-semibold text-slate-900">
                {editingId ? "Chỉnh sửa bàn" : "Thêm bàn mới"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Số bàn <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="number"
                    value={form.number}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-indigo-500 focus:outline-none"
                    placeholder="Ví dụ: Bàn 1, T1, A1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Sức chứa (người) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="capacity"
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-indigo-500 focus:outline-none"
                    placeholder="Ví dụ: 4"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Vị trí
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-indigo-500 focus:outline-none"
                  placeholder="Ví dụ: Tầng 1, Khu vực A"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-indigo-500 focus:outline-none"
                  placeholder="Ghi chú về bàn (nếu có)..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="text-sm font-semibold text-slate-700">
                  Đang hoạt động
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700"
                >
                  {editingId ? "Lưu thay đổi" : "Thêm bàn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
