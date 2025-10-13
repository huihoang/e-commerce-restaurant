// EditBookingModal.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const EditBookingModal = ({ booking, onClose, onSave }) => {
  const [updatedBooking, setUpdatedBooking] = useState({
    ...booking,
    selectedDishes: booking.selectedDishes || [],
  });

  const [menuList, setMenuList] = useState([]);
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
  }, []);

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

  const handleRemoveDish = (dishId) => {
    setUpdatedBooking((prev) => ({
      ...prev,
      selectedDishes: prev.selectedDishes.filter(
        (dish) => dish.dishId._id !== dishId
      ),
    }));
  };

  const handleQuantityChange = (dishId, quantity) => {
    setUpdatedBooking((prev) => ({
      ...prev,
      selectedDishes: prev.selectedDishes.map((dish) =>
        dish.dishId._id === dishId
          ? { ...dish, quantity: Number(quantity) }
          : dish
      ),
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/bookings/${updatedBooking._id}`,
        updatedBooking,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSave(updatedBooking);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật đặt bàn:", err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold mb-4">Chỉnh sửa Đặt Bàn</h3>

        <div className="mb-4">
          <label className="block">Ngày</label>
          <input
            type="date"
            name="date"
            value={
              updatedBooking.date
                ? new Date(updatedBooking.date).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block">Thời gian</label>
          <input
            type="time"
            name="time"
            value={updatedBooking.time}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block">Số người</label>
          <input
            type="number"
            name="people"
            value={updatedBooking.people}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block">Ghi chú</label>
          <textarea
            name="note"
            value={updatedBooking.note}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-lg mb-2">🍽️ Món ăn đã chọn:</h4>
          {(updatedBooking.selectedDishes || []).map((dishObj) => (
            <div
              key={dishObj.dishId._id}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center">
                <img
                  src={
                    dishObj.dishId.image || "https://via.placeholder.com/100"
                  }
                  alt={dishObj.dishId.name}
                  className="w-16 h-16 object-cover rounded-full mr-2"
                />
                <div>
                  <p className="font-medium">{dishObj.dishId.name}</p>
                  <input
                    type="number"
                    min="1"
                    value={dishObj.quantity}
                    onChange={(e) =>
                      handleQuantityChange(dishObj.dishId._id, e.target.value)
                    }
                    className="w-20 mt-1 p-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <span
                onClick={() => handleRemoveDish(dishObj.dishId._id)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                Xóa
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-2">🧾 Danh sách món ăn:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
            {menuList.map((dish) => (
              <div
                key={dish._id}
                className="cursor-pointer border rounded-lg p-2 hover:bg-gray-100 transition flex flex-col items-center"
                onClick={() => handleAddDish(dish)}
              >
                <img
                  src={dish.image || "https://via.placeholder.com/100"}
                  alt={dish.name}
                  className="w-20 h-20 object-cover rounded-full mb-2"
                />
                <p className="text-sm font-medium text-center">{dish.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <span
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded cursor-pointer"
          >
            Đóng
          </span>
          <span
            onClick={handleSave}
            className="bg-green-500 text-white py-2 px-4 rounded cursor-pointer"
          >
            Lưu thay đổi
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
