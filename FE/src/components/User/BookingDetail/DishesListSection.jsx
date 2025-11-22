const DishesListSection = ({ selectedDishes, formatPrice }) => {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h4 className="mb-4 text-lg font-bold text-slate-900">
        🍽️ Món Ăn Đã Chọn ({selectedDishes?.length || 0})
      </h4>
      <div className="space-y-3">
        {selectedDishes?.map((dishItem, index) => {
          const dish = dishItem.dishId;
          const lineTotal = dish.price * dishItem.quantity;
          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
            >
              <img
                src={dish.image || "https://via.placeholder.com/80"}
                alt={dish.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{dish.name}</p>
                <p className="text-sm text-slate-600">{dish.info || "Món ăn ngon"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">
                  {formatPrice(dish.price)} x {dishItem.quantity}
                </p>
                <p className="font-bold text-slate-900">{formatPrice(lineTotal)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DishesListSection;

