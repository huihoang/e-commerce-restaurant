import { useEffect, useState } from "react";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";
import DiscountCodeSection from "@/components/User/EditBookingModal/DiscountCodeSection";

const AdminEditBookingModal = ({ booking, onClose, onSave }) => {
  const { showSuccess, showError } = useNotification();
  const [updatedBooking, setUpdatedBooking] = useState({
    ...booking,
    selectedDishes: booking.selectedDishes || [],
  });

  const [menuList, setMenuList] = useState([]);
  const [searchMenu, setSearchMenu] = useState("");
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/menus`);
        setMenuList(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách món ăn:", err.message);
      }
    };

    fetchMenu();
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDish = (dish) => {
    const alreadyAdded = updatedBooking.selectedDishes.some(
      (d) => (d.dishId._id || d.dishId) === dish._id
    );
    if (!alreadyAdded) {
      setUpdatedBooking((prev) => ({
        ...prev,
        selectedDishes: [
          ...prev.selectedDishes,
          {
            dishId: dish,
            quantity: 1,
          },
        ],
      }));
    }
  };

  const handleRemoveDish = (dishId) => {
    setUpdatedBooking((prev) => ({
      ...prev,
      selectedDishes: prev.selectedDishes.filter(
        (dish) => (dish.dishId._id || dish.dishId) !== dishId
      ),
    }));
  };

  const handleQuantityChange = (dishId, quantity) => {
    setUpdatedBooking((prev) => ({
      ...prev,
      selectedDishes: prev.selectedDishes.map((dish) =>
        (dish.dishId._id || dish.dishId) === dishId
          ? { ...dish, quantity: Number(quantity) }
          : dish
      ),
    }));
  };

  const handleSelectDiscount = ({ code, discount }) => {
    setUpdatedBooking((prev) => ({
      ...prev,
      discountCode: code,
      discount,
    }));
  };

  const handleRemoveDiscount = () => {
    setUpdatedBooking((prev) => ({
      ...prev,
      discountCode: null,
      discount: 0,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        date: updatedBooking.date,
        time: updatedBooking.time,
        people: updatedBooking.people,
        note: updatedBooking.note,
        discount: updatedBooking.discount || 0,
        discountCode: updatedBooking.discountCode || null,
        selectedDishes: updatedBooking.selectedDishes.map((dish) => ({
          dishId: dish.dishId._id || dish.dishId,
          quantity: dish.quantity,
        })),
      };

      await axios.patch(
        `${API_BASE_URL}/api/admin/bookings/${updatedBooking._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess("Cập nhật đặt bàn thành công!");
      onSave({
        ...updatedBooking,
        discount: payload.discount,
        discountCode: payload.discountCode,
        totalAmount: calculateTotals().total,
      });
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật đặt bàn:", err.message);
      showError("Lỗi khi cập nhật đặt bàn. Vui lòng thử lại!");
    }
  };

  const filteredMenu = menuList.filter((dish) =>
    dish.name.toLowerCase().includes(searchMenu.toLowerCase())
  );

  const calculateTotals = () => {
    const subtotal = updatedBooking.selectedDishes.reduce(
      (total, dish) =>
        total + Number(dish.dishId?.price || 0) * Number(dish.quantity || 0),
      0
    );
    const discountPercent = Number(updatedBooking.discount || 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = Math.max(0, subtotal - discountAmount);
    return { subtotal, discountAmount, total };
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-3xl">
          <h3 className="text-2xl font-bold text-white">✏️ Chỉnh sửa Đặt Bàn</h3>
          <button
            onClick={onClose}
            className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-slate-400">
          {/* Basic Info Section */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                📅 Ngày
              </label>
              <input
                type="date"
                name="date"
                value={
                  updatedBooking.date
                    ? new Date(updatedBooking.date).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ⏰ Thời gian
              </label>
              <input
                type="time"
                name="time"
                value={updatedBooking.time}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                👥 Số người
              </label>
              <input
                type="number"
                name="people"
                min="1"
                value={updatedBooking.people}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                📝 Ghi chú
              </label>
              <textarea
                name="note"
                value={updatedBooking.note || ""}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Nhập ghi chú (nếu có)..."
              />
            </div>
          </div>

          {/* Selected Dishes Section */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-4 text-lg font-bold text-slate-900">
              🍽️ Món ăn đã chọn ({updatedBooking.selectedDishes.length})
            </h4>
            {updatedBooking.selectedDishes.length === 0 ? (
              <p className="text-center text-sm text-slate-500">
                Chưa có món nào được chọn
              </p>
            ) : (
              <div className="space-y-3">
                {updatedBooking.selectedDishes.map((dishObj) => {
                  const dishId = dishObj.dishId._id || dishObj.dishId;
                  const dish = dishObj.dishId;
                  return (
                    <div
                      key={dishId}
                      className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={dish.image || "https://via.placeholder.com/60"}
                          alt={dish.name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {dish.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {dish.price?.toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                dishId,
                                Math.max(1, dishObj.quantity - 1)
                              )
                            }
                            className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={dishObj.quantity}
                            onChange={(e) =>
                              handleQuantityChange(dishId, e.target.value)
                            }
                            className="h-8 w-16 rounded-lg border border-slate-200 text-center text-sm font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                dishId,
                                dishObj.quantity + 1
                              )
                            }
                            className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDish(dishId)}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-200"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4 space-y-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>🧾 Tạm tính:</span>
                <span>{totals.subtotal.toLocaleString("vi-VN")} đ</span>
              </div>
              {updatedBooking.discount > 0 && (
                <div className="flex items-center justify-between text-sm font-semibold text-amber-600">
                  <span>🎁 Giảm giá ({updatedBooking.discount}%):</span>
                  <span>-{totals.discountAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold text-green-700">
                <span>💰 Tổng tiền:</span>
                <span>{totals.total.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>
          </div>

          <DiscountCodeSection
            booking={updatedBooking}
            onSelectDiscount={handleSelectDiscount}
            onRemoveDiscount={handleRemoveDiscount}
          />

          {/* Menu List Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-900">
                🧾 Danh sách món ăn
              </h4>
              <input
                type="text"
                placeholder="🔍 Tìm món..."
                value={searchMenu}
                onChange={(e) => setSearchMenu(e.target.value)}
                className="w-48 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {filteredMenu.map((dish) => {
                  const isAdded = updatedBooking.selectedDishes.some(
                    (d) => (d.dishId._id || d.dishId) === dish._id
                  );
                  return (
                    <button
                      key={dish._id}
                      type="button"
                      onClick={() => !isAdded && handleAddDish(dish)}
                      disabled={isAdded}
                      className={`flex flex-col items-center rounded-xl border-2 p-3 transition ${
                        isAdded
                          ? "border-green-300 bg-green-50 opacity-60"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <img
                        src={dish.image || "https://via.placeholder.com/80"}
                        alt={dish.name}
                        className="mb-2 h-16 w-16 rounded-full object-cover"
                      />
                      <p className="text-xs font-semibold text-slate-900">
                        {dish.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {dish.price?.toLocaleString("vi-VN")} đ
                      </p>
                      {isAdded && (
                        <span className="mt-1 text-xs font-semibold text-green-600">
                          ✓ Đã thêm
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            >
              💾 Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditBookingModal;
