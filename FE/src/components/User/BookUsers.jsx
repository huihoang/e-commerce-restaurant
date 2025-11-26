import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";
import DropdownSelect from "@/components/common/DropdownSelect";
import DiscountCodeSection from "@/components/User/EditBookingModal/DiscountCodeSection";

const FALLBACK_CATEGORIES = ["Bữa Sáng", "Bữa Trưa", "Đồ Uống", "Tráng Miệng"];

const BookUser = () => {
  const { showSuccess, showError } = useNotification();
  const [orderType, setOrderType] = useState("dine-in"); // "dine-in" hoặc "takeaway"
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    people: 1,
    tableNumber: "",
    // Thông tin cho "Mang đi"
    deliveryAddress: "",
    deliveryEmail: "",
    note: "",
    selectedDishes: [],
    discount: 0,
    discountCode: null,
  });
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [bookings, setBookings] = useState([]); // Danh sách booking để check bàn đã đặt
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const normalizeBooking = (booking) => ({
    ...booking,
    orderType: booking.orderType || (booking.ship?.isShip ? "takeaway" : "dine-in"),
  });

  // ==================== Fetch bookings để check bàn đã đặt
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = Array.isArray(res.data)
          ? res.data.map(normalizeBooking)
          : [];
        setBookings(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách đặt bàn:", err.message);
      }
    };
    fetchBookings();
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/tables`);
        setTables(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách bàn:", err.message);
      }
    };
    fetchTables();
  }, [API_BASE_URL]);

  // ==================== Kiểm tra bàn có bận không
  const isTableBusy = useCallback(
    (table, dateValue, timeValue) => {
      if (!dateValue || !timeValue || !table) return true;
      const dateKey = dateValue.split("T")[0];
      return bookings.some((booking) => {
        const bookingOrderType =
          booking.orderType || (booking.ship?.isShip ? "takeaway" : "dine-in");
        if (bookingOrderType !== "dine-in") return false;
        const bookingDate = (booking.date || "").split("T")[0];
        if (bookingDate !== dateKey) return false;
        // Check by tableNumber
        if (booking.tableNumber && table.number) {
          if (booking.tableNumber.toString() !== table.number.toString()) {
            return false;
          }
        } else {
          return false;
        }
        // Bàn bận nếu: chưa thanh toán HOẶC cùng khung giờ
        const isPending = !(booking.payment?.isPaid);
        const sameSlot = booking.time === timeValue;
        return isPending || sameSlot;
      });
    },
    [bookings]
  );

  // ==================== Lọc bàn còn trống dựa trên ngày, giờ và số người
  const availableTables = useMemo(() => {
    if (orderType !== "dine-in") return [];
    if (!formData.date || !formData.time || !formData.people) {
      return [];
    }

    return tables
      .filter((table) => table && table.isActive)
      .filter(
        (table) => Number(table.capacity || 0) >= Number(formData.people || 0)
      )
      .filter(
        (table) => !isTableBusy(table, formData.date, formData.time)
      )
      .sort((a, b) => {
        const numA = Number(a.number) || 0;
        const numB = Number(b.number) || 0;
        return numA - numB;
      });
  }, [
    tables,
    bookings,
    formData.date,
    formData.time,
    formData.people,
    orderType,
    isTableBusy,
  ]);

  // ==================== Tạo options cho DropdownSelect
  const tableOptions = useMemo(() => {
    if (availableTables.length === 0) {
      return [
        {
          label: "Không có bàn trống",
          value: "",
        },
      ];
    }
    return availableTables.map((table) => ({
      label: `Bàn ${table.number} (${table.capacity || 0} người)${
        table.location ? ` • ${table.location}` : ""
      }`,
      value: table.number.toString(),
    }));
  }, [availableTables]);

  // ==================== Fetch menu từ DB
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/menus`);
        setMenuItems(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy menu:", err.message);
      }
    };
    fetchMenu();
  }, [API_BASE_URL]);

  // ==================== Xử lý thay đổi input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ==================== Toggle món ăn đã chọn hoặc bỏ chọn
  const toggleDish = (dishId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedDishes.some(
        (dish) => dish.dishId === dishId
      );
      const updatedDishes = isSelected
        ? prev.selectedDishes.filter((dish) => dish.dishId !== dishId)
        : [...prev.selectedDishes, { dishId, quantity: 1 }];
      return { ...prev, selectedDishes: updatedDishes };
    });
  };

  // ==================== Cập nhật số lượng món ăn
  const updateQuantity = (dishId, change) => {
    setFormData((prev) => {
      const updatedDishes = prev.selectedDishes.map((dish) => {
        if (dish.dishId === dishId) {
          const newQuantity = dish.quantity + change;
          return { ...dish, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return dish;
      });
      return { ...prev, selectedDishes: updatedDishes };
    });
  };

  // ==================== Gửi đặt món
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!formData.name || !formData.phone || !formData.date || !formData.time) {
        showError("Vui lòng nhập đầy đủ thông tin khách hàng, ngày và giờ.");
        return;
      }

      if (orderType === "dine-in") {
        if (!formData.people || Number(formData.people) <= 0) {
          showError("Vui lòng nhập số lượng người hợp lệ.");
          return;
        }
        if (!formData.tableNumber) {
          showError("Vui lòng chọn một bàn đang trống.");
          return;
        }
      }

      // Chuẩn bị dữ liệu gửi đi
      const submitData = {
        name: formData.name,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        note: formData.note,
        selectedDishes: formData.selectedDishes.map((dish) => ({
          dishId: dish.dishId,
          quantity: dish.quantity,
        })),
        orderType: orderType,
        discount: formData.discount || 0,
        discountCode: formData.discountCode,
        // Thông tin cho "Ăn tại quán"
        ...(orderType === "dine-in" && {
          people: formData.people,
          tableNumber: formData.tableNumber,
        }),
        // Thông tin cho "Mang đi"
        ...(orderType === "takeaway" && {
          deliveryAddress: formData.deliveryAddress,
          deliveryEmail: formData.deliveryEmail,
        }),
      };

      await axios.post(`${API_BASE_URL}/api/bookings`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccess("Đặt món thành công!");
      setFormData({
        name: "",
        phone: "",
        date: "",
        time: "",
        people: 1,
        tableNumber: "",
        deliveryAddress: "",
        deliveryEmail: "",
        note: "",
        selectedDishes: [],
        discount: 0,
        discountCode: null,
      });
      setOrderType("dine-in");
    } catch (err) {
      console.error(
        "❌ Lỗi khi đặt món:",
        err.response ? err.response.data : err.message
      );
      const errorMsg =
        err.response?.data?.message ||
        "Lỗi khi gửi dữ liệu. Vui lòng kiểm tra lại thông tin hoặc thử lại sau.";
      showError(errorMsg);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/categories`);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh mục:", err.message);
      }
    };
    fetchCategories();
  }, [API_BASE_URL]);

  const activeCategoryNames = useMemo(() => {
    const names = categories
      .filter((cat) => cat.isActive !== false)
      .map((cat) => cat.name)
      .filter(Boolean);
    return names.length > 0 ? names : FALLBACK_CATEGORIES;
  }, [categories]);

  const categoryFilters = useMemo(() => {
    const unique = Array.from(new Set(activeCategoryNames));
    return ["Tất cả", ...unique];
  }, [activeCategoryNames]);

  const tableMap = useMemo(() => {
    const map = new Map();
    for (const table of tables) {
      if (!table) continue;
      if (table._id) {
        map.set(table._id, table);
      }
      if (table.number !== undefined && table.number !== null) {
        map.set(table.number.toString(), table);
      }
    }
    return map;
  }, [tables]);

  const matchBookingTable = (booking, table) => {
    if (!table) return false;
    const bookingTableId =
      booking.tableId?._id || booking.tableId || booking.table?._id;
    if (bookingTableId && table._id) {
      if (bookingTableId.toString() === table._id.toString()) {
        return true;
      }
    }
    if (booking.tableNumber && table.number !== undefined) {
      if (booking.tableNumber.toString() === table.number.toString()) {
        return true;
      }
    }
    return false;
  };


  const selectedTableInfo = formData.tableNumber
    ? tableMap.get(formData.tableNumber)
    : null;

  useEffect(() => {
    if (!categoryFilters.includes(selectedCategory)) {
      setSelectedCategory("Tất cả");
    }
  }, [categoryFilters, selectedCategory]);

  useEffect(() => {
    if (orderType !== "dine-in") {
      setFormData((prev) => ({
        ...prev,
        tableNumber: "",
      }));
    }
  }, [orderType]);

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      if (!cat) return;
      if (cat._id) {
        map.set(cat._id, cat.name || cat.slug || "");
      }
      if (cat.name) {
        map.set(cat.name, cat.name);
      }
    });
    FALLBACK_CATEGORIES.forEach((name) => {
      if (!map.has(name)) {
        map.set(name, name);
      }
    });
    return map;
  }, [categories]);

  const getCategoryLabel = (value) => {
    if (!value) return "Chưa phân loại";
    if (typeof value === "object") {
      return value.name || categoryMap.get(value._id) || "Chưa phân loại";
    }
    return categoryMap.get(value) || value || "Chưa phân loại";
  };

  const filteredMenu =
    selectedCategory === "Tất cả"
      ? menuItems
      : menuItems.filter((item) => {
          const label = getCategoryLabel(item.category);
          return label === selectedCategory;
        });

  const totals = useMemo(() => {
    // Tính tổng tiền với giảm giá của từng món
    const subtotal = formData.selectedDishes.reduce((total, dishItem) => {
      const dish = menuItems.find((item) => item._id === dishItem.dishId);
      if (!dish) return total;
      const basePrice = Number(dish.price) || 0;
      const discountPercent = Number(dish.discountPercent) || 0;
      const discountedPrice = basePrice * (1 - discountPercent / 100);
      return total + discountedPrice * (dishItem.quantity || 0);
    }, 0);
    // Áp dụng mã giảm giá (nếu có)
    const discountPercent = Number(formData.discount || 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = Math.max(0, subtotal - discountAmount);
    return { subtotal, discountAmount, total, discountPercent };
  }, [formData.selectedDishes, formData.discount, menuItems]);

  const handleSelectDiscount = ({ code, discount }) => {
    setFormData((prev) => ({
      ...prev,
      discountCode: code,
      discount,
    }));
  };

  const handleRemoveDiscount = () => {
    setFormData((prev) => ({
      ...prev,
      discountCode: null,
      discount: 0,
    }));
  };

  const handleSelectTable = (tableNumber) => {
    setFormData((prev) => ({
      ...prev,
      tableNumber: tableNumber || "",
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            📝 Đặt Món
          </h2>
          <p className="text-slate-600">
            Chọn hình thức đặt món và điền thông tin cần thiết
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ==================== Left Column: Form Info ==================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chọn hình thức đặt món */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                🍽️ Hình thức đặt món
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType("dine-in")}
                  className={`w-full h-14 px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center justify-center ${
                    orderType === "dine-in"
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-600 shadow-lg"
                      : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  🏠 Ăn tại quán
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("takeaway")}
                  className={`w-full h-14 px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center justify-center ${
                    orderType === "takeaway"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-600 shadow-lg"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  📦 Mang đi
                </button>
              </div>
            </div>

            {/* Thông tin khách hàng cơ bản */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                👤 Thông tin khách hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nhập họ và tên"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin cho "Ăn tại quán" */}
            {orderType === "dine-in" && (
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  🏠 Thông tin đặt bàn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Ngày <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => e.target.showPicker?.()}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Giờ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => e.target.showPicker?.()}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Số người <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="people"
                      placeholder="Số người"
                      min="1"
                      value={formData.people}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Số bàn <span className="text-red-500">*</span>
                    </label>
                    {formData.date && formData.time && formData.people ? (
                      tableOptions.length > 0 ? (
                      <>
                        <DropdownSelect
                          options={tableOptions}
                          value={formData.tableNumber}
                            onChange={handleSelectTable}
                          placeholder="Chọn bàn"
                          className="w-full"
                        />
                          <p className="mt-2 text-xs text-emerald-600">
                            ✓ Có {tableOptions.length} bàn trống phù hợp
                          </p>
                        </>
                      ) : (
                        <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                          Không có bàn trống cho {formData.people} người ở thời điểm này.
                        </div>
                      )
                    ) : (
                      <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        Vui lòng chọn ngày, giờ và số người trước
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin cho "Mang đi" */}
            {orderType === "takeaway" && (
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  📦 Thông tin nhận hàng
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Ngày giao hàng <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => e.target.showPicker?.()}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Giờ giao hàng <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => e.target.showPicker?.()}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Địa chỉ nhận hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      placeholder="Nhập địa chỉ nhận hàng"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email (tùy chọn)
                    </label>
                    <input
                      type="email"
                      name="deliveryEmail"
                      placeholder="Nhập email (để nhận thông báo)"
                      value={formData.deliveryEmail}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Ghi chú */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                📝 Ghi chú
              </label>
              <textarea
                name="note"
                placeholder="Ghi chú thêm (nếu có)..."
                value={formData.note}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            {/* Chọn mã giảm giá */}
            <DiscountCodeSection
              booking={{
                discount: formData.discount,
                discountCode: formData.discountCode,
              }}
              onSelectDiscount={handleSelectDiscount}
              onRemoveDiscount={handleRemoveDiscount}
            />

            {/* Chọn món ăn */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="font-semibold block mb-4 text-lg text-slate-900">
                🍽️ Chọn món ăn
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryFilters.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`px-4 py-2 rounded-full border font-medium transition ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-600 shadow-md"
                        : "bg-white hover:bg-emerald-50 border-slate-300 text-slate-700"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMenu.length > 0 ? (
                  filteredMenu.map((dish) => {
                    const selectedDish = formData.selectedDishes.find(
                      (item) => item.dishId === dish._id
                    );
                    const isSelected = !!selectedDish;

                    return (
                      <div
                        key={dish._id}
                        className={`border rounded-xl p-3 cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 scale-105 shadow-md"
                            : "border-slate-200 bg-white"
                        }`}
                        onClick={() => toggleDish(dish._id)}
                      >
                        <div>
                          <img
                            src={
                              dish.image ||
                              "https://via.placeholder.com/150?text=No+Image"
                            }
                            alt={dish.name}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <h4 className="text-sm font-semibold truncate text-slate-900">
                            {dish.name}
                          </h4>
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {getCategoryLabel(dish.category)}
                          </span>
                          {dish.discountPercent > 0 ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 line-through">
                                  {Number(dish.price).toLocaleString("vi-VN")} đ
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                                  -{dish.discountPercent}%
                                </span>
                              </div>
                              <p className="text-sm font-bold text-red-600">
                                {(
                                  Number(dish.price) *
                                  (1 - (Number(dish.discountPercent) || 0) / 100)
                                ).toLocaleString("vi-VN")}{" "}
                                đ
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm font-bold text-emerald-600">
                              {Number(dish.price).toLocaleString("vi-VN")} đ
                            </p>
                          )}
                        </div>

                        {isSelected && (
                          <div className="flex items-center justify-center mt-2 space-x-3 pt-2 border-t border-emerald-200">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(dish._id, -1);
                              }}
                              className="px-2 py-1 border rounded-full text-lg leading-none text-slate-700 hover:bg-emerald-100 border-emerald-300"
                            >
                              −
                            </button>
                            <span className="text-base font-semibold min-w-[20px] text-center text-emerald-700">
                              {selectedDish?.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(dish._id, 1);
                              }}
                              className="px-2 py-1 border rounded-full text-lg leading-none text-slate-700 hover:bg-emerald-100 border-emerald-300"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="col-span-full text-center text-slate-500 py-8">
                    Không tìm thấy món ăn phù hợp.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ==================== Right Column: Summary ==================== */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                📋 Tóm tắt đơn hàng
              </h3>

              {/* Thông tin đơn hàng */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Hình thức:</span>
                  <span className="font-semibold text-slate-900">
                    {orderType === "dine-in" ? "🏠 Ăn tại quán" : "📦 Mang đi"}
                  </span>
                </div>
                {orderType === "dine-in" && selectedTableInfo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Bàn:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedTableInfo.name ||
                        `Bàn ${selectedTableInfo.number}`}{" "}
                      <span className="text-xs text-slate-500">
                        ({selectedTableInfo.capacity || 0} người
                        {selectedTableInfo.area ? ` • ${selectedTableInfo.area}` : ""})
                      </span>
                    </span>
                  </div>
                )}
                {orderType === "dine-in" && formData.people && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Số người:</span>
                    <span className="font-semibold text-slate-900">
                      {formData.people}
                    </span>
                  </div>
                )}
                {formData.date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Ngày:</span>
                    <span className="font-semibold text-slate-900">
                      {new Date(formData.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
                {formData.time && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Giờ:</span>
                    <span className="font-semibold text-slate-900">
                      {formData.time}
                    </span>
                  </div>
                )}
              </div>

              {/* Danh sách món đã chọn */}
              <div className="border-t border-slate-200 pt-4 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">
                  Món đã chọn ({formData.selectedDishes.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formData.selectedDishes.length > 0 ? (
                    formData.selectedDishes.map((dishItem) => {
                      const dish = menuItems.find(
                        (item) => item._id === dishItem.dishId
                      );
                      if (!dish) return null;
                      return (
                        <div
                          key={dishItem.dishId}
                          className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg"
                        >
                          <span className="flex-1 truncate text-slate-700">
                            {dish.name} x{dishItem.quantity}
                          </span>
                          <span className="font-semibold text-emerald-600 ml-2">
                            {(
                              (Number(dish.price) || 0) *
                                (1 - (Number(dish.discountPercent) || 0) / 100) *
                              dishItem.quantity
                            ).toLocaleString("vi-VN")}{" "}
                            đ
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-2">
                      Chưa chọn món nào
                    </p>
                  )}
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600">
                    Tạm tính:
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {totals.subtotal.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                {totals.discountPercent > 0 && (
                  <div className="flex justify-between items-center text-sm font-semibold text-amber-600">
                    <span>
                      Giảm {totals.discountPercent}%{" "}
                      {formData.discountCode ? `(${formData.discountCode})` : ""}
                    </span>
                    <span>-{totals.discountAmount.toLocaleString("vi-VN")} đ</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-dashed border-emerald-200 pt-3">
                  <span className="text-base font-semibold text-slate-700">
                    Tổng cộng:
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {totals.total.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              {/* Nút submit */}
              <button
                type="submit"
                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formData.selectedDishes.length === 0}
              >
                ✅ Xác nhận đặt món
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookUser;
