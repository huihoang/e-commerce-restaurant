import DropdownSelect from "@/components/common/DropdownSelect";

const DineInSection = ({
  orderType,
  isStaffView,
  staffTablesByFloor,
  formData,
  onSelectTable,
  tableOptions,
  onChange,
}) => {
  if (orderType !== "dine-in") return null;

  return (
    <>
      {/* Block chọn bàn riêng */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">🪑 Chọn bàn</h3>
        {isStaffView ? (
          <div className="space-y-4 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            {Object.keys(staffTablesByFloor).length === 0 ? (
              <div className="text-sm text-slate-500">
                Chưa có bàn nào được kích hoạt.
              </div>
            ) : (
              Object.entries(staffTablesByFloor).map(
                ([floor, floorTables]) => (
                  <div key={floor}>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      {floor}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {floorTables.map((table) => {
                        const selected =
                          formData.tableNumber?.toString() ===
                          table.number?.toString();
                        return (
                          <button
                            key={table._id || table.number}
                            type="button"
                            onClick={() =>
                              onSelectTable(table.number?.toString())
                            }
                            className={`flex flex-col items-center justify-center rounded-xl border px-3 py-3 text-center text-sm transition-all ${
                              selected
                                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                                : "border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300"
                            }`}
                          >
                            <span className="flex items-center justify-center gap-1 font-semibold text-slate-800 text-base">
                              <span role="img" aria-label="table">
                                🪑
                              </span>
                              Bàn {table.number}
                            </span>
                            <span className="mt-1 text-xs text-slate-500">
                              {table.capacity || 0} người
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        ) : formData.date && formData.time && formData.people ? (
          tableOptions.length > 0 ? (
            <>
              <DropdownSelect
                options={tableOptions}
                value={formData.tableNumber}
                onChange={onSelectTable}
                placeholder="Chọn bàn"
                className="w-full"
              />
              <p className="mt-2 text-xs text-emerald-600">
                ✓ Có {tableOptions.length} bàn trống phù hợp
              </p>
            </>
          ) : (
            <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Không có bàn trống cho {formData.people} người ở thời điểm này.
            </div>
          )
        ) : (
          <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Vui lòng chọn ngày, giờ và số người trước
          </div>
        )}
      </div>

      {/* Block chọn ngày/giờ/số người */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          🏠 Thông tin đặt bàn
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ngày <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={(e) => e.target.showPicker?.()}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Giờ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={(e) => e.target.showPicker?.()}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Số người <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="people"
              placeholder="Số người"
              min="1"
              value={formData.people}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DineInSection;


