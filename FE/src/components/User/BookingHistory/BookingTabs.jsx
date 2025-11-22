const BookingTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6 flex gap-4 border-b border-slate-200">
      <button
        onClick={() => onTabChange("dine-in")}
        className={`px-6 py-3 font-semibold transition ${
          activeTab === "dine-in"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-slate-600 hover:text-blue-600"
        }`}
      >
        🍽️ Lịch Sử Đặt Bàn Tại Quán
      </button>
      <button
        onClick={() => onTabChange("takeaway")}
        className={`px-6 py-3 font-semibold transition ${
          activeTab === "takeaway"
            ? "border-b-2 border-purple-600 text-purple-600"
            : "text-slate-600 hover:text-purple-600"
        }`}
      >
        📦 Lịch Sử Món Ăn Đem Về
      </button>
    </div>
  );
};

export default BookingTabs;

