const OrderSummarySidebar = ({
  orderType,
  selectedTableInfo,
  formData,
  menuItems,
  totals,
}) => {
  return (
    <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        📋 Tóm tắt đơn hàng
      </h3>

      {/* Thông tin đơn hàng */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Hình thức:</span>
          <span className="font-semibold text-slate-900">
            {orderType === "dine-in" ? "🏠 Ăn tại quán" : "📦 Mang đi"}
          </span>
        </div>
        {orderType === "dine-in" && selectedTableInfo && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Bàn:</span>
            <span className="font-semibold text-slate-900">
              {selectedTableInfo.name || `Bàn ${selectedTableInfo.number}`}{" "}
              <span className="text-xs text-slate-500">
                ({selectedTableInfo.capacity || 0} người
                {selectedTableInfo.area ? ` • ${selectedTableInfo.area}` : ""})
              </span>
            </span>
          </div>
        )}
        {orderType === "dine-in" && formData.people && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Số người:</span>
            <span className="font-semibold text-slate-900">
              {formData.people}
            </span>
          </div>
        )}
        {formData.date && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Ngày:</span>
            <span className="font-semibold text-slate-900">
              {new Date(formData.date).toLocaleDateString("vi-VN")}
            </span>
          </div>
        )}
        {formData.time && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Giờ:</span>
            <span className="font-semibold text-slate-900">
              {formData.time}
            </span>
          </div>
        )}
      </div>

      {/* Danh sách món đã chọn */}
      <div className="border-t border-slate-200 pt-4 mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">
          Món đã chọn ({formData.selectedDishes.length})
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {formData.selectedDishes.length > 0 ? (
            formData.selectedDishes.map((dishItem) => {
              const dish = menuItems.find(
                (item) => item._id === dishItem.dishId
              );
              if (!dish) return null;
              return (
                <div
                  key={dishItem.dishId}
                  className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg"
                >
                  <span className="flex-1 truncate text-slate-700">
                    {dish.name} x{dishItem.quantity}
                  </span>
                  <span className="font-semibold text-emerald-600 ml-2">
                    {(
                      (Number(dish.price) || 0) *
                      (1 - (Number(dish.discountPercent) || 0) / 100) *
                      dishItem.quantity
                    ).toLocaleString("vi-VN")}{" "}
                    đ
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 text-center py-2">
              Chưa chọn món nào
            </p>
          )}
        </div>
      </div>

      {/* Tổng tiền */}
      <div className="border-t border-slate-200 pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-600">
            Tạm tính:
          </span>
          <span className="text-base font-bold text-slate-900">
            {totals.subtotal.toLocaleString("vi-VN")} đ
          </span>
        </div>
        {totals.discountPercent > 0 && (
          <div className="flex justify-between items-center text-sm font-semibold text-amber-600">
            <span>
              Giảm {totals.discountPercent}%{" "}
              {formData.discountCode ? `(${formData.discountCode})` : ""}
            </span>
            <span>-{totals.discountAmount.toLocaleString("vi-VN")} đ</span>
          </div>
        )}
        <div className="flex justify-between items-center border-t border-dashed border-emerald-200 pt-3">
          <span className="text-base font-semibold text-slate-700">
            Tổng cộng:
          </span>
          <span className="text-2xl font-bold text-emerald-600">
            {totals.total.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>

      {/* Nút submit */}
      <button
        type="submit"
        className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={formData.selectedDishes.length === 0}
      >
        ✅ Xác nhận đặt món
      </button>
    </div>
  );
};

export default OrderSummarySidebar;


