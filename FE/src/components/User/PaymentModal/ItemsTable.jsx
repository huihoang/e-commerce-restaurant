const ItemsTable = ({ booking, calculateLineTotal }) => {
  return (
    <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-[520px] w-full text-sm">
        <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
          <tr>
            <th className="p-4 text-left font-semibold text-slate-700">
              Món ăn
            </th>
            <th className="p-4 text-center font-semibold text-slate-700">
              Số lượng
            </th>
            <th className="p-4 text-right font-semibold text-slate-700">
              Đơn giá
            </th>
            <th className="p-4 text-right font-semibold text-slate-700">
              Thành tiền
            </th>
          </tr>
        </thead>
        <tbody>
          {booking.selectedDishes.map((dishItem, index) => (
            <tr
              key={`${dishItem.dishId?._id || dishItem.dishId || index}`}
              className="border-t border-slate-100 transition hover:bg-slate-50"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      dishItem.dishId?.image ||
                      "https://via.placeholder.com/50"
                    }
                    alt={dishItem.dishId?.name || "Món ăn"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="font-medium text-slate-900">
                    {dishItem.dishId?.name || "Tên món"}
                  </span>
                </div>
              </td>
              <td className="p-4 text-center">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                  {dishItem.quantity}
                </span>
              </td>
              <td className="p-4 text-right text-slate-700">
                {(() => {
                  const discountPercent =
                    Number(dishItem.dishId?.discountPercent) || 0;
                  const price = Number(dishItem.dishId?.price) || 0;
                  const discountedPrice =
                    price * (1 - discountPercent / 100);
                  return discountPercent > 0 ? (
                    <div>
                      <p className="text-xs text-slate-400 line-through">
                        {price.toLocaleString("vi-VN")} đ
                      </p>
                      <p className="text-red-600 font-semibold">
                        {discountedPrice.toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  ) : (
                    <span>{price.toLocaleString("vi-VN")} đ</span>
                  );
                })()}
              </td>
              <td className="p-4 text-right">
                <span className="font-bold text-emerald-600">
                  {calculateLineTotal(
                    dishItem.dishId?.price,
                    dishItem.quantity,
                    dishItem.dishId?.discountPercent || 0
                  ).toLocaleString("vi-VN")}{" "}
                  đ
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTable;


