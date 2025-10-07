import React, { useState, useEffect } from "react";
import axios from "axios";

const BookUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    people: 1,
    note: "",
    selectedDishes: [], // Lưu thông tin món ăn cùng với số lượng
  });
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
  }, []);

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
        : [...prev.selectedDishes, { dishId, quantity: 1 }]; // Mặc định số lượng là 1
      return { ...prev, selectedDishes: updatedDishes };
    });
  };

  // ==================== Cập nhật số lượng món ăn
  const updateQuantity = (dishId, change) => {
    setFormData((prev) => {
      const updatedDishes = prev.selectedDishes.map((dish) => {
        if (dish.dishId === dishId) {
          const newQuantity = dish.quantity + change;
          return { ...dish, quantity: newQuantity > 0 ? newQuantity : 1 }; // Đảm bảo số lượng >= 1
        }
        return dish;
      });
      return { ...prev, selectedDishes: updatedDishes };
    });
  };

  // ==================== Gửi đặt bàn
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      const res = await axios.post(`${API_BASE_URL}/api/bookings`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });

      alert("✅ Đặt bàn thành công!");
      setFormData({
        name: "",
        phone: "",
        date: "",
        time: "",
        people: 1,
        note: "",
        selectedDishes: [], // Reset selected dishes
      });
    } catch (err) {
      console.error(
        "❌ Lỗi khi đặt bàn:",
        err.response ? err.response.data : err.message
      ); // Log chi tiết lỗi hơn
      alert(
        "❌ Lỗi khi gửi dữ liệu. Vui lòng kiểm tra lại thông tin hoặc thử lại sau."
      ); // Thông báo lỗi rõ hơn
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
  ]; // Cân nhắc lấy categories động từ menuItems

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📝 Đặt Bàn</h2>

      {/* Thông tin khách hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-3 rounded w-full"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
          required
          className="border p-3 rounded w-full"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          // Thêm min={new Date().toISOString().split('T')[0]} để ngăn chọn ngày quá khứ
          min={new Date().toISOString().split("T")[0]}
          className="border p-3 rounded w-full"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="border p-3 rounded w-full"
        />
        <input
          type="number"
          name="people"
          placeholder="Số người"
          min="1"
          value={formData.people}
          onChange={handleChange}
          required
          className="border p-3 rounded w-full"
        />
        <textarea
          name="note"
          placeholder="Ghi chú (nếu có)"
          value={formData.note}
          onChange={handleChange}
          rows="3"
          className="border p-3 rounded w-full md:col-span-2"
        />
      </div>

      {/* Chọn món ăn kèm */}
      <div>
        <label className="font-semibold block mb-2">🍽️ Chọn món ăn kèm:</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button" // Quan trọng: để không submit form khi nhấn
              className={`px-4 py-1 rounded-full border ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600" // Thêm border color
                  : "bg-white hover:bg-blue-100 border-gray-300" // Thêm border color
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
                  className={`border p-2 rounded-lg cursor-pointer hover:shadow transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 scale-105" // Hiệu ứng rõ hơn khi chọn
                      : "border-gray-200"
                  }`}
                  onClick={() => toggleDish(dish._id)} // Click vào thẻ để chọn/bỏ chọn
                >
                  <div>
                    {" "}
                    {/* Div bao nội dung món ăn */}
                    <img
                      src={
                        dish.image ||
                        "https://via.placeholder.com/150?text=No+Image"
                      } // Ảnh mặc định
                      alt={dish.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <h4 className="text-sm font-medium truncate">
                      {dish.name}
                    </h4>{" "}
                    {/* truncate nếu tên dài */}
                    <p className="text-xs text-gray-500 mb-1">
                      {dish.category}
                    </p>
                    <p className="text-sm font-bold text-red-600">
                      {" "}
                      {/* Màu đỏ đậm hơn */}
                      {Number(dish.price).toLocaleString("vi-VN")} đ
                    </p>
                  </div>

                  {/* Hiển thị số lượng và nút tăng giảm */}
                  {/* Chỉ hiện khi isSelected === true */}
                  <div
                    className={`flex items-center justify-center mt-2 space-x-3 ${
                      isSelected ? "opacity-100" : "opacity-0 h-0"
                    } transition-opacity duration-300`}
                  >
                    {isSelected && ( // Render chỉ khi isSelected
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // *** ĐÂY LÀ PHẦN SỬA ***
                            updateQuantity(dish._id, -1);
                          }}
                          className="px-2 py-0.5 border rounded-full text-lg leading-none text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                          // disabled={selectedDish?.quantity <= 1} // Không cần thiết vì updateQuantity đã xử lý >=1
                        >
                          -
                        </button>
                        <span className="text-base font-semibold min-w-[20px] text-center">
                          {selectedDish?.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // *** ĐÂY LÀ PHẦN SỬA ***
                            updateQuantity(dish._id, 1);
                          }}
                          className="px-2 py-0.5 border rounded-full text-lg leading-none text-gray-700 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Không tìm thấy món ăn phù hợp.
            </p>
          )}
        </div>
      </div>

      {/* Nút submit */}
      <div className="text-right mt-6">
        {" "}
        {/* Thêm margin top */}
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 shadow hover:shadow-md disabled:opacity-60"
          // disabled={formData.selectedDishes.length === 0} // Có thể thêm điều kiện disable nếu muốn bắt buộc chọn món
        >
          ✅ Đặt Bàn
        </button>
      </div>
    </form>
  );
};

export default BookUser;
