import PropTypes from "prop-types";

const SelectedDishesSection = ({
  selectedDishes,
  discountPercent = 0,
  totals,
  onQuantityChange,
  onRemoveDish,
}) => (
  <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <h4 className="mb-4 text-lg font-bold text-slate-900">
      🍽️ Món ăn đã chọn ({selectedDishes.length})
    </h4>

    {selectedDishes.length === 0 ? (
      <p className="text-center text-sm text-slate-500">
        Chưa có món nào được chọn
      </p>
    ) : (
      <div className="space-y-3">
        {selectedDishes.map((dishObj) => {
          const dishId = dishObj.dishId._id || dishObj.dishId;
          const dish = dishObj.dishId;

          return (
            <div
              key={dishId}
              className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={dish.image || "https://via.placeholder.com/60"}
                  alt={dish.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900">{dish.name}</p>
                  <p className="text-sm text-slate-600">
                    {dish.price?.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onQuantityChange(dishId, Math.max(1, dishObj.quantity - 1))
                    }
                    className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={dishObj.quantity}
                    onChange={(e) => onQuantityChange(dishId, e.target.value)}
                    className="h-8 w-16 rounded-lg border border-slate-200 text-center text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => onQuantityChange(dishId, dishObj.quantity + 1)}
                    className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveDish(dishId)}
                  className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-200"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}

    <div className="mt-4 space-y-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>🧾 Tạm tính:</span>
        <span>{totals.subtotal.toLocaleString("vi-VN")} đ</span>
      </div>
      {discountPercent > 0 && (
        <div className="flex items-center justify-between text-sm font-semibold text-amber-600">
          <span>🎁 Giảm giá ({discountPercent}%):</span>
          <span>-{totals.discountAmount.toLocaleString("vi-VN")} đ</span>
        </div>
      )}
      <div className="flex items-center justify-between text-lg font-bold text-green-700">
        <span>💰 Tổng tiền:</span>
        <span>{totals.total.toLocaleString("vi-VN")} đ</span>
      </div>
    </div>
  </div>
);

export default SelectedDishesSection;

SelectedDishesSection.propTypes = {
  selectedDishes: PropTypes.arrayOf(
    PropTypes.shape({
      dishId: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      quantity: PropTypes.number,
    })
  ).isRequired,
  discountPercent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totals: PropTypes.shape({
    subtotal: PropTypes.number.isRequired,
    discountAmount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemoveDish: PropTypes.func.isRequired,
};

