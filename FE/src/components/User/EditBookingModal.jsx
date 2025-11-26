import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";
import ModalHeader from "./EditBookingModal/ModalHeader";
import BasicInfoForm from "./EditBookingModal/BasicInfoForm";
import DiscountCodeSection from "./EditBookingModal/DiscountCodeSection";
import SelectedDishesList from "./EditBookingModal/SelectedDishesList";
import MenuListSection from "./EditBookingModal/MenuListSection";
import ModalActions from "./EditBookingModal/ModalActions";

const EditBookingModal = ({ booking, onClose, onSave }) => {
  const { showSuccess, showError } = useNotification();
  const [updatedBooking, setUpdatedBooking] = useState({
    ...booking,
    selectedDishes: booking.selectedDishes || [],
    discount: booking.discount || 0,
    discountCode: booking.discountCode || null,
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
      (d) => d.dishId._id === dish._id
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

  const getDishIdValue = (dishId) => {
    if (typeof dishId === "object" && dishId?._id) {
      return dishId._id;
    }
    return dishId;
  };

  const normalizeKey = (value, fallback) => {
    if (value === undefined || value === null || value === "") {
      return fallback;
    }
    return value;
  };

  const handleRemoveDish = (dishId) => {
    setUpdatedBooking((prev) => ({
      ...prev,
      selectedDishes: prev.selectedDishes.filter((dish, idx) => {
        const key = getDishIdValue(dish.dishId);
        return normalizeKey(key, idx) !== dishId;
      }),
    }));
  };

  const handleQuantityChange = (dishId, quantity) => {
    setUpdatedBooking((prev) => ({
      ...prev,
      selectedDishes: prev.selectedDishes.map((dish, idx) => {
        const key = getDishIdValue(dish.dishId);
        if (normalizeKey(key, idx) === dishId) {
          return { ...dish, quantity: Number(quantity) };
        }
        return dish;
      }),
    }));
  };

  const handleSelectDiscount = (discountCode) => {
    setUpdatedBooking((prev) => ({
      ...prev,
      discountCode: discountCode.code,
      discount: discountCode.discount,
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
        name: updatedBooking.name,
        phone: updatedBooking.phone,
        date: updatedBooking.date,
        time: updatedBooking.time,
        people: updatedBooking.people,
        note: updatedBooking.note,
        tableNumber: updatedBooking.tableNumber,
        discount: updatedBooking.discount || 0,
        discountCode: updatedBooking.discountCode || null,
        selectedDishes: (updatedBooking.selectedDishes || []).map((dish) => ({
          dishId: getDishIdValue(dish.dishId),
          quantity: dish.quantity,
        })),
      };
      await axios.put(
        `${API_BASE_URL}/api/bookings/${updatedBooking._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSuccess("Cập nhật đặt món thành công!");
      const hydratedDishes = payload.selectedDishes.map((dish) => {
        const original = (updatedBooking.selectedDishes || []).find((item) => {
          const key = getDishIdValue(item.dishId);
          return key === dish.dishId;
        });
        if (original && typeof original.dishId === "object") {
          return {
            dishId: original.dishId,
            quantity: dish.quantity,
          };
        }
        return {
          dishId: dish.dishId,
          quantity: dish.quantity,
        };
      });
      onSave({
        ...updatedBooking,
        ...payload,
        selectedDishes: hydratedDishes,
      });
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật đặt món:", err.message);
      showError("Lỗi khi cập nhật đặt món. Vui lòng thử lại!");
    }
  };

  const calculateTotal = () => {
    const subtotal = updatedBooking.selectedDishes.reduce(
      (total, dish) =>
        total + (dish.dishId?.price || 0) * (dish.quantity || 0),
      0
    );
    const discountAmount = (subtotal * (updatedBooking.discount || 0)) / 100;
    return {
      subtotal,
      discountAmount,
      total: subtotal - discountAmount,
    };
  };

  const totalAmounts = calculateTotal();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl">
        <ModalHeader onClose={onClose} />

        <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-slate-400">
          <BasicInfoForm booking={updatedBooking} onChange={handleChange} />

          <DiscountCodeSection
            booking={updatedBooking}
            onSelectDiscount={handleSelectDiscount}
            onRemoveDiscount={handleRemoveDiscount}
          />

          <SelectedDishesList
            selectedDishes={updatedBooking.selectedDishes}
            totalAmounts={totalAmounts}
            discount={updatedBooking.discount}
            onQuantityChange={handleQuantityChange}
            onRemoveDish={handleRemoveDish}
          />

          <MenuListSection
            menuList={menuList}
            searchMenu={searchMenu}
            onSearchChange={setSearchMenu}
            selectedDishes={updatedBooking.selectedDishes}
            onAddDish={handleAddDish}
          />

          <ModalActions onClose={onClose} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
};

EditBookingModal.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    phone: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    people: PropTypes.number,
    note: PropTypes.string,
    tableNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    discount: PropTypes.number,
    discountCode: PropTypes.string,
    selectedDishes: PropTypes.arrayOf(
      PropTypes.shape({
        dishId: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string,
            price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            image: PropTypes.string,
          }),
        ]),
        quantity: PropTypes.number,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditBookingModal;
