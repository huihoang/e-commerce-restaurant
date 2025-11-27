const BookingInfoSection = ({ booking }) => {
  return (
    <div className="mb-6 rounded-xl bg-slate-50 p-4">
      <div className="grid gap-2 text-sm">
        <p className="font-semibold text-slate-900">
          👤 Khách hàng: {booking.name || "N/A"}
        </p>
        <p className="text-slate-600">
          📅 {new Date(booking.date).toLocaleDateString("vi-VN")} - ⏰{" "}
          {booking.time}
        </p>
        {booking.people && (
          <p className="text-slate-600">👥 {booking.people} người</p>
        )}
      </div>
    </div>
  );
};

export default BookingInfoSection;


