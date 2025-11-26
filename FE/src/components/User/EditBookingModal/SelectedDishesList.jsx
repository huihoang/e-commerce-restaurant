import PropTypes from "prop-types";

const SelectedDishesList = ({
  selectedDishes,
  totalAmounts,
  discount,
  onQuantityChange,
  onRemoveDish,
}) => {
  return (
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
          {selectedDishes.map((dishObj, index) => {
            const dishRef = dishObj.dishId;
            const dishId =
              (typeof dishRef === "object" && dishRef?._id) || dishRef || "";
            const dish =
              typeof dishRef === "object"
                ? dishRef
                : { name: "Món ăn", price: 0, image: "" };
            const safeKey = dishId || `dish-${index}`;
            return (
              <div
                key={safeKey}
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
                        onQuantityChange(
                          dishId || index,
                          Math.max(1, dishObj.quantity - 1)
                        )
                      }
                      className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={dishObj.quantity}
                      onChange={(e) =>
                        onQuantityChange(dishId || index, e.target.value)
                      }
                      className="h-8 w-16 rounded-lg border border-slate-200 text-center text-sm font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onQuantityChange(
                          dishId || index,
                          dishObj.quantity + 1
                        )
                      }
                      className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveDish(dishId || index)}
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
      <div className="mt-4 space-y-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">💰 Tạm tính:</span>
          <span className="font-bold text-slate-900">
            {totalAmounts.subtotal.toLocaleString("vi-VN")} đ
          </span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">
              🎁 Giảm giá ({discount}%):
            </span>
            <span className="font-bold text-red-600">
              -{totalAmounts.discountAmount.toLocaleString("vi-VN")} đ
            </span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-200 pt-2">
          <span className="text-lg font-bold text-slate-900">💰 Tổng tiền:</span>
          <span className="text-xl font-bold text-green-700">
            {totalAmounts.total.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>
    </div>
  );
};

SelectedDishesList.propTypes = {
  selectedDishes: PropTypes.arrayOf(
    PropTypes.shape({
      dishId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
          _id: PropTypes.string,
          name: PropTypes.string,
          price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          image: PropTypes.string,
        }),
      ]),
      quantity: PropTypes.number,
    })
  ).isRequired,
  totalAmounts: PropTypes.shape({
    subtotal: PropTypes.number.isRequired,
    discountAmount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  discount: PropTypes.number.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemoveDish: PropTypes.func.isRequired,
};

export default SelectedDishesList;

