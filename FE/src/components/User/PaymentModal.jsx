import PropTypes from "prop-types";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";
import PaymentHeader from "@/components/User/PaymentModal/PaymentHeader";
import BookingInfoSection from "@/components/User/PaymentModal/BookingInfoSection";
import ItemsTable from "@/components/User/PaymentModal/ItemsTable";
import TotalsSection from "@/components/User/PaymentModal/TotalsSection";
import PaymentActions from "@/components/User/PaymentModal/PaymentActions";

const PaymentModal = ({ booking, onClose, onPaymentSuccess }) => {
  const { showSuccess, showError } = useNotification();
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
      showSuccess("Thanh toán thành công!");
      onPaymentSuccess(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi thanh toán:", err.message);
      showError("Lỗi khi thanh toán. Vui lòng thử lại!");
    }
  };

  const calculateLineTotal = (price = 0, quantity = 0, discountPercent = 0) => {
    const basePrice = Number(price) || 0;
    const qty = Number(quantity) || 0;
    const discountedPrice = basePrice * (1 - discountPercent / 100);
    return discountedPrice * qty;
  };

  const calculateTotalAmount = () => {
    // Tính tổng tiền với giảm giá của từng món
    let originalSubtotal = 0;
    let itemDiscountAmount = 0;
    const subtotal = booking.selectedDishes.reduce((total, dishItem) => {
      const price = Number(dishItem.dishId?.price) || 0;
      const quantity = Number(dishItem.quantity) || 0;
      const discountPercent = Number(dishItem.dishId?.discountPercent) || 0;
      
      const originalPrice = price * quantity;
      originalSubtotal += originalPrice;
      
      const discountedPrice = price * (1 - discountPercent / 100);
      const finalPrice = discountedPrice * quantity;
      
      if (discountPercent > 0) {
        itemDiscountAmount += originalPrice - finalPrice;
      }
      
      return total + finalPrice;
    }, 0);
    
    // Áp dụng mã giảm giá (nếu có)
    const discountPercent = booking.discount || 0;
    const discountCodeAmount = (subtotal * discountPercent) / 100;
    const total = Math.max(0, subtotal - discountCodeAmount);
    
    return {
      originalSubtotal,
      itemDiscountAmount,
      subtotal,
      discountCodeAmount,
      total,
    };
  };
  const amounts = calculateTotalAmount();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl">
        <PaymentHeader onClose={onClose} />

        <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-slate-400">
          <BookingInfoSection booking={booking} />

          <ItemsTable
            booking={booking}
            calculateLineTotal={calculateLineTotal}
          />

          <TotalsSection booking={booking} amounts={amounts} />

          <PaymentActions onClose={onClose} onConfirm={handlePayment} />
        </div>
      </div>
    </div>
  );
};

PaymentModal.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    phone: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    people: PropTypes.number,
    discount: PropTypes.number,
    selectedDishes: PropTypes.arrayOf(
      PropTypes.shape({
        dishId: PropTypes.shape({
          name: PropTypes.string,
          price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          image: PropTypes.string,
        }),
        quantity: PropTypes.number,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
};

export default PaymentModal;
