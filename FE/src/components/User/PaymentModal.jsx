// src/components/PaymentModal.js
import React from "react";
import axios from "axios";

const PaymentModal = ({ booking, onClose, onPaymentSuccess }) => {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/bookings/${booking._id}/pay`,
        { isPaid: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onPaymentSuccess(res.data); // Thông báo cho component cha
    } catch (err) {
      console.error("❌ Lỗi khi thanh toán:", err.message);
    }
  };

  const calculateLineTotal = (price, quantity) => price * quantity;

  const calculateTotalAmount = () => {
    return booking.selectedDishes.reduce((total, dishItem) => {
      return (
        total + calculateLineTotal(dishItem.dishId.price, dishItem.quantity)
      );
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Thanh toán</h2>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Món ăn</th>
                <th className="p-2 border">Số lượng</th>
                <th className="p-2 border">Đơn giá</th>
                <th className="p-2 border">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {booking.selectedDishes.map((dishItem, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 border">
                    {dishItem.dishId?.name || "Tên món"}
                  </td>
                  <td className="p-2 border text-center">
                    {dishItem.quantity}
                  </td>
                  <td className="p-2 border text-right">
                    {dishItem.dishId?.price?.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="p-2 border text-right">
                    {calculateLineTotal(
                      dishItem.dishId.price,
                      dishItem.quantity
                    ).toLocaleString("vi-VN")}{" "}
                    đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tổng tiền tổng cộng */}
        <div className="text-right font-semibold text-lg text-green-700 mb-4">
          Tổng cộng: {calculateTotalAmount().toLocaleString("vi-VN")} đ
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handlePayment}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Thanh toán
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
