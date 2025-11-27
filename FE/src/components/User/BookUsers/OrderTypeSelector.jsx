const OrderTypeSelector = ({ orderType, onChange }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        🍽️ Hình thức đặt món
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("dine-in")}
          className={`w-full h-14 px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center justify-center ${
            orderType === "dine-in"
              ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-600 shadow-lg"
              : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
          }`}
        >
          🏠 Ăn tại quán
        </button>
        <button
          type="button"
          onClick={() => onChange("takeaway")}
          className={`w-full h-14 px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center justify-center ${
            orderType === "takeaway"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-600 shadow-lg"
              : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
          }`}
        >
          📦 Mang đi
        </button>
      </div>
    </div>
  );
};

export default OrderTypeSelector;


