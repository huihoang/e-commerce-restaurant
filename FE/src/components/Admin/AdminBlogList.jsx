import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import DropdownSelect from "@/components/common/DropdownSelect";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";

const defaultCategories = ["Blog", "Hướng dẫn", "Tin tức"];

const AdminBlogManager = () => {
  const { showSuccess, showError } = useNotification();
  const [blogItems, setBlogItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    category: "",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    blogId: null,
  });

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/blogs`);
      setBlogItems(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi fetch blogs:", err.message);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/api/blogs/${editId}`, form);
      } else {
        await axios.post(`${API_BASE_URL}/api/blogs`, form);
      }
      setForm({ title: "", content: "", image: "", category: "" });
      setEditId(null);
      setIsModalOpen(false);
      showSuccess(editId ? "Cập nhật bài viết thành công!" : "Thêm bài viết mới thành công!");
      fetchBlogs();
    } catch (err) {
      console.error("❌ Lỗi khi lưu blog:", err.message);
      showError("Lỗi khi lưu bài viết. Vui lòng thử lại!");
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || "",
      content: item.content || "",
      image: item.image || "",
      category: item.category || "",
    });
    setEditId(item._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/blogs/${id}`);
      showSuccess("Xóa bài viết thành công!");
      fetchBlogs();
    } catch (err) {
      console.error("❌ Lỗi khi xoá bài viết:", err.message);
      showError("Lỗi khi xóa bài viết. Vui lòng thử lại!");
    }
  };

  const openDeleteModal = (blogId) => {
    setConfirmModal({ open: true, blogId });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ open: false, blogId: null });
  };

  const confirmDeleteBlog = async () => {
    if (!confirmModal.blogId) return;
    await handleDelete(confirmModal.blogId);
    closeDeleteModal();
  };

  const openModal = () => {
    setForm({ title: "", content: "", image: "", category: "" });
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const categoryOptions = useMemo(() => {
    const unique = new Set(defaultCategories);
    blogItems.forEach((item) => item.category && unique.add(item.category));
    return [
      {
        label: "Tất cả danh mục",
        value: "all",
        badge: "bg-slate-100 text-slate-600",
        badgeLabel: "ALL",
      },
      ...Array.from(unique).map((cat) => ({
        label: cat,
        value: cat,
        badge: "bg-amber-50 text-amber-600",
        badgeLabel: cat.slice(0, 3).toUpperCase(),
      })),
    ];
  }, [blogItems]);

  const sortOptions = [
    { label: "Mới nhất", value: "newest" },
    { label: "Cũ nhất", value: "oldest" },
    { label: "Tiêu đề A → Z", value: "titleAsc" },
  ];

  const filteredBlogs = useMemo(() => {
    let result = blogItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ? true : item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "oldest":
          return (a.createdAt || "").localeCompare(b.createdAt || "");
        case "titleAsc":
          return a.title.localeCompare(b.title, "vi");
        case "newest":
        default:
          return (b.createdAt || "").localeCompare(a.createdAt || "");
      }
    });

    return result;
  }, [blogItems, searchTerm, categoryFilter, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortOption, filteredBlogs.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBlogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  const truncateContent = (content, length = 120) =>
    content.length > length ? `${content.substring(0, length)}…` : content;

  return (
    <>
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              Trung tâm nội dung
            </p>
            <h1 className="mt-1 text-3xl font-semibold">
              Quản lý bài viết & tin tức
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Chia sẻ câu chuyện, mẹo hay và thông tin mới nhất cùng khách hàng.
            </p>
          </div>
          <button
            onClick={openModal}
            className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white outline-none transition hover:bg-white/25"
          >
            ✍️ Thêm bài viết
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
          {[
            {
              label: "Tổng bài viết",
              value: blogItems.length,
              accent: "text-white",
            },
            {
              label: "Danh mục",
              value: new Set(blogItems.map((b) => b.category)).size,
              accent: "text-amber-200",
            },
            {
              label: "Bài mới nhất",
              value: blogItems[0]?.title || "Chưa có",
              accent: "text-white",
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
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm bài theo tiêu đề hoặc nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-purple-500 focus:outline-none"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔍
              </span>
            </div>
            <DropdownSelect
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="Danh mục"
              className="w-full sm:w-48"
            />
          </div>
          <div className="w-full lg:w-52">
            <DropdownSelect
              options={sortOptions}
              value={sortOption}
              onChange={setSortOption}
              placeholder="Sắp xếp"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {paginatedBlogs.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              Không tìm thấy bài viết phù hợp. Hãy thử từ khóa khác.
            </div>
          )}
          {paginatedBlogs.map((item) => (
            <article
              key={item._id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.image || "/blog-placeholder.png"}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
                  {item.category || "Chưa phân loại"}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <h3 className="text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {truncateContent(item.content || "")}
                </p>
                <div className="mt-auto flex gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 rounded-full bg-indigo-600/10 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => openDeleteModal(item._id)}
                    className="flex-1 rounded-full bg-rose-600/10 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
                  >
                    🗑 Xoá
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

    </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-slate-900">
                {editId ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tiêu đề bài viết
                  </label>
                  <input
                    name="title"
                    placeholder="Nhập tiêu đề"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Danh mục
                  </label>
                  <DropdownSelect
                    options={categoryOptions.slice(1)}
                    value={form.category}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, category: value }))
                    }
                    placeholder="Chọn danh mục"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Ảnh đại diện
                  </label>
                  <input
                    name="image"
                    placeholder="Link hình ảnh"
                    value={form.image}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nội dung bài viết
                </label>
                <textarea
                  name="content"
                  rows={6}
                  placeholder="Chia sẻ câu chuyện, công thức hoặc tin tức..."
                  value={form.content}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01]"
                >
                  {editId ? "Cập nhật bài viết" : "Đăng bài mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        open={confirmModal.open}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xoá bài viết này khỏi trang blog?"
        confirmLabel="Xoá"
        cancelLabel="Huỷ"
        onConfirm={confirmDeleteBlog}
        onCancel={closeDeleteModal}
      />
    </>
  );
};

export default AdminBlogManager;