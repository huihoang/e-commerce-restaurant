const CustomerInfoSection = ({ formData, onChange }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        👤 Thông tin khách hàng
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nhập họ và tên"
            value={formData.name}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoSection;


