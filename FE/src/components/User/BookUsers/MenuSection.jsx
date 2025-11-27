const MenuSection = ({
  categoryFilters,
  selectedCategory,
  onCategoryChange,
  filteredMenu,
  formData,
  onToggleDish,
  onUpdateQuantity,
  getCategoryLabel,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <label className="font-semibold block mb-4 text-lg text-slate-900">
        🍽️ Chọn món ăn
      </label>
      <div className="flex flex-wrap gap-2 mb-4">
        {categoryFilters.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`px-4 py-2 rounded-full border font-medium transition ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-600 shadow-md"
                : "bg-white hover:bg-emerald-50 border-slate-300 text-slate-700"
            }`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((dish) => {
            const selectedDish = formData.selectedDishes.find(
              (item) => item.dishId === dish._id
            );
            const isSelected = !!selectedDish;

            return (
              <div
                key={dish._id}
                className={`border rounded-xl p-3 cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 scale-105 shadow-md"
                    : "border-slate-200 bg-white"
                }`}
                onClick={() => onToggleDish(dish._id)}
              >
                <div>
                  <img
                    src={
                      dish.image ||
                      "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt={dish.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h4 className="text-sm font-semibold truncate text-slate-900">
                    {dish.name}
                  </h4>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {getCategoryLabel(dish.category)}
                  </span>
                  {dish.discountPercent > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 line-through">
                          {Number(dish.price).toLocaleString("vi-VN")} đ
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                          -{dish.discountPercent}%
                        </span>
                      </div>
                      <p className="text-sm font-bold text-red-600">
                        {(
                          Number(dish.price) *
                          (1 - (Number(dish.discountPercent) || 0) / 100)
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-emerald-600">
                      {Number(dish.price).toLocaleString("vi-VN")} đ
                    </p>
                  )}
                </div>

                {isSelected && (
                  <div className="flex items-center justify-center mt-2 space-x-3 pt-2 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateQuantity(dish._id, -1);
                      }}
                      className="px-2 py-1 border rounded-full text-lg leading-none text-slate-700 hover:bg-emerald-100 border-emerald-300"
                    >
                      −
                    </button>
                    <span className="text-base font-semibold min-w-[20px] text-center text-emerald-700">
                      {selectedDish?.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateQuantity(dish._id, 1);
                      }}
                      className="px-2 py-1 border rounded-full text-lg leading-none text-slate-700 hover:bg-emerald-100 border-emerald-300"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-slate-500 py-8">
            Không tìm thấy món ăn phù hợp.
          </p>
        )}
      </div>
    </div>
  );
};

export default MenuSection;


