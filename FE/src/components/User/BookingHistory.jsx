import React, { useState, useEffect } from "react";
import axios from "axios";
import EditBookingModal from "./EditBookingModal"; // Giả sử bạn đã tách EditBookingModal thành một file riêng
import PaymentModal from "./PaymentModal"; // Import modal thanh toán

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Trạng thái mở modal thanh toán
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/bookings/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedBookings = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(sortedBookings);
      } catch (err) {
        console.error("❌ Lỗi khi lấy lịch sử đặt bàn:", err.message);
      }
    };

    fetchBookings();
  }, []);

  const calculateTotalAmount = (selectedDishes) => {
    return selectedDishes.reduce((total, dishItem) => {
      return total + dishItem.dishId.price * dishItem.quantity;
    }, 0);
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleSaveBooking = (updatedBooking) => {
    updatedBooking.totalAmount = calculateTotalAmount(
      updatedBooking.selectedDishes
    );

    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
    handleCloseModal();
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (err) {
      console.error("❌ Lỗi khi xóa đặt bàn:", err.message);
    }
  };

  const handleOpenPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedBooking(null);
  };

  const handlePaymentSuccess = async (updatedBooking) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/bookings/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedBookings = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBookings(sortedBookings); // Cập nhật lại bookings
    } catch (err) {
      console.error("❌ Lỗi khi lấy lịch sử đặt bàn:", err.message);
    }
    handleClosePaymentModal();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-700">
                  {booking.name}
                </h3>
                <p className="text-sm text-gray-700">
                  📅 Ngày: {new Date(booking.date).toLocaleDateString("en-GB")}{" "}
                  - ⏰ {booking.time}
                </p>
                <p className="text-sm text-gray-700">
                  👥 Số người: {booking.people}
                </p>
                <p className="text-sm text-gray-700">
                  📝 Ghi chú: {booking.note || "Không có ghi chú"}
                </p>
                <p className="text-sm text-green-700 font-semibold">
                  {booking.isPaid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}
                </p>
              </div>
              {!booking.isPaid && (
                <div>
                  <span
                    onClick={() => handleEditBooking(booking)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-yellow-600 mr-2"
                  >
                    Chỉnh sửa
                  </span>
                  <span
                    onClick={() => handleDeleteBooking(booking._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-red-600"
                  >
                    Xoá
                  </span>
                </div>
              )}
            </div>

            {booking.selectedDishes?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  🍽️ Món ăn đã chọn:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {booking.selectedDishes.map((dishItem, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center border p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <img
                        src={
                          dishItem.dishId?.image ||
                          "https://via.placeholder.com/100"
                        }
                        alt={dishItem.dishId?.name || "Món ăn"}
                        className="w-20 h-20 object-cover rounded-full mb-2"
                      />
                      <p className="text-sm font-medium">
                        {dishItem.dishId?.name || "Tên món"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Số lượng: {dishItem.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <p className="text-xl font-semibold text-green-700">
                    Tổng tiền: {booking.totalAmount.toLocaleString("vi-VN")} đ
                  </p>
                </div>

                {!booking.isPaid && (
                  <button
                    onClick={() => handleOpenPaymentModal(booking)}
                    className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-600"
                  >
                    Thanh toán
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 text-lg">
          Chưa có lịch sử đặt bàn.
        </p>
      )}

      {isModalOpen && (
        <EditBookingModal
          booking={selectedBooking}
          onClose={handleCloseModal}
          onSave={handleSaveBooking}
        />
      )}

      {isPaymentModalOpen && (
        <PaymentModal
          booking={selectedBooking}
          onClose={handleClosePaymentModal}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default BookingHistory;
