import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import DropdownSelect from "@/components/common/DropdownSelect";
import Pagination from "@/components/common/Pagination";
import { useNotification } from "@/contexts/NotificationContext";

const categoryColorMap = {
  "Bữa Sáng": "bg-amber-100 text-amber-700",
  "Bữa Trưa": "bg-emerald-100 text-emerald-700",
  "Đồ Uống": "bg-cyan-100 text-cyan-700",
  "Tráng Miệng": "bg-rose-100 text-rose-700",
};

const defaultCategories = ["Bữa Sáng", "Bữa Trưa", "Đồ Uống", "Tráng Miệng"];

const AdminMenuManager = () => {
  const { showSuccess, showError } = useNotification();
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    info: "",
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

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/api/menus/${editId}`, form);
      } else {
        await axios.post(`${API_BASE_URL}/api/menus`, form);
      }
      setForm({ name: "", price: "", info: "", image: "", category: "" });
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
    });
    setEditId(item._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm("Bạn có chắc chắn muốn xoá món này không?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/menus/${id}`);
        showSuccess("Xóa món thành công!");
        fetchMenu();
      } catch (err) {
        console.error("❌ Lỗi khi xoá món:", err.message);
        showError("Lỗi khi xóa món. Vui lòng thử lại!");
      }
    }
  };

  const openModal = () => {
    setForm({ name: "", price: "", info: "", image: "", category: "" });
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const categoryOptions = useMemo(() => {
    const unique = new Set(defaultCategories);
    menuItems.forEach((item) => item.category && unique.add(item.category));
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
        badge: categoryColorMap[cat] || "bg-blue-100 text-blue-700",
        badgeLabel: cat.slice(0, 3).toUpperCase(),
      })),
    ];
  }, [menuItems]);

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

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              Trung tâm menu
            </p>
            <h1 className="mt-1 text-3xl font-semibold">
              Quản lý món ăn & giá bán
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Cập nhật menu theo mùa, quản lý hình ảnh và giá chỉ với một cú
              click.
            </p>
          </div>
        <button
          onClick={openModal}
            className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white outline-none transition hover:bg-white/25"
        >
            ➕ Thêm món mới
        </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
          {[
            {
              label: "Tổng món ăn",
              value: menuItems.length,
              accent: "text-white",
            },
            {
              label: "Danh mục",
              value: new Set(menuItems.map((m) => m.category)).size,
              accent: "text-yellow-200",
            },
            {
              label: "Món nổi bật",
              value: filteredMenu.slice(0, 3).map((m) => m.name).join(", ") || "—",
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
                placeholder="Tìm món theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-orange-500 focus:outline-none"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔎
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

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedMenu.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              Không tìm thấy món ăn nào phù hợp. Hãy thử từ khóa khác.
            </div>
          )}
          {paginatedMenu.map((item) => (
            <article
              key={item._id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-44 w-full flex-shrink-0 overflow-hidden">
              <img
                  src={item.image || "/placeholder.png"}
                alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${
                    categoryColorMap[item.category] || "bg-slate-900/70"
                  }`}
                >
                  {item.category || "Chưa phân loại"}
                </span>
              </div>
              <div className="flex flex-col gap-3 p-5 flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                    {item.info || "Chưa có mô tả"}
                  </p>
                </div>
                <div className="mt-1">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
                {formatPrice(item.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Cập nhật:{" "}
                    {(item.updatedAt &&
                      new Date(item.updatedAt).toLocaleDateString("vi-VN")) ||
                      "—"}
                  </span>
                  <span>ID: {item._id.slice(-6)}</span>
                </div>
                <div className="mt-auto flex gap-2 pt-2">
                <button
                  onClick={() => handleEdit(item)}
                    className="flex-1 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                    ✏️ Sửa
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-slate-900">
              {editId ? "Chỉnh sửa món" : "Thêm món mới"}
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
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tên món
                  </label>
              <input
                name="name"
                    placeholder="Ví dụ: Bò lúc lắc"
                value={form.name}
                onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-orange-500 focus:outline-none"
              />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Giá (VNĐ)
                  </label>
              <input
                name="price"
                    type="number"
                    min="0"
                    placeholder="Ví dụ: 25000"
                value={form.price}
                onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-orange-500 focus:outline-none"
              />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Mô tả ngắn
                </label>
                <textarea
                name="info"
                  rows={3}
                  placeholder="Hương vị, thành phần chính..."
                value={form.info}
                onChange={handleChange}
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-orange-500 focus:outline-none"
              />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Link hình ảnh
                </label>
              <input
                name="image"
                  placeholder="https://..."
                value={form.image}
                onChange={handleChange}
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    Hoặc nhập danh mục mới
                  </label>
                  <input
                name="category"
                    placeholder="Nhập danh mục"
                value={form.category}
                onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:scale-[1.01]"
                >
                  {editId ? "Lưu thay đổi" : "Thêm món"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuManager;