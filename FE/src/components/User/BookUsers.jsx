import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";
import DiscountCodeSection from "@/components/User/EditBookingModal/DiscountCodeSection";
import OrderTypeSelector from "@/components/User/BookUsers/OrderTypeSelector";
import DineInSection from "@/components/User/BookUsers/DineInSection";
import CustomerInfoSection from "@/components/User/BookUsers/CustomerInfoSection";
import TakeawayInfoSection from "@/components/User/BookUsers/TakeawayInfoSection";
import NotesSection from "@/components/User/BookUsers/NotesSection";
import MenuSection from "@/components/User/BookUsers/MenuSection";
import OrderSummarySidebar from "@/components/User/BookUsers/OrderSummarySidebar";

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
  const isStaffView =
    typeof globalThis !== "undefined" &&
    globalThis.window?.location?.pathname.startsWith("/admin");
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

  // ==================== Lọc bàn còn trống dựa trên ngày, giờ và số người (view khách)
  const availableTables = useMemo(() => {
    if (orderType !== "dine-in") return [];
    // Với staff, luôn show toàn bộ bàn đang hoạt động, không phụ thuộc ngày / giờ / số người
    if (isStaffView) {
      return tables
        .filter((table) => table && table.isActive)
        .sort((a, b) => {
          const numA = Number(a.number) || 0;
          const numB = Number(b.number) || 0;
          return numA - numB;
        });
    }

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
    isStaffView,
    isTableBusy,
  ]);

  // ==================== Tạo options cho DropdownSelect (view khách)
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

  // ==================== Group bàn theo tầng/khu vực cho staff
  const staffTablesByFloor = useMemo(() => {
    if (!isStaffView || orderType !== "dine-in") return {};

    const grouped = {};
    availableTables
      .filter((table) => table && table.isActive)
      .forEach((table) => {
        const floor = table.location || "Khu vực khác";
        if (!grouped[floor]) grouped[floor] = [];
        grouped[floor].push(table);
      });

    Object.values(grouped).forEach((list) =>
      list.sort((a, b) => {
        const numA = Number(a.number) || 0;
        const numB = Number(b.number) || 0;
        return numA - numB;
      })
    );

    return grouped;
  }, [isStaffView, orderType, availableTables]);

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
            <OrderTypeSelector
              orderType={orderType}
              onChange={setOrderType}
            />

            <DineInSection
              orderType={orderType}
              isStaffView={isStaffView}
              staffTablesByFloor={staffTablesByFloor}
              formData={formData}
              onSelectTable={handleSelectTable}
              tableOptions={tableOptions}
              onChange={handleChange}
            />

            <CustomerInfoSection formData={formData} onChange={handleChange} />

            <TakeawayInfoSection
              orderType={orderType}
              formData={formData}
              onChange={handleChange}
            />

            <NotesSection note={formData.note} onChange={handleChange} />

            {/* Chọn mã giảm giá */}
            <DiscountCodeSection
              booking={{
                discount: formData.discount,
                discountCode: formData.discountCode,
              }}
              onSelectDiscount={handleSelectDiscount}
              onRemoveDiscount={handleRemoveDiscount}
            />

            <MenuSection
              categoryFilters={categoryFilters}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              filteredMenu={filteredMenu}
              formData={formData}
              onToggleDish={toggleDish}
              onUpdateQuantity={updateQuantity}
              getCategoryLabel={getCategoryLabel}
            />
          </div>

          {/* ==================== Right Column: Summary ==================== */}
          <div className="lg:col-span-1">
            <OrderSummarySidebar
              orderType={orderType}
              selectedTableInfo={selectedTableInfo}
              formData={formData}
              menuItems={menuItems}
              totals={totals}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookUser;
