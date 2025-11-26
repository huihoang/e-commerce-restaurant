import BookingCard from "./BookingCard";

const BookingHistoryList = ({
  bookings,
  loading,
  activeTab,
  searchTerm,
  paymentFilter,
  calculateTotalAmount,
  formatPrice,
  onViewDetail,
  onEdit,
  onDelete,
  onPayment,
  isAdmin = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
        <p className="text-slate-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    const emptyMessage =
      searchTerm || paymentFilter !== "all"
        ? "Không tìm thấy đơn đặt món nào."
        : `Chưa có lịch sử ${
            activeTab === "dine-in" ? "đặt bàn tại quán" : "món ăn đem về"
          } nào.`;

    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const amounts = calculateTotalAmount(
          booking.selectedDishes || [],
          booking.discount || 0
        );

        return (
          <BookingCard
            key={booking._id}
            booking={booking}
            amounts={amounts}
            formatPrice={formatPrice}
            onViewDetail={onViewDetail}
            onEdit={onEdit}
            onDelete={onDelete}
            onPayment={onPayment}
            isAdmin={isAdmin}
          />
        );
      })}
    </div>
  );
};

export default BookingHistoryList;

