// ==================== All Import
import { useEffect, useMemo, useState } from "react";

const Book = () => {
  // ==================== All Hooks
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [time, setTime] = useState("");
  const [timeError, setTimeError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [person, setPerson] = useState(1);
  const [personError, setPersonError] = useState("");
  const [loading, setLoading] = useState(false); // Thêm state loading
  const [menuOptions, setMenuOptions] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
  // ==================== All Functions
  const handleDate = (e) => {
    setDate(e.target.value);
    setDateError("");
  };
  const handleTime = (e) => {
    setTime(e.target.value);
    setTimeError("");
  };
  const handleName = (e) => {
    setName(e.target.value);
    setNameError("");
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
    setPhoneError("");
  };
  const handlePerson = (e) => {
    const value = Number(e.target.value);
    setPerson(value);
    setPersonError("");
  };

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

  const personCount = Number(person) || 0;
  const depositAmount =
    personCount === 0 ? 0 : personCount > 6 ? 1000000 : 500000;
  const selectedDishTotal = useMemo(
    () =>
      selectedDishes.reduce(
        (sum, dish) => sum + dish.price * (dish.quantity || 1),
        0
      ),
    [selectedDishes]
  );

  // ==================== Submit Function Condition
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (date === "") {
      setDateError("Please Select A Date");
      hasError = true;
    }
    if (time === "") {
      setTimeError("Please Select A Time");
      hasError = true;
    }
    if (name === "") {
      setNameError("Please Enter Your Name");
      hasError = true;
    }
    if (phone === "") {
      setPhoneError("Must Include Phone Number");
      hasError = true;
    }
    if (!person || Number(person) < 1) {
      setPersonError("Vui lòng nhập số lượng khách hợp lệ");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true); // Bắt đầu gửi yêu cầu

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          time,
          name,
          phone,
          person,
          selectedDishes: selectedDishes.map((dish) => ({
            dishId: dish.dishId,
            quantity: dish.quantity,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Booking successful:", data);
        alert("Đặt bàn thành công!");

        // Reset form sau khi thành công
        setDate("");
        setTime("");
        setName("");
        setPhone("");
        setPerson(1);
        setSelectedDishes([]);
      } else {
        const errorData = await response.json();
        console.error("Booking failed:", errorData);
        alert("Đặt bàn thất bại!");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu!");
    } finally {
      setLoading(false); // Kết thúc quá trình gửi yêu cầu
    }
  };

  return (
    <div className="bg-white max-w-7xl mx-auto shadow-sm">
      {/* ================= Booking part ================= */}
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
            <div className="flex flex-col md:flex-row gap-2">
              {/* for date */}
              <div className="relative w-full md:w-[48%]">
                <p className="ml-4 font-DM_sans font-bold text-base">Ngày</p>
                <input
                  onChange={handleDate}
                  type="date"
                  className="w-full h-[60px] rounded-full border-2 px-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {dateError}
                </p>
              </div>

              {/* for time */}
              <div className="relative w-full md:w-[48%]">
                <p className="ml-4 font-DM_sans font-bold text-base">
                  Thời gian
                </p>
                <input
                  onChange={handleTime}
                  type="time"
                  className="w-full h-[60px] rounded-full border-2 px-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {timeError}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              {/* for name */}
              <div className="relative w-full md:w-[48%]">
                <p className="ml-4 font-DM_sans font-bold text-base">Tên</p>
                <input
                  onChange={handleName}
                  type="text"
                  className="w-full h-[60px] rounded-full border-2 px-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {nameError}
                </p>
              </div>

              {/* for phone */}
              <div className="relative w-full md:w-[48%]">
                <p className="ml-4 font-DM_sans font-bold text-base">
                  Số điện thoại
                </p>
                <input
                  onChange={handlePhone}
                  type="number"
                  className="w-full h-[60px] rounded-full border-2 px-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {phoneError}
                </p>
              </div>
            </div>

            {/* for persons */}
            <div className="relative">
              <p className="ml-4 font-DM_sans font-bold text-base">
                Số lượng người
              </p>
              <input
                onChange={handlePerson}
                value={person}
                type="number"
                className="w-full h-[60px] rounded-full border-2 pl-4 mt-2 outline-none"
                min={1}
              />
              <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                {personError}
              </p>
            </div>

            <div className="p-6 border rounded-2xl bg-slate-50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="font-DM_sans font-bold text-base">
                  Chọn món phục vụ trước (tuỳ chọn)
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
                      className={`border rounded-2xl p-3 bg-white shadow-sm ${
                        selected ? "border-blue-500" : "border-slate-200"
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
                          <p className="text-sm text-blue-600 font-bold">
                            {Number(dish.price).toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                      </label>
                      {selected && (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            className="w-9 h-9 rounded-full border text-lg"
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
                            className="w-9 h-9 rounded-full border text-lg"
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
              {selectedDishes.length > 0 && (
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>Tổng giá trị món đã chọn</span>
                  <span>{selectedDishTotal.toLocaleString("vi-VN")} đ</span>
                </div>
              )}
            </div>

            <div className="p-5 border-dashed border-2 rounded-2xl text-center space-y-2">
              <p className="font-DM_sans font-bold text-base">
                Tiền cọc cần thanh toán
              </p>
              <p className="text-3xl font-PlayfairD text-blue-600">
                {depositAmount > 0
                  ? depositAmount.toLocaleString("vi-VN") + " đ"
                  : "--"}
              </p>
              <p className="text-sm text-slate-500">
                Bàn đến 6 người cọc 500.000đ, từ 7 người trở lên cọc 1.000.000đ.
              </p>
            </div>

            {/* for send button */}
            <div>
              <button
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-DM_sans font-bold text-base hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Book;
