import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";
import BlogHeader from "@/components/Admin/AdminBlogList/BlogHeader";
import BlogFilters from "@/components/Admin/AdminBlogList/BlogFilters";
import BlogGrid from "@/components/Admin/AdminBlogList/BlogGrid";
import BlogFormModal from "@/components/Admin/AdminBlogList/BlogFormModal";

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
        <BlogHeader blogItems={blogItems} />
        <BlogFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryOptions={categoryOptions}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortOption={{
            options: sortOptions,
            value: sortOption,
            onChange: setSortOption,
          }}
        />
        <BlogGrid
          paginatedBlogs={paginatedBlogs}
          truncateContent={truncateContent}
          onEdit={handleEdit}
          onDelete={openDeleteModal}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <BlogFormModal
        isOpen={isModalOpen}
        editId={editId}
        form={form}
        categoryOptions={categoryOptions.slice(1)}
        onChange={handleChange}
        onCategoryChange={(value) =>
          setForm((prev) => ({ ...prev, category: value }))
        }
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
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