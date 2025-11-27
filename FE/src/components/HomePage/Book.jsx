// ==================== All Import
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";
import TableSelectionGrid from "@/components/common/TableSelectionGrid";

const Book = () => {
  const { showSuccess, showError } = useNotification();
  // ==================== All Hooks
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [date, setDate] = useState(() => today);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [person, setPerson] = useState(1);
  const [tableNumber, setTableNumber] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOptions, setMenuOptions] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("bank"); // "bank" hoặc "cash" (chỉ khi có món)
  const [bookings, setBookings] = useState([]); // Danh sách booking để check bàn đã đặt
  const [tables, setTables] = useState([]);
  const [showTableResetModal, setShowTableResetModal] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const normalizeBooking = (booking) => ({
    ...booking,
    orderType: booking.orderType || (booking.ship?.isShip ? "takeaway" : "dine-in"),
  });

  const isTableBusy = useCallback(
    (table, dateValue, timeValue) => {
      if (!table) return true;
      const effectiveDateKey = (dateValue || today).split("T")[0];
      return bookings.some((booking) => {
        const bookingOrderType =
          booking.orderType || (booking.ship?.isShip ? "takeaway" : "dine-in");
        if (bookingOrderType !== "dine-in") return false;
        const bookingDate = (booking.date || "").split("T")[0];
        if (bookingDate !== effectiveDateKey) return false;
        // Check by tableNumber
        if (booking.tableNumber && table.number) {
          if (booking.tableNumber.toString() !== table.number.toString()) {
            return false;
          }
      } else {
          return false;
        }
        // Bàn bận nếu: chưa thanh toán (giữ bàn cả ngày) hoặc cùng khung giờ
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

  // ==================== Lọc bàn còn trống dựa trên ngày, giờ và số người
  const effectiveDate = date || today;

  const availableTables = useMemo(() => {
    if (!person) {
      return [];
    }
    return tables
      .filter((table) => table && table.isActive)
      .filter((table) => Number(table.capacity || 0) >= Number(person || 0))
      .filter((table) => !isTableBusy(table, effectiveDate, time))
      .sort((a, b) => {
        const numA = Number(a.number) || 0;
        const numB = Number(b.number) || 0;
        return numA - numB;
      });
  }, [tables, effectiveDate, time, person, isTableBusy]);

  useEffect(() => {
    if (!tableNumber) return;
    const stillValid = availableTables.some(
      (table) => table.number?.toString() === tableNumber
    );
    if (!stillValid) {
      setTableNumber("");
      setShowTableResetModal(true);
    }
  }, [availableTables, tableNumber]);

  useEffect(() => {
    if (showTableResetModal && availableTables.length > 0) {
      setShowTableResetModal(false);
    }
  }, [availableTables.length, showTableResetModal]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/menus`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMenuOptions(data);
        }
      })
      .catch(() => {});
  }, [API_BASE_URL]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tables`)
      .then((response) => response.json())
      .then((json) => {
        setTables(Array.isArray(json) ? json : []);
      })
      .catch((err) => console.error("Lỗi fetch tables:", err));
  }, [API_BASE_URL]);

  // ==================== All Functions
  const handleToggleDish = (dish) => {
    setSelectedDishes((prev) => {
      const exists = prev.find((item) => item.dishId === dish._id);
      if (exists) {
        return prev.filter((item) => item.dishId !== dish._id);
      }
      return [
        ...prev,
        {
          dishId: dish._id,
          name: dish.name,
          price: Number(dish.price) || 0,
          discountPercent: Number(dish.discountPercent) || 0,
          quantity: 1,
        },
      ];
    });
  };

  const handleDishQuantity = (dishId, nextQty) => {
    const quantity = Math.max(1, Number(nextQty) || 1);
    setSelectedDishes((prev) =>
      prev.map((item) =>
        item.dishId === dishId ? { ...item, quantity } : item
      )
    );
  };

  // Tính tổng tiền món đã chọn (áp dụng giảm giá của từng món)
  const selectedDishTotal = useMemo(
    () =>
      selectedDishes.reduce((sum, dish) => {
        const basePrice = Number(dish.price) || 0;
        const discountPercent = Number(dish.discountPercent) || 0;
        const discountedPrice = basePrice * (1 - discountPercent / 100);
        return sum + discountedPrice * (dish.quantity || 1);
      }, 0),
    [selectedDishes]
  );

  const TRANSFER_DISCOUNT_CODE = "CHUYENKHOAN";
  const TRANSFER_DISCOUNT_PERCENT = 5;
  const applyTransferDiscount =
    selectedDishes.length > 0 && paymentMethod === "bank";
  // Tính giảm giá (5% khi chuyển khoản, chỉ khi có món)
  const discountRate = applyTransferDiscount
    ? TRANSFER_DISCOUNT_PERCENT / 100
    : 0;
  const discountAmount = useMemo(
    () => selectedDishTotal * discountRate,
    [selectedDishTotal, discountRate]
  );

  // Tổng thanh toán (chỉ tính món, không tính cọc)
  const finalTotal = selectedDishTotal - discountAmount;

  // Tiền cọc: Bàn đến 6 người cọc 200.000đ, từ 7 người trở lên cọc 500.000đ
  const depositRequired = useMemo(() => {
    const peopleCount = Number(person) || 0;
    if (peopleCount <= 6) {
      return 200000;
    }
    return 500000;
  }, [person]);

  // ==================== Submit Function
  const resetForm = useCallback(() => {
    setDate(today);
    setTime("");
    setName("");
    setPhone("");
    setEmail("");
    setPerson(1);
    setTableNumber("");
    setNote("");
    setSelectedDishes([]);
    setPaymentMethod("bank");
    setShowTableResetModal(false);
  }, [today]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!date) {
      showError("Vui lòng chọn ngày!");
      return;
    }
    if (!time) {
      showError("Vui lòng chọn giờ!");
      return;
    }
    if (!name) {
      showError("Vui lòng nhập họ tên!");
      return;
    }
    if (!phone) {
      showError("Vui lòng nhập số điện thoại!");
      return;
    }
    if (!person || Number(person) < 1) {
      showError("Vui lòng nhập số lượng khách hợp lệ!");
      return;
    }
    if (!tableNumber) {
      showError("Vui lòng chọn bàn!");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const hasDishes = selectedDishes.length > 0;
    const shouldUseOnlinePayment = !hasDishes || paymentMethod === "bank";
    const resolvedTotal = hasDishes ? finalTotal : depositRequired;
    const resolvedPaymentMethod = hasDishes ? paymentMethod : "bank";

    const payload = {
      bankCode: "",
      date,
      time,
      name,
      phone,
      email,
      people: person,
      tableNumber,
      note,
      orderType: "dine-in",
      ship: { isShip: false, address: "" },
      selectedDishes: selectedDishes.map((dish) => ({
        dishId: dish.dishId,
        quantity: dish.quantity,
      })),
      discount: applyTransferDiscount ? TRANSFER_DISCOUNT_PERCENT : 0,
      discountCode: applyTransferDiscount ? TRANSFER_DISCOUNT_CODE : undefined,
      payment: {
        paymentMethod: resolvedPaymentMethod,
      },
      totalAmount: resolvedTotal,
      language: "vn",
    };

    const requestUrl = shouldUseOnlinePayment
      ? `${API_BASE_URL}/api/order/create_payment_url`
      : `${API_BASE_URL}/api/bookings`;

    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      const responseData = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message =
          typeof responseData === "object"
            ? responseData.message || "Đặt bàn thất bại!"
            : "Đặt bàn thất bại!";
        throw new Error(message);
      }

      if (!shouldUseOnlinePayment) {
        showSuccess("Đặt bàn thành công! Chúng tôi sẽ liên hệ xác nhận sớm.");
        resetForm();
        return;
      }

      if (
        responseData?.data &&
        typeof responseData.data === "object" &&
        responseData.data.paymentUrl
      ) {
        const { paymentUrl, payment } = responseData.data;
        resetForm();
        let paymentWindow = globalThis.open(paymentUrl, "_blank");

        if (!paymentWindow) {
          showError("Popup bị chặn! Vui lòng cho phép popup và thử lại.");
          return;
        }

        const interval = setInterval(async () => {
          if (paymentWindow && paymentWindow.closed) {
            paymentWindow = globalThis.open(paymentUrl, "_blank");
          }
          if (!paymentWindow) {
            clearInterval(interval);
            return;
          }

          try {
            const statusRes = await fetch(
              `${API_BASE_URL}/api/order/order_status/${payment.orderId}`
            ).then((r) => r.json());
            if (statusRes.data?.payment?.paidAt !== null) {
              clearInterval(interval);
              if (paymentWindow && !paymentWindow.closed) {
                paymentWindow.close();
              }
              showSuccess("Thanh toán thành công! Hẹn gặp bạn tại nhà hàng.");
            }
          } catch (err) {
            console.error("Error checking payment status:", err);
          }
        }, 2000);
      } else {
        showError("Không lấy được URL thanh toán! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      showError(error.message || "Có lỗi xảy ra khi gửi yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-w-7xl mx-auto shadow-sm">
      <section className="pb-16">
        {/* ============== Info Part ============== */}
        <header className="px-6 sm:px-8 lg:px-12 text-center mt-4">
          <h1 className="font-PlayfairD text-4xl sm:text-6xl lg:text-[100px] font-normal leading-[1.2]">
            Đặt bàn
          </h1>
          <p className="font-DM_sans text-lg leading-[28px] font-normal mt-6">
            Hãy cho chúng tôi biết bạn cần gì <br /> chúng tôi sẽ phục vụ bạn.
          </p>
        </header>

        {/* ============== Form Part ============== */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[800px] mx-auto px-6 sm:px-8 lg:px-12 p-10 mt-12 shadow-2xl rounded-2xl"
        >
          <div className="flex gap-6 flex-col">
            {/* Danh sách bàn giống staff */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-DM_sans font-bold text-xl text-slate-800">
                    🪑 Danh sách bàn trống
                  </h3>
                  <p className="text-sm text-slate-500">
                    Ngày {new Date(effectiveDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <span className="text-sm font-semibold text-emerald-600">
                  {availableTables.length} bàn phù hợp
                </span>
              </div>
              {!person ? (
                <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Vui lòng nhập số người
                </div>
              ) : availableTables.length === 0 ? (
                <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Không có bàn trống cho {person} người vào ngày này.
                </div>
              ) : (
                <>
                  <TableSelectionGrid
                    tables={availableTables}
                    selectedValue={tableNumber}
                    onSelect={(value) => setTableNumber(value || "")}
                    getValue={(table) => table.number?.toString()}
                    getLabel={(table) => table.name || `Bàn ${table.number}`}
                    getSubLabel={(table) =>
                      `${table.capacity || 0} người${
                        table.location ? ` • ${table.location}` : ""
                      }`
                    }
                  />
                  <p className="text-xs text-emerald-600">
                    {tableNumber
                      ? `Đã chọn bàn ${tableNumber}`
                      : "Chọn một bàn để tiếp tục"}
                  </p>
                </>
              )}
                {showTableResetModal && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 flex flex-col gap-2 mt-3">
                    <p>
                      Bàn bạn chọn trước đó không còn phù hợp với số người hiện tại. Vui
                      lòng chọn lại bàn khác.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowTableResetModal(false)}
                      className="self-end rounded-full px-4 py-1 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600"
                    >
                      Đã hiểu
                    </button>
                  </div>
                )}
            </div>

            {/* Bộ lọc ngày/giờ/khách */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6 space-y-4">
              <h3 className="font-DM_sans font-bold text-xl text-slate-800">
                📅 Thông tin đặt bàn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ngày <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    className="w-full h-12 rounded-xl border-2 border-slate-200 px-4 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
                    onClick={(e) => e.target.showPicker?.()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Giờ
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-12 rounded-xl border-2 border-slate-200 px-4 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
                    onClick={(e) => e.target.showPicker?.()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Số người <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={person}
                    onChange={(e) => setPerson(Number(e.target.value) || 1)}
                    className="w-full h-12 rounded-xl border-2 border-slate-200 px-4 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="Số người"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin khách hàng */}
            <div className="space-y-4">
              <h3 className="font-DM_sans font-bold text-xl text-slate-800">
                👤 Thông tin khách hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 rounded-xl border-2 border-slate-200 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 rounded-xl border-2 border-slate-200 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email (tùy chọn)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 rounded-xl border-2 border-slate-200 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Nhập email"
                  />
                </div>
              </div>
            </div>

            {/* Chọn món phục vụ trước */}
            <div className="p-6 border rounded-2xl bg-slate-50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="font-DM_sans font-bold text-base">
                  🍽️ Bạn có muốn chọn món trước không?
                </p>
                <span className="text-sm text-slate-500">
                  Bạn có thể bỏ qua bước này
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {menuOptions.map((dish) => {
                  const selected = selectedDishes.find(
                    (item) => item.dishId === dish._id
                  );
                  return (
                    <div
                      key={dish._id}
                      className={`border rounded-2xl p-3 bg-white shadow-sm transition ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border bg-slate-100">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(selected)}
                          onChange={() => handleToggleDish(dish)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">
                            {dish.name}
                          </p>
                          {dish.discountPercent > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 line-through">
                                {Number(dish.price).toLocaleString("vi-VN")} đ
                              </span>
                              <span className="text-sm text-red-600 font-bold">
                                {(
                                  Number(dish.price) *
                                  (1 - (Number(dish.discountPercent) || 0) / 100)
                                ).toLocaleString("vi-VN")}{" "}
                                đ
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                                -{dish.discountPercent}%
                              </span>
                            </div>
                          ) : (
                            <p className="text-sm text-blue-600 font-bold">
                              {Number(dish.price).toLocaleString("vi-VN")} đ
                            </p>
                          )}
                        </div>
                      </label>
                      {selected && (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            className="w-9 h-9 rounded-full border text-lg hover:bg-blue-50"
                            onClick={() =>
                              handleDishQuantity(
                                dish._id,
                                (selected.quantity || 1) - 1
                              )
                            }
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={selected.quantity}
                            onChange={(e) =>
                              handleDishQuantity(dish._id, e.target.value)
                            }
                            className="w-16 h-9 border rounded-lg text-center"
                          />
                          <button
                            type="button"
                            className="w-9 h-9 rounded-full border text-lg hover:bg-blue-50"
                            onClick={() =>
                              handleDishQuantity(
                                dish._id,
                                (selected.quantity || 1) + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                📝 Ghi chú
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="3"
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ghi chú thêm (nếu có)..."
              />
            </div>

            {/* Khi không có món: hiển thị Tiền cọc cần thanh toán và Tạm tính */}
            {selectedDishes.length === 0 && (
              <>
                {/* Tiền cọc cần thanh toán */}
                <div className="p-5 border-dashed border-2 border-blue-300 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-center space-y-2">
                  <p className="font-DM_sans font-bold text-base text-slate-800">
                    Tiền cọc cần thanh toán
                  </p>
                  <p className="text-3xl font-PlayfairD text-blue-600">
                    {depositRequired > 0
                      ? depositRequired.toLocaleString("vi-VN") + " đ"
                      : "--"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Bàn đến 6 người cọc 200.000đ, từ 7 người trở lên cọc 500.000đ.
                  </p>
                </div>

                {/* Tạm tính */}
                <div className="p-5 border rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="flex justify-between text-sm text-slate-200">
                    <span>Tạm tính</span>
                    <span>{depositRequired.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="border-t border-white/30 pt-2 flex justify-between text-base font-semibold">
                    <span>Tổng thanh toán</span>
                    <span>{depositRequired.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>
              </>
            )}

            {/* Nếu có món: hiển thị phương thức thanh toán và tổng tiền */}
            {selectedDishes.length > 0 && (
              <>
                {/* Phương thức thanh toán (chỉ khi có món) */}
                <div className="p-4 border rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
                  <p className="font-DM_sans font-semibold mb-3">
                    💳 Phương thức thanh toán
                  </p>
                  <div className="flex flex-col gap-3">
                    <label
                      className={`flex items-start gap-3 border rounded-xl p-3 cursor-pointer transition ${
                        paymentMethod === "bank"
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-blue-300"
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
                          : "border-slate-200 bg-white hover:border-blue-300"
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

                {/* Tổng tiền (không tính cọc) */}
                <div className="p-5 border rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="flex justify-between text-sm text-slate-200">
                    <span>Tạm tính</span>
                    <span>{selectedDishTotal.toLocaleString("vi-VN")} đ</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-300">
                      <span>
                        Giảm {TRANSFER_DISCOUNT_PERCENT}% (mã {TRANSFER_DISCOUNT_CODE})
                      </span>
                      <span>-{discountAmount.toLocaleString("vi-VN")} đ</span>
                    </div>
                  )}
                  <div className="border-t border-white/30 pt-2 flex justify-between text-base font-semibold">
                    <span>Tổng tiền</span>
                    <span>{finalTotal.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>
              </>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-DM_sans font-bold text-base hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Xác nhận đặt bàn"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Book;
