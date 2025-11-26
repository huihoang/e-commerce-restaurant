import { useMemo } from "react";
import ModalHeader from "./BookingDetail/ModalHeader";
import CustomerInfoSection from "./BookingDetail/CustomerInfoSection";
import OrderTypeInfoSection from "./BookingDetail/OrderTypeInfoSection";
import DishesListSection from "./BookingDetail/DishesListSection";
import PriceSummarySection from "./BookingDetail/PriceSummarySection";
import ModalActions from "./BookingDetail/ModalActions";

const BookingDetail = ({ booking, onClose }) => {
  const calculateTotalAmount = (selectedDishes, discount = 0) => {
    // Tính tổng tiền với giảm giá của từng món
    let originalSubtotal = 0;
    let itemDiscountAmount = 0;
    const subtotal = selectedDishes.reduce((total, dishItem) => {
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
    const discountCodeAmount = (subtotal * discount) / 100;
    const total = Math.max(0, subtotal - discountCodeAmount);
    
    return {
      originalSubtotal,
      itemDiscountAmount,
      subtotal,
      discountCodeAmount,
      total,
    };
  };

  const amounts = useMemo(() => {
    return calculateTotalAmount(
      booking.selectedDishes || [],
      booking.discount || 0
    );
  }, [booking.selectedDishes, booking.discount]);

  const formatPrice = (price) => {
    if (!price) return "0 đ";
    return Number(price).toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl">
        <ModalHeader onClose={onClose} />

        <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-slate-400">
          <CustomerInfoSection booking={booking} />

          <OrderTypeInfoSection booking={booking} />

          <DishesListSection
            selectedDishes={booking.selectedDishes}
            formatPrice={formatPrice}
          />

          <PriceSummarySection
            amounts={amounts}
            discount={booking.discount || 0}
            discountCode={booking.discountCode}
            formatPrice={formatPrice}
          />

          <ModalActions onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
