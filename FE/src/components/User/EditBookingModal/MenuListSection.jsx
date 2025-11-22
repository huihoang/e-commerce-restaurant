const MenuListSection = ({
  menuList,
  searchMenu,
  onSearchChange,
  selectedDishes,
  onAddDish,
}) => {
  const filteredMenu = menuList.filter((dish) =>
    dish.name.toLowerCase().includes(searchMenu.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-900">🧾 Danh sách món ăn</h4>
        <input
          type="text"
          placeholder="🔍 Tìm món..."
          value={searchMenu}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-48 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filteredMenu.map((dish) => {
            const isAdded = selectedDishes.some(
              (d) => d.dishId._id === dish._id
            );
            return (
              <button
                key={dish._id}
                type="button"
                onClick={() => !isAdded && onAddDish(dish)}
                disabled={isAdded}
                className={`flex flex-col items-center rounded-xl border-2 p-3 transition ${
                  isAdded
                    ? "border-green-300 bg-green-50 opacity-60"
                    : "border-slate-200 bg-white hover:border-green-300 hover:shadow-md"
                }`}
              >
                <img
                  src={dish.image || "https://via.placeholder.com/80"}
                  alt={dish.name}
                  className="mb-2 h-16 w-16 rounded-full object-cover"
                />
                <p className="text-xs font-semibold text-slate-900">{dish.name}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {dish.price?.toLocaleString("vi-VN")} đ
                </p>
                {isAdded && (
                  <span className="mt-1 text-xs font-semibold text-green-600">
                    ✓ Đã thêm
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuListSection;

