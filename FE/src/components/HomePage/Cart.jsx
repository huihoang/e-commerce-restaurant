// ==================== All Import
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, updateQuantity, clearCart, addToCart } from "@/utils/cart";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [related, setRelated] = useState([]);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    setItems(getCart());
    const handler = () => setItems(getCart());
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/menus`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRelated(data.slice(0, 4));
      })
      .catch(() => {});
  }, [API_BASE_URL]);

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
        0
      ),
    [items]
  );

  const handleQty = (id, qty) => {
    const next = updateQuantity(id, qty);
    setItems(next);
  };

  const handleOrder = () => {
    // Placeholder: submit order or booking
    alert("Đặt hàng/Đặt bàn thành công! Cảm ơn bạn.");
    clearCart();
    setItems([]);
  };

  return (
    <div className="bg-white max-w-7xl mx-auto shadow-sm">
      <section className="px-6 sm:px-8 lg:px-12 pt-10 pb-16">
        <h1 className="font-PlayfairD text-4xl sm:text-6xl lg:text-[100px] font-normal leading-[1.2] text-center">
          Giỏ hàng
        </h1>

        <div className="mt-12 flex flex-col lg:flex-row gap-8">
          {/* ================= Left: Cart items ================= */}
          <div className="w-full lg:w-[60%]">
            {items.length === 0 ? (
              <div className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-10 flex flex-col items-center text-center shadow-sm">
                <div className="w-[120px] h-[120px] rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                  <span className="text-5xl">🛒</span>
                </div>
                <h4 className="mt-6 font-PlayfairD text-2xl text-slate-800">Giỏ hàng đang trống</h4>
                <p className="mt-2 font-DM_sans text-slate-600">Khám phá thực đơn và thêm những món bạn yêu thích.</p>
                <Link to="/menu" className="mt-6">
                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    Xem thực đơn
                  </button>
                </Link>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  {["🍣", "🍜", "🥗", "🍰"].map((e, idx) => (
                    <div key={idx} className="py-3 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl hover:shadow-md transition">
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((i) => (
                  <div
                    key={i._id}
                    className="flex items-start gap-4 p-4 border rounded-xl bg-gradient-to-br from-slate-50 to-white"
                  >
                    {/* Image (always left) */}
                    <div className="w-[90px] h-[90px] rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={i.image}
                        alt={i.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content column */}
                    <div className="flex-1">
                      <h4 className="font-DM_sans font-bold text-lg">
                        {i.name}
                      </h4>
                      <p className="text-blue-600 font-DM_sans font-bold">
                        {Number(i.price).toLocaleString("vi-VN")} đ
                      </p>

                      {/* Mobile controls under name/price */}
                      <div className="mt-2 flex items-center gap-2 sm:hidden">
                        <button
                          aria-label="Giảm số lượng"
                          className="w-10 h-10 rounded-lg border bg-white hover:bg-blue-50 text-slate-700 text-xl leading-none flex items-center justify-center"
                          onClick={() => handleQty(i._id, Math.max(0, Number(i.quantity) - 1))}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={i.quantity}
                          onChange={(e) =>
                            handleQty(i._id, Math.max(0, Number(e.target.value)))
                          }
                          className="w-16 h-10 border rounded-lg px-2 text-center"
                        />
                        <button
                          aria-label="Tăng số lượng"
                          className="w-10 h-10 rounded-lg border bg-white hover:bg-blue-50 text-slate-700 text-xl leading-none flex items-center justify-center"
                          onClick={() => handleQty(i._id, Number(i.quantity) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Desktop controls on the right */}
                    <div className="hidden sm:flex items-center gap-2">
                      <button
                        aria-label="Giảm số lượng"
                        className="w-10 h-10 rounded-lg border bg-white hover:bg-blue-50 text-slate-700 text-xl leading-none flex items-center justify-center"
                        onClick={() => handleQty(i._id, Math.max(0, Number(i.quantity) - 1))}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={i.quantity}
                        onChange={(e) =>
                          handleQty(i._id, Math.max(0, Number(e.target.value)))
                        }
                        className="w-16 h-10 border rounded-lg px-2 text-center"
                      />
                      <button
                        aria-label="Tăng số lượng"
                        className="w-10 h-10 rounded-lg border bg-white hover:bg-blue-50 text-slate-700 text-xl leading-none flex items-center justify-center"
                        onClick={() => handleQty(i._id, Number(i.quantity) + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-bold text-slate-800">
                    Tổng:{" "}
                    <span className="text-blue-600">
                      {totalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ================= Right: Customer info ================= */}
          <div className="w-full lg:w-[40%]">
            <div className="p-6 rounded-2xl shadow-2xl">
              <h3 className="font-PlayfairD font-medium text-2xl">
                Thông tin người đặt
              </h3>

              <div className="mt-6 space-y-4">
                <input
                  placeholder="Họ tên"
                  className="w-full h-12 border-2 rounded-lg px-3"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <input
                  placeholder="Số điện thoại"
                  className="w-full h-12 border-2 rounded-lg px-3"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, phone: e.target.value }))
                  }
                />
                <input
                  placeholder="Email"
                  className="w-full h-12 border-2 rounded-lg px-3"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, email: e.target.value }))
                  }
                />
                <input
                  placeholder="Địa chỉ (nếu giao hàng)"
                  className="w-full h-12 border-2 rounded-lg px-3"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, address: e.target.value }))
                  }
                />
                <textarea
                  placeholder="Ghi chú"
                  className="w-full h-24 border-2 rounded-lg px-3 py-2"
                  value={customer.note}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, note: e.target.value }))
                  }
                />

                <button
                  className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  onClick={handleOrder}
                  disabled={items.length === 0}
                >
                  Xác nhận đặt
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Related items ================= */}
        <div className="mt-16">
          <h3 className="font-PlayfairD font-medium text-2xl">
            Gợi ý món ăn
          </h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((m) => (
              <div key={m._id} className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white hover:border-blue-300 hover:shadow-xl transition">
                <div className="w-full h-[160px] overflow-hidden">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h5 className="font-DM_sans font-bold text-base">{m.name}</h5>
                  <p className="text-blue-600 font-bold mt-1">{Number(m.price).toLocaleString("vi-VN")} đ</p>
                  <button
                    className="mt-3 w-full py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition"
                    onClick={() => addToCart(m, 1)}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;


