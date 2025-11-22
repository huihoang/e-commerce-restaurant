const BasicInfoForm = ({ booking, onChange }) => {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          📅 Ngày
        </label>
        <input
          type="date"
          name="date"
          value={
            booking.date
              ? new Date(booking.date).toISOString().split("T")[0]
              : ""
          }
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
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
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
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
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
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
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="Nhập ghi chú (nếu có)..."
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;

