const DishesListSection = ({ selectedDishes, formatPrice }) => {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h4 className="mb-4 text-lg font-bold text-slate-900">
        🍽️ Món Ăn Đã Chọn ({selectedDishes?.length || 0})
      </h4>
      <div className="space-y-3">
        {selectedDishes?.map((dishItem, index) => {
          const dish = dishItem.dishId;
          const discountPercent = Number(dish?.discountPercent) || 0;
          const originalPrice = Number(dish?.price) || 0;
          const quantity = Number(dishItem.quantity) || 0;
          const discountedPrice = originalPrice * (1 - discountPercent / 100);
          const originalLineTotal = originalPrice * quantity;
          const discountedLineTotal = discountedPrice * quantity;
          
          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
            >
              <img
                src={dish?.image || "https://via.placeholder.com/80"}
                alt={dish?.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">{dish?.name}</p>
                  {discountPercent > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                      🔥 -{discountPercent}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{dish?.info || "Món ăn ngon"}</p>
              </div>
              <div className="text-right">
                {discountPercent > 0 ? (
                  <div>
                    <p className="text-sm text-slate-600">
                      <span className="text-xs text-slate-400 line-through mr-2">
                        {formatPrice(originalPrice)}
                      </span>
                      {formatPrice(discountedPrice)} x {quantity}
                    </p>
                    <p className="font-bold text-red-600">
                      {formatPrice(discountedLineTotal)}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-600">
                      {formatPrice(originalPrice)} x {quantity}
                    </p>
                    <p className="font-bold text-slate-900">
                      {formatPrice(originalLineTotal)}
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DishesListSection;

