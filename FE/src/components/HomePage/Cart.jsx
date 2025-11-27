// ==================== All Import
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getCart, updateQuantity, clearCart, addToCart } from "@/utils/cart";
import { useNotification } from "@/contexts/NotificationContext";
import TableSelectionGrid from "@/components/common/TableSelectionGrid";

const Cart = () => {
  const { showError, showSuccess } = useNotification();
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const createInitialCustomer = useCallback(
    () => ({
      name: "",
      phone: "",
      email: "",
      date: today,
      time: "",
      people: 1,
      tableId: "",
      tableNumber: "",
      deliveryAddress: "",
      note: "",
    }),
    [today]
  );
  const [items, setItems] = useState([]);
  const [orderType, setOrderType] = useState("dine-in"); // "dine-in" hoặc "takeaway"
  const [customer, setCustomer] = useState(() => createInitialCustomer());
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [related, setRelated] = useState([]);
  const [bookings, setBookings] = useState([]); // Danh sách booking để check bàn đã đặt
  const [tables, setTables] = useState([]);
  const [showTableResetModal, setShowTableResetModal] = useState(false);
  const sliderRef = useRef(null);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const normalizeBooking = (booking) => ({
    ...booking,
    orderType: booking.orderType || (booking.ship?.isShip ? "takeaway" : "dine-in"),
  });

  const tableMap = useMemo(() => {
    const map = new Map();
    for (const table of tables) {
      if (!table) continue;
      if (table._id) {
        map.set(table._id, table);
      }
      if (table.number !== undefined && table.number !== null) {
        map.set(table.number.toString(), table);
      }
    }
    return map;
  }, [tables]);

  const matchBookingTable = (booking, table) => {
    if (!table) return false;
    const bookingTableId =
      booking.tableId?._id || booking.tableId || booking.table?._id;
    if (bookingTableId && table._id) {
      if (bookingTableId.toString() === table._id.toString()) {
        return true;
      }
    }
    if (booking.tableNumber && table.number !== undefined) {
      if (booking.tableNumber.toString() === table.number.toString()) {
        return true;
      }
    }
    return false;
  };

  const isTableBusy = useCallback(
    (table, dateValue, timeValue) => {
      if (!table) return true;
      const dateKey = (dateValue || today).split("T")[0];
      return bookings.some((booking) => {
        const bookingOrderType =
          booking.orderType || (booking.ship?.isShip ? "takeaway" : "dine-in");
        if (bookingOrderType !== "dine-in") return false;
        const bookingDate = (booking.date || "").split("T")[0];
        if (bookingDate !== dateKey) return false;
        if (!matchBookingTable(booking, table)) return false;
        const isPending = !(booking.payment?.isPaid);
        if (!timeValue) {
          return isPending;
        }
        const sameSlot = booking.time === timeValue;
        return isPending || sameSlot;
      });
    },
    [bookings, today]
  );

  const getTableLabel = useCallback((table) => {
    if (!table) return "Bàn";
    return table.name || `Bàn ${table.number}`;
  }, []);

  // ==================== Fetch bookings để check bàn đã đặt
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API_BASE_URL}/api/bookings`, { headers });
        const data = Array.isArray(res.data)
          ? res.data.map(normalizeBooking)
          : [];
        setBookings(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách đặt bàn:", err.message);
        setBookings([]); // Set empty array on error to avoid blocking table selection
      }
    };
    fetchBookings();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (orderType !== "dine-in") {
      setCustomer((prev) => ({
        ...prev,
        tableId: "",
        tableNumber: "",
      }));
    }
  }, [orderType]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/tables`);
        setTables(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách bàn:", err.message);
      }
    };
    fetchTables();
  }, [API_BASE_URL]);

  // ==================== Lọc bàn còn trống dựa trên ngày, giờ và số người
  const effectiveDate = customer.date || today;
  const availableTables = useMemo(() => {
    if (!customer.people) {
      return [];
    }

    return tables
      .filter((table) => table && table.isActive)
      .filter(
      (table) =>
          Number(table.capacity || 0) >= Number(customer.people || 0)
      )
      .filter((table) => !isTableBusy(table, effectiveDate, customer.time))
      .sort((a, b) => (a.number || 0) - (b.number || 0));
  }, [
    tables,
    effectiveDate,
    customer.time,
    customer.people,
    isTableBusy,
  ]);

  useEffect(() => {
    if (!customer.tableId) return;
    const stillValid = availableTables.some(
      (table) => table._id?.toString() === customer.tableId?.toString()
    );
    if (!stillValid) {
      setCustomer((prev) => ({
        ...prev,
        tableId: "",
        tableNumber: "",
      }));
      setShowTableResetModal(true);
    }
  }, [availableTables, customer.tableId, setCustomer]);

  useEffect(() => {
    if (showTableResetModal && availableTables.length > 0) {
      setShowTableResetModal(false);
    }
  }, [availableTables.length, showTableResetModal]);

  useEffect(() => {
    setItems(getCart());
    const handler = () => setItems(getCart());
    globalThis.addEventListener("cartUpdated", handler);
    return () => globalThis.removeEventListener("cartUpdated", handler);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/menus`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRelated(data);
      })
      .catch(() => {});
  }, [API_BASE_URL]);

  const handlePrev = () => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector(".related-card");
    const step = (card?.offsetWidth || 280) + 24;
    if (el.scrollLeft <= 0) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      return;
    }
    el.scrollBy({ left: -step, behavior: "smooth" });
  };

  const handleNext = () => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector(".related-card");
    const step = (card?.offsetWidth || 280) + 24;
    if (el.scrollLeft + el.clientWidth + step >= el.scrollWidth) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, i) => {
        const basePrice = Number(i.price) || 0;
        const discountPercent = Number(i.discountPercent) || 0;
        const discountedPrice = basePrice * (1 - discountPercent / 100);
        return sum + discountedPrice * (Number(i.quantity) || 0);
      }, 0),
    [items]
  );

  const shippingEligible = orderType === "takeaway" && items.length > 0;
  const shippingFee = useMemo(() => {
    if (!shippingEligible) return 0;
    if (totalPrice >= 300000) return 0;
    return 30000;
  }, [shippingEligible, totalPrice]);

  const TRANSFER_DISCOUNT_CODE = "CHUYENKHOAN";
  const TRANSFER_DISCOUNT_PERCENT = 5;
  const applyTransferDiscount = paymentMethod === "bank";
  const discountRate = applyTransferDiscount
    ? TRANSFER_DISCOUNT_PERCENT / 100
    : 0;
  const discountAmount = useMemo(
    () => totalPrice * discountRate,
    [totalPrice, discountRate]
  );
  const payableSubtotal = Math.max(totalPrice - discountAmount, 0);
  const finalTotal = payableSubtotal + shippingFee;
  const depositRequired =
    paymentMethod === "cash" && totalPrice >= 500000 ? totalPrice * 0.3 : 0;

  const handleQty = (id, qty) => {
    const next = updateQuantity(id, qty);
    setItems(next);
  };

  const handleSelectTable = (value, tableOverride) => {
    const table = tableOverride || tableMap.get(value);
    setCustomer((prev) => ({
      ...prev,
      tableId: table?._id || value || "",
      tableNumber: table?.number?.toString() || "",
    }));
  };

  const handleOrder = () => {
    // Validation
    if (!customer.name || !customer.phone) {
      showError("Vui lòng nhập đầy đủ thông tin khách hàng!");
      return;
    }

    if (orderType === "dine-in") {
      if (
        !customer.date ||
        !customer.time ||
        !customer.people ||
        !customer.tableId
      ) {
        showError("Vui lòng điền đầy đủ thông tin đặt bàn!");
        return;
      }
    } else {
      if (!customer.deliveryAddress) {
        showError("Vui lòng nhập địa chỉ nhận hàng!");
        return;
      }
    }

    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const payload = {
      bankCode: "",
      name: customer.name,
      phone: customer.phone,
      date: customer.date || today,
      time: customer.time || new Date().toTimeString().split(" ")[0].slice(0, 5),
      ship: {
        isShip: orderType === "takeaway",
        address: orderType === "takeaway" ? customer.deliveryAddress : "",
      },
      orderType,
      tableNumber:
        orderType === "dine-in" ? customer.tableNumber?.toString() : undefined,
      tableId: orderType === "dine-in" ? customer.tableId : undefined,
      deliveryAddress:
        orderType === "takeaway" ? customer.deliveryAddress : undefined,
      deliveryEmail:
        orderType === "takeaway" ? customer.email || undefined : undefined,
      people: orderType === "dine-in" ? customer.people : 1,
      note: customer.note,
      selectedDishes: items.map((dish) => ({
        dishId: dish._id,
        quantity: dish.quantity || 1,
      })),
      discount: applyTransferDiscount ? TRANSFER_DISCOUNT_PERCENT : 0,
      discountCode: applyTransferDiscount ? TRANSFER_DISCOUNT_CODE : undefined,
      payment: {
        paymentMethod,
      },
      totalAmount: finalTotal,
      language: "vn",
    };

    const isOnlinePayment = paymentMethod === "bank";
    const requestUrl = isOnlinePayment
      ? `${API_BASE_URL}/api/order/create_payment_url`
      : `${API_BASE_URL}/api/bookings`;

    fetch(requestUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
      .then(async (r) => {
        const contentType = r.headers.get("content-type") || "";
        if (!r.ok) {
          const text = await r.text();
          throw new Error(`Server error ${r.status}: ${text}`);
        }
        if (contentType.includes("application/json")) {
          return r.json();
        }
        return r.text();
      })
      .then((data) => {
        let bookingCreated = false;

        if (!isOnlinePayment) {
          showSuccess("Đặt món thành công! Chúng tôi sẽ xác nhận trong ít phút.");
          bookingCreated = true;
        } else if (
          data.data &&
          typeof data.data === "object" &&
          data.data.paymentUrl
        ) {
          const { paymentUrl, payment } = data.data;
          //! cách hiển thị 1: Chuyển hướng trang
          // nhờ be redirect về đúng trang sau thanh toán
          // fetch(`${API_BASE_URL}/api/order/returnUrl`, {
          //   method: "PUT",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     return: window.location.href, //`${API_BASE_URL}/api/order/order_status/${payment.orderId}`
          //   }),
          // })
          // window.location.href = paymentUrl;

          //! cách hiển thị 2: Mở VNPAY trong popup
          let paymentWindow = globalThis.open(paymentUrl, "_blank");

          // Kiểm tra nếu popup bị chặn
          if (!paymentWindow) {
            showError("Popup bị chặn! Vui lòng cho phép popup và thử lại.");
            return;
          }

          // Poll trạng thái đơn hàng mỗi 2s
          const interval = setInterval(async () => {
            // không cho tắt trừ khi hủy
            if (paymentWindow && paymentWindow.closed) {
              paymentWindow = globalThis.open(paymentUrl, "_blank");
            }

            // Kiểm tra nếu paymentWindow vẫn null
            if (!paymentWindow) {
              clearInterval(interval);
              return;
            }

            try {
              const res = await fetch(
                `${API_BASE_URL}/api/order/order_status/${payment.orderId}`
              ).then((r) => r.json());
              if (res.data?.payment?.paidAt !== null) {
                console.log("payment status:", res.data.payment);
                clearInterval(interval);
                if (paymentWindow && !paymentWindow.closed) {
                  paymentWindow.close();
                }
              }
            } catch (err) {
              console.error("Error checking payment status:", err);
            }
          }, 2000);

          //todo chuyển trang hiển thị kết quả đặt món, biên lai
          bookingCreated = true;
        } else {
          showError("Không lấy được URL thanh toán!");
        }

        if (bookingCreated) {
          clearCart();
          setItems([]);
          setCustomer(createInitialCustomer());
          setShowTableResetModal(false);
          setOrderType("dine-in");
          setPaymentMethod("bank");
        }
      })
      .catch((err) => {
        console.error(err);
        showError(
          "Lỗi khi tạo thanh toán: " + (err?.message || "Vui lòng thử lại sau")
        );
      });
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
                <h4 className="mt-6 font-PlayfairD text-2xl text-slate-800">
                  Giỏ hàng đang trống
                </h4>
                <p className="mt-2 font-DM_sans text-slate-600">
                  Khám phá thực đơn và thêm những món bạn yêu thích.
                </p>
                <Link to="/menu" className="mt-6">
                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    Xem thực đơn
                  </button>
                </Link>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  {["🍣", "🍜", "🥗", "🍰"].map((e, idx) => (
                    <div
                      key={idx}
                      className="py-3 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl hover:shadow-md transition"
                    >
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
                      <h4 className="font-DM_sans font-bold text-lg">{i.name}</h4>
                      {i.discountPercent > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 line-through text-sm">
                            {Number(i.price).toLocaleString("vi-VN")} đ
                          </span>
                          <span className="text-red-600 font-DM_sans font-bold">
                            {(
                              Number(i.price) *
                              (1 - (Number(i.discountPercent) || 0) / 100)
                            ).toLocaleString("vi-VN")}{" "}
                            đ
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                            -{i.discountPercent}%
                          </span>
                        </div>
                      ) : (
                        <p className="text-blue-600 font-DM_sans font-bold">
                          {Number(i.price).toLocaleString("vi-VN")} đ
                        </p>
                      )}

                      {/* Mobile controls under name/price */}
                      <div className="mt-2 flex items-center gap-2 sm:hidden">
                        <button
                          aria-label="Giảm số lượng"
                          className="w-10 h-10 rounded-lg border bg-white hover:bg-blue-50 text-slate-700 text-xl leading-none flex items-center justify-center"
                          onClick={() =>
                            handleQty(i._id, Math.max(0, Number(i.quantity) - 1))
                          }
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
                        onClick={() =>
                          handleQty(i._id, Math.max(0, Number(i.quantity) - 1))
                        }
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
                {/* Thông tin khách hàng cơ bản */}
                <input
                  placeholder="Họ tên *"
                  className="w-full h-12 border-2 rounded-lg px-3"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <input
                  placeholder="Số điện thoại *"
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

                {/* Chọn hình thức đặt món */}
                <div className="p-4 border rounded-xl bg-slate-50">
                  <p className="font-DM_sans font-semibold mb-3">
                    🍽️ Hình thức đặt món
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderType("dine-in")}
                      className={`w-full h-14 px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center justify-center ${
                        orderType === "dine-in"
                          ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-600 shadow-lg"
                          : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      🏠 Ăn tại quán
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType("takeaway")}
                      className={`w-full h-14 px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center justify-center ${
                        orderType === "takeaway"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-600 shadow-lg"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      📦 Mang đi
                    </button>
                  </div>
                </div>

                {/* Thông tin cho "Ăn tại quán" */}
                {orderType === "dine-in" && (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-xl bg-white space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-DM_sans font-semibold text-lg text-slate-800">
                            🪑 Danh sách bàn trống
                          </p>
                          <p className="text-sm text-slate-500">
                            Ngày {new Date(effectiveDate).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-emerald-600">
                          {availableTables.length} bàn phù hợp
                        </span>
                      </div>
                      {!customer.people ? (
                        <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                          Vui lòng nhập số người
                        </div>
                      ) : availableTables.length === 0 ? (
                        <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                          Không có bàn trống cho {customer.people} người vào ngày này.
                        </div>
                      ) : (
                        <>
                          <TableSelectionGrid
                            tables={availableTables}
                            selectedValue={customer.tableId}
                            onSelect={(value, table) => handleSelectTable(value, table)}
                            getValue={(table) => table._id}
                            getLabel={getTableLabel}
                            getSubLabel={(table) =>
                              `${table.capacity || 0} người${
                                table.location ? ` • ${table.location}` : ""
                              }`
                            }
                            gridClassName="grid grid-cols-2 gap-3"
                          />
                          <p className="text-xs text-emerald-600">
                            {customer.tableNumber
                              ? `Đã chọn bàn ${customer.tableNumber}`
                              : `Có ${availableTables.length} bàn trống phù hợp`}
                          </p>
                        </>
                      )}
                      {showTableResetModal && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 flex flex-col gap-1">
                          <p>
                            Bàn bạn chọn trước đó không còn phù hợp với số người/khung giờ
                            mới. Vui lòng chọn lại bàn khác.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowTableResetModal(false)}
                            className="self-end rounded-full bg-amber-500 text-white px-3 py-1 font-semibold"
                          >
                            Đã hiểu
                          </button>
                        </div>
                      )}
                    </div>

                  <div className="p-4 border rounded-xl bg-gradient-to-br from-emerald-50 to-green-50">
                    <p className="font-DM_sans font-semibold mb-3">
                        📅 Thông tin đặt bàn
                    </p>
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Ngày *
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              className="w-full h-10 border-2 rounded-lg px-3 text-sm cursor-pointer"
                              value={customer.date}
                              onChange={(e) =>
                                setCustomer((p) => ({ ...p, date: e.target.value }))
                              }
                                min={today}
                              onClick={(e) => e.target.showPicker?.()}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Giờ *
                          </label>
                          <div className="relative">
                            <input
                              type="time"
                              className="w-full h-10 border-2 rounded-lg px-3 text-sm cursor-pointer"
                              value={customer.time}
                              onChange={(e) =>
                                setCustomer((p) => ({ ...p, time: e.target.value }))
                              }
                              onClick={(e) => e.target.showPicker?.()}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Số người *
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="Số người"
                          className="w-full h-10 border-2 rounded-lg px-3"
                          value={customer.people}
                          onChange={(e) =>
                            setCustomer((p) => ({
                              ...p,
                              people: Number(e.target.value) || 1,
                            }))
                          }
                        />
                      </div>
                            </div>
                    </div>
                  </div>
                )}

                {/* Thông tin cho "Mang đi" */}
                {orderType === "takeaway" && (
                  <div className="p-4 border rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                    <p className="font-DM_sans font-semibold mb-3">
                      📦 Thông tin nhận hàng
                    </p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Ngày giao *
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              className="w-full h-10 border-2 rounded-lg px-3 text-sm cursor-pointer"
                              value={customer.date}
                              onChange={(e) =>
                                setCustomer((p) => ({ ...p, date: e.target.value }))
                              }
                              min={today}
                              onClick={(e) => e.target.showPicker?.()}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Giờ giao *
                          </label>
                          <div className="relative">
                            <input
                              type="time"
                              className="w-full h-10 border-2 rounded-lg px-3 text-sm cursor-pointer"
                              value={customer.time}
                              onChange={(e) =>
                                setCustomer((p) => ({ ...p, time: e.target.value }))
                              }
                              onClick={(e) => e.target.showPicker?.()}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Địa chỉ nhận hàng *
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập địa chỉ nhận hàng"
                          className="w-full h-10 border-2 rounded-lg px-3"
                          value={customer.deliveryAddress}
                          onChange={(e) =>
                            setCustomer((p) => ({
                              ...p,
                              deliveryAddress: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-600">
                      Đơn trên 300.000đ được freeship. Đơn dưới mức này sẽ cộng thêm
                      30.000đ phí giao hàng.
                    </p>
                  </div>
                )}

                {/* Ghi chú */}
                <textarea
                  placeholder="Ghi chú"
                  className="w-full h-24 border-2 rounded-lg px-3 py-2"
                  value={customer.note}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, note: e.target.value }))
                  }
                />

                {/* Phương thức thanh toán */}
                <div className="p-4 border rounded-xl bg-white shadow-sm">
                  <p className="font-DM_sans font-semibold mb-3">
                    Phương thức thanh toán
                  </p>
                  <div className="flex flex-col gap-3">
                    <label
                      className={`flex items-start gap-3 border rounded-xl p-3 cursor-pointer transition ${
                        paymentMethod === "bank"
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                      />
                      <div>
                        <p className="font-semibold">Chuyển khoản ngay</p>
                        <p className="text-sm text-slate-600">
                          Giảm 5% trên tổng giá trị đơn hàng khi thanh toán trước.
                        </p>
                        <p className="text-xs text-blue-500 mt-1">
                          Áp dụng mã {TRANSFER_DISCOUNT_CODE}.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 border rounded-xl p-3 cursor-pointer transition ${
                        paymentMethod === "cash"
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                      />
                      <div>
                        <p className="font-semibold">Tiền mặt khi nhận</p>
                        <p className="text-sm text-slate-600">
                          Không áp dụng giảm giá.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Tổng thanh toán */}
                <div className="p-5 border rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="flex justify-between text-sm text-slate-200">
                    <span>Tạm tính</span>
                    <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-300">
                      <span>
                        Giảm {TRANSFER_DISCOUNT_PERCENT}% (mã {TRANSFER_DISCOUNT_CODE})
                      </span>
                      <span>-{discountAmount.toLocaleString("vi-VN")} đ</span>
                    </div>
                  )}
                  {shippingEligible && (
                    <div className="flex justify-between text-sm">
                      <span>Phí giao hàng</span>
                      <span>
                        {shippingFee === 0
                          ? "Miễn phí"
                          : `+${shippingFee.toLocaleString("vi-VN")} đ`}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-white/30 pt-2 flex justify-between text-base font-semibold">
                    <span>Tổng thanh toán</span>
                    <span>{finalTotal.toLocaleString("vi-VN")} đ</span>
                  </div>
                  {depositRequired > 0 && (
                    <div className="text-xs text-amber-200">
                      Cần đặt cọc trước:{" "}
                      {depositRequired.toLocaleString("vi-VN")} đ (30% tổng đơn)
                    </div>
                  )}
                </div>

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
          <h3 className="font-PlayfairD font-medium text-2xl">Gợi ý món ăn</h3>
          <div className="mt-6 relative">
            {/* Prev button */}
            {related.length > 1 && (
              <button
                aria-label="Trượt trái"
                onClick={handlePrev}
                className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border shadow hover:bg-blue-50 items-center justify-center"
              >
                ‹
              </button>
            )}

            {/* Slider */}
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 px-1 hide-scrollbar"
            >
              {related.map((m) => (
                <div
                  key={m._id}
                  className="related-card snap-start min-w-[240px] sm:min-w-[260px] lg:min-w-[280px] border-2 border-slate-200 rounded-xl overflow-hidden bg-white hover:border-blue-300 hover:shadow-xl transition"
                >
                  <div className="w-full h-[160px] overflow-hidden">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h5 className="font-DM_sans font-bold text-base">{m.name}</h5>
                    <p className="text-blue-600 font-bold mt-1">
                      {Number(m.price).toLocaleString("vi-VN")} đ
                    </p>
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

            {/* Next button */}
            {related.length > 1 && (
              <button
                aria-label="Trượt phải"
                onClick={handleNext}
                className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border shadow hover:bg-blue-50 items-center justify-center"
              >
                ›
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
