const CustomerInfoSection = ({ booking }) => {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
      <h4 className="mb-4 text-lg font-bold text-slate-900">👤 Thông Tin Khách Hàng</h4>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-sm text-slate-600">Tên khách hàng</p>
          <p className="font-semibold text-slate-900">{booking.name || "N/A"}</p>
        </div>
        {booking.phone && (
          <div>
            <p className="text-sm text-slate-600">Số điện thoại</p>
            <p className="font-semibold text-slate-900">{booking.phone}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-slate-600">Ngày đặt</p>
          <p className="font-semibold text-slate-900">
            {new Date(booking.date).toLocaleDateString("vi-VN")} - {booking.time}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-600">Số người</p>
          <p className="font-semibold text-slate-900">{booking.people} người</p>
        </div>
        {booking.note && (
          <div className="md:col-span-2">
            <p className="text-sm text-slate-600">Ghi chú</p>
            <p className="font-semibold text-slate-900">{booking.note}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoSection;

