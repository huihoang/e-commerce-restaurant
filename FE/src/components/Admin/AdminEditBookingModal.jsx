import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";
import DiscountCodeSection from "@/components/User/EditBookingModal/DiscountCodeSection";
import BookingModalHeader from "@/components/Admin/AdminEditBookingModal/BookingModalHeader";
import BookingInfoForm from "@/components/Admin/AdminEditBookingModal/BookingInfoForm";
import SelectedDishesSection from "@/components/Admin/AdminEditBookingModal/SelectedDishesSection";
import MenuGridSection from "@/components/Admin/AdminEditBookingModal/MenuGridSection";
import ModalActionsSection from "@/components/Admin/AdminEditBookingModal/ModalActionsSection";

const AdminEditBookingModal = ({ booking, onClose, onSave }) => {
  const { showSuccess, showError } = useNotification();
  const [updatedBooking, setUpdatedBooking] = useState({
    ...booking,
    selectedDishes: booking.selectedDishes || [],
    durationMinutes: booking.durationMinutes || 60,
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

  const addMinutesToTime = (timeStr, minutesToAdd) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return "";
    const total = h * 60 + m + minutesToAdd;
    const normalized = ((total % (24 * 60)) + (24 * 60)) % (24 * 60);
    const hh = String(Math.floor(normalized / 60)).padStart(2, "0");
    const mm = String(normalized % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const computeDurationFromEndTime = (startTime, endTime) => {
    if (!startTime || !endTime) return 60;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    if ([sh, sm, eh, em].some((v) => Number.isNaN(v))) return 60;
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    const delta = end - start;
    return delta > 0 ? delta : 60;
  };

  const currentEndTime = addMinutesToTime(
    updatedBooking.time,
    Number(updatedBooking.durationMinutes || 60)
  );

  const handleEndTimeChange = (e) => {
    const endTime = e.target.value;
    const nextDuration = computeDurationFromEndTime(
      updatedBooking.time,
      endTime
    );
    setUpdatedBooking((prev) => ({
      ...prev,
      durationMinutes: nextDuration,
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
        durationMinutes: Number(updatedBooking.durationMinutes) || 60,
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
        durationMinutes: payload.durationMinutes,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl">
        <BookingModalHeader onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:hover:bg-slate-400">
          <BookingInfoForm
            booking={updatedBooking}
            onChange={handleChange}
            endTime={currentEndTime}
            onEndTimeChange={handleEndTimeChange}
          />

          <SelectedDishesSection
            selectedDishes={updatedBooking.selectedDishes}
            discountPercent={updatedBooking.discount}
            totals={totals}
            onQuantityChange={handleQuantityChange}
            onRemoveDish={handleRemoveDish}
          />

          <DiscountCodeSection
            booking={updatedBooking}
            onSelectDiscount={handleSelectDiscount}
            onRemoveDiscount={handleRemoveDiscount}
          />

          <MenuGridSection
            menu={filteredMenu}
            searchValue={searchMenu}
            onSearchChange={setSearchMenu}
            selectedDishes={updatedBooking.selectedDishes}
            onAddDish={handleAddDish}
          />

          <ModalActionsSection onCancel={onClose} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default AdminEditBookingModal;

AdminEditBookingModal.propTypes = {
  booking: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
