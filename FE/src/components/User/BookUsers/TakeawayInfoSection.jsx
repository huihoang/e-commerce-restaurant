const TakeawayInfoSection = ({ orderType, formData, onChange }) => {
  if (orderType !== "takeaway") return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        📦 Thông tin nhận hàng
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ngày giao hàng <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={(e) => e.target.showPicker?.()}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Giờ giao hàng <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={(e) => e.target.showPicker?.()}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Địa chỉ nhận hàng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="deliveryAddress"
            placeholder="Nhập địa chỉ nhận hàng"
            value={formData.deliveryAddress}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Email (tùy chọn)
          </label>
          <input
            type="email"
            name="deliveryEmail"
            placeholder="Nhập email (để nhận thông báo)"
            value={formData.deliveryEmail}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
    </div>
  );
};

export default TakeawayInfoSection;


