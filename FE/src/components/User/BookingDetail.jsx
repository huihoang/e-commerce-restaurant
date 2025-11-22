import { useMemo } from "react";
import ModalHeader from "./BookingDetail/ModalHeader";
import CustomerInfoSection from "./BookingDetail/CustomerInfoSection";
import OrderTypeInfoSection from "./BookingDetail/OrderTypeInfoSection";
import DishesListSection from "./BookingDetail/DishesListSection";
import PriceSummarySection from "./BookingDetail/PriceSummarySection";
import ModalActions from "./BookingDetail/ModalActions";

const BookingDetail = ({ booking, onClose }) => {
  const calculateTotalAmount = (selectedDishes, discount = 0) => {
    const subtotal = selectedDishes.reduce((total, dishItem) => {
      return total + dishItem.dishId.price * dishItem.quantity;
    }, 0);
    return {
      subtotal,
      discountAmount: (subtotal * discount) / 100,
      total: subtotal - (subtotal * discount) / 100,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
            formatPrice={formatPrice}
          />

          <ModalActions onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
