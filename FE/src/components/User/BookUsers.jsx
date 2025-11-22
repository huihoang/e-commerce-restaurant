import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";
import DropdownSelect from "@/components/common/DropdownSelect";

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
  });
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [bookings, setBookings] = useState([]); // Danh sách booking để check bàn đã đặt
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ==================== Mock data: Danh sách bàn (có thể fetch từ API sau)
  const allTables = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      let capacity;
      if (i < 5) {
        capacity = 2;
      } else if (i < 10) {
        capacity = 4;
      } else if (i < 15) {
        capacity = 6;
      } else {
        capacity = 8;
      }
      return {
        number: i + 1,
        capacity,
      };
    });
  }, []);

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
        setBookings(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách đặt bàn:", err.message);
      }
    };
    fetchBookings();
  }, [API_BASE_URL]);

  // ==================== Lọc bàn còn trống dựa trên ngày, giờ và số người
  const availableTables = useMemo(() => {
    if (!formData.date || !formData.time || !formData.people) {
      return allTables;
    }

    // Lọc các booking trùng ngày và giờ
    const conflictingBookings = bookings.filter((booking) => {
      if (booking.orderType !== "dine-in") return false;
      const bookingDate = new Date(booking.date).toISOString().split("T")[0];
      return bookingDate === formData.date && booking.time === formData.time;
    });

    // Lấy danh sách số bàn đã được đặt
    const bookedTableNumbers = new Set(
      conflictingBookings
        .map((b) => b.tableNumber)
        .filter(Boolean)
        .map((num) => num.toString())
    );

    // Lọc bàn còn trống và phù hợp với số người
    return allTables.filter(
      (table) =>
        !bookedTableNumbers.has(table.number.toString()) &&
        table.capacity >= formData.people
    );
  }, [allTables, bookings, formData.date, formData.time, formData.people]);

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
      label: `Bàn ${table.number} (${table.capacity} người)`,
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

  // ==================== Lọc món theo category
  const filteredMenu =
    selectedCategory === "Tất cả"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const categories = [
    "Tất cả",
    "Bữa Sáng",
    "Bữa Trưa",
    "Đồ Uống",
    "Tráng Miệng",
  ];

  // Tính tổng tiền
  const calculateTotal = () => {
    return formData.selectedDishes.reduce((total, dishItem) => {
      const dish = menuItems.find((item) => item._id === dishItem.dishId);
      return total + (dish?.price || 0) * (dishItem.quantity || 0);
    }, 0);
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
                      <>
                        <DropdownSelect
                          options={tableOptions}
                          value={formData.tableNumber}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              tableNumber: value,
                            }))
                          }
                          placeholder="Chọn bàn"
                          className="w-full"
                        />
                        {availableTables.length > 0 && (
                          <p className="mt-2 text-xs text-emerald-600">
                            ✓ Có {availableTables.length} bàn trống phù hợp
                          </p>
                        )}
                        {availableTables.length === 0 && (
                          <p className="mt-2 text-xs text-red-500">
                            ⚠ Không có bàn trống cho {formData.people} người vào thời điểm này
                          </p>
                        )}
                      </>
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

            {/* Chọn món ăn */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="font-semibold block mb-4 text-lg text-slate-900">
                🍽️ Chọn món ăn
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat) => (
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
                          <p className="text-xs text-slate-500 mb-1">
                            {dish.category}
                          </p>
                          <p className="text-sm font-bold text-emerald-600">
                            {Number(dish.price).toLocaleString("vi-VN")} đ
                          </p>
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
                {orderType === "dine-in" && Boolean(formData.tableNumber) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Bàn số:</span>
                    <span className="font-semibold text-slate-900">
                      {formData.tableNumber}
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
                              dish.price * dishItem.quantity
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
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-semibold text-slate-700">
                    Tổng cộng:
                  </span>
                  <span className="text-xl font-bold text-emerald-600">
                    {calculateTotal().toLocaleString("vi-VN")} đ
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
