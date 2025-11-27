import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";
import MenuHeroSection from "@/components/Admin/AdminMenuManager/MenuHeroSection";
import MenuFiltersBar from "@/components/Admin/AdminMenuManager/MenuFiltersBar";
import MenuCardsGrid from "@/components/Admin/AdminMenuManager/MenuCardsGrid";
import MenuFormModal from "@/components/Admin/AdminMenuManager/MenuFormModal";

const categoryColorMap = {
  "Bữa Sáng": "bg-amber-100 text-amber-700",
  "Bữa Trưa": "bg-emerald-100 text-emerald-700",
  "Đồ Uống": "bg-cyan-100 text-cyan-700",
  "Tráng Miệng": "bg-rose-100 text-rose-700",
};

const AdminMenuManager = () => {
  const { showSuccess, showError } = useNotification();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const initialFormState = {
    name: "",
    price: "",
    info: "",
    image: "",
    category: "",
    discountPercent: 0,
  };
  const [form, setForm] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    menuId: null,
  });

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("vi-VN") + " đ";

  const fetchMenu = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/menus`);
      setMenuItems(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi fetch menu:", err.message);
    }
  }, [API_BASE_URL]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi fetch categories:", err.message);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, [fetchMenu, fetchCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.category) {
        showError("Vui lòng chọn danh mục trước khi lưu món.");
        return;
      }
      if (editId) {
        await axios.put(`${API_BASE_URL}/api/menus/${editId}`, form);
      } else {
        await axios.post(`${API_BASE_URL}/api/menus`, form);
      }
      setForm(initialFormState);
      setEditId(null);
      setIsModalOpen(false);
      showSuccess(editId ? "Cập nhật món thành công!" : "Thêm món mới thành công!");
      fetchMenu();
    } catch (err) {
      console.error("❌ Lỗi khi lưu món:", err.message);
      showError("Lỗi khi lưu món. Vui lòng thử lại!");
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      info: item.info,
      image: item.image,
      category: item.category,
      discountPercent: item.discountPercent || 0,
    });
    setEditId(item._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
      try {
        await axios.delete(`${API_BASE_URL}/api/menus/${id}`);
        showSuccess("Xóa món thành công!");
        fetchMenu();
      } catch (err) {
        console.error("❌ Lỗi khi xoá món:", err.message);
        showError("Lỗi khi xóa món. Vui lòng thử lại!");
      }
  };

  const openDeleteModal = (menuId) => {
    setConfirmModal({ open: true, menuId });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ open: false, menuId: null });
  };

  const confirmDeleteMenu = async () => {
    if (!confirmModal.menuId) return;
    await handleDelete(confirmModal.menuId);
    closeDeleteModal();
  };

  const handleOpenModal = () => {
    setForm(initialFormState);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  const categoryFilterOptions = useMemo(() => {
    return [
      {
        label: "Tất cả danh mục",
        value: "all",
        badge: "bg-slate-100 text-slate-600",
        badgeLabel: "ALL",
      },
      ...categories.map((cat) => ({
        label: cat.name,
        value: cat.name,
        badge: categoryColorMap[cat.name] || "bg-blue-100 text-blue-700",
        badgeLabel: cat.name.slice(0, 3).toUpperCase(),
      })),
    ];
  }, [categories]);

  const categorySelectOptions = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      map.set(cat.name, { label: cat.name, value: cat.name });
    });
    menuItems.forEach((item) => {
      if (item.category && !map.has(item.category)) {
        map.set(item.category, {
          label: `${item.category} (cũ)`,
          value: item.category,
        });
      }
    });
    return Array.from(map.values());
  }, [categories, menuItems]);

  const sortOptions = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá tăng dần", value: "priceAsc" },
    { label: "Giá giảm dần", value: "priceDesc" },
    { label: "Tên A → Z", value: "nameAsc" },
  ];

  const filteredMenu = useMemo(() => {
    let result = menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.info.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ? true : item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "priceAsc":
          return Number(a.price) - Number(b.price);
        case "priceDesc":
          return Number(b.price) - Number(a.price);
        case "nameAsc":
          return a.name.localeCompare(b.name, "vi");
        case "newest":
        default:
          return (b.updatedAt || b.createdAt || "").localeCompare(
            a.updatedAt || a.createdAt || ""
          );
      }
    });

    return result;
  }, [menuItems, searchTerm, categoryFilter, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMenu.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortOption, filteredMenu.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMenu = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMenu.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMenu, currentPage]);

  const heroStats = useMemo(() => {
    return {
      totalItems: menuItems.length,
      categoryCount: new Set(menuItems.map((m) => m.category)).size,
      featuredText: filteredMenu.slice(0, 3).map((m) => m.name).join(", ") || "—",
    };
  }, [menuItems, filteredMenu]);

  return (
    <>
      <div className="space-y-6">
        <MenuHeroSection stats={heroStats} onAddItem={handleOpenModal} />

        <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
          <MenuFiltersBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            categoryOptions={categoryFilterOptions}
            onCategoryChange={setCategoryFilter}
            sortOption={sortOption}
            sortOptions={sortOptions}
            onSortChange={setSortOption}
          />

          <MenuCardsGrid
            items={paginatedMenu}
            formatPrice={formatPrice}
            categoryColorMap={categoryColorMap}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
          />

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </div>

      <MenuFormModal
        isOpen={isModalOpen}
        isEditing={Boolean(editId)}
        formData={form}
        onChange={handleChange}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        categoryOptions={categorySelectOptions}
        onCategorySelect={(value) => setForm((prev) => ({ ...prev, category: value }))}
      />
      <ConfirmModal
        open={confirmModal.open}
        title="Xóa món ăn"
        message="Bạn có chắc chắn muốn xoá món ăn này khỏi thực đơn?"
        confirmLabel="Xoá"
        cancelLabel="Huỷ"
        onConfirm={confirmDeleteMenu}
        onCancel={closeDeleteModal}
      />
    </>
  );
};

export default AdminMenuManager;