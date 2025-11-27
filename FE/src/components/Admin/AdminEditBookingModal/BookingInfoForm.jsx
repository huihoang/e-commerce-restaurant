import PropTypes from "prop-types";

const BookingInfoForm = ({ booking, onChange }) => {
  const formattedDate = booking.date
    ? new Date(booking.date).toISOString().split("T")[0]
    : "";

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          📅 Ngày
        </label>
        <input
          type="date"
          name="date"
          value={formattedDate}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          ⏰ Thời gian
        </label>
        <input
          type="time"
          name="time"
          value={booking.time}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          👥 Số người
        </label>
        <input
          type="number"
          name="people"
          min="1"
          value={booking.people}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          📝 Ghi chú
        </label>
        <textarea
          name="note"
          value={booking.note || ""}
          onChange={onChange}
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Nhập ghi chú (nếu có)..."
        />
      </div>
    </div>
  );
};

export default BookingInfoForm;

BookingInfoForm.propTypes = {
  booking: PropTypes.shape({
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    time: PropTypes.string,
    people: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    note: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

