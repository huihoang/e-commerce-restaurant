import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from "@/components/common/Pagination";
import DropdownSelect from "@/components/common/DropdownSelect";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";

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
  const ITEMS_PER_PAGE = 8;

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
      <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              Trung tâm danh mục
            </p>
            <h1 className="mt-1 text-3xl font-semibold">
              Quản lý danh mục món ăn
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Tạo và cập nhật danh mục để đội ngũ bếp sử dụng thống nhất.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white outline-none transition hover:bg-white/25"
          >
            ➕ Thêm danh mục
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
          {[
            {
              label: "Tổng danh mục",
              value: categories.length,
              accent: "text-white",
            },
            {
              label: "Đang hoạt động",
              value: categories.filter((c) => c.isActive).length,
              accent: "text-emerald-200",
            },
            {
              label: "Ngừng hoạt động",
              value: categories.filter((c) => !c.isActive).length,
              accent: "text-amber-200",
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
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-purple-500 focus:outline-none"
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

        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              Đang tải dữ liệu...
            </div>
          ) : paginatedCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              Không có danh mục nào phù hợp.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {paginatedCategories.map((cat) => (
                <article
                  key={cat._id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase text-slate-400">
                        #{cat.slug}
                      </p>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {cat.name}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        cat.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {cat.isActive ? "Đang hoạt động" : "Ngừng"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                    {cat.description || "Chưa có mô tả"}
                  </p>
                  <div className="mt-auto flex gap-2 pt-4">
                    <button
                      onClick={() => handleOpenModal(cat)}
                      className="flex-1 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => openDeleteModal(cat._id)}
                      className="rounded-full bg-rose-600/10 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
                    >
                      🗑 Xoá
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {filteredCategories.length > ITEMS_PER_PAGE && (
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
                {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tên danh mục
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-purple-500 focus:outline-none"
                  placeholder="Ví dụ: Đồ uống"
                />
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
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-purple-500 focus:outline-none"
                  placeholder="Mô tả ngắn gọn về danh mục..."
                />
              </div>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span>Đang hoạt động</span>
              </label>
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
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-purple-700 hover:to-indigo-700"
                >
                  {editingId ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

