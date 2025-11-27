const NotesSection = ({ note, onChange }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        📝 Ghi chú
      </label>
      <textarea
        name="note"
        placeholder="Ghi chú thêm (nếu có)..."
        value={note}
        onChange={onChange}
        rows="3"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </div>
  );
};

export default NotesSection;


