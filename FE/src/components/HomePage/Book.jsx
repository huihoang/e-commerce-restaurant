// ==================== All Import
import React, { useState } from "react";

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
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
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
    setPerson(e.target.value);
    setPersonError("");
  };

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
    if (person > 6) {
      setPersonError("Sorry! No Booking for More Than 6 People");
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
        body: JSON.stringify({ date, time, name, phone, person }),
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
    <>
      {/* ================= Booking part ================= */}
      <section>
        {/* ============== Info Part ============== */}
        <header className="container text-center mt-4">
          <h1 className="font-PlayfairD text-[100px] font-normal leading-[96px]">
            Đặt bàn
          </h1>
          <p className="font-DM_sans text-lg leading-[28px] font-normal mt-6">
            Hãy cho chúng tôi biết bạn cần gì <br /> chúng tôi sẽ phục vụ bạn.
          </p>
        </header>

        {/* ============== Form Part ============== */}
        <form
          onSubmit={handleSubmit}
          className="w-[800px] container p-10 mt-[72px] shadow-2xl rounded-2xl"
        >
          <ul className="flex gap-6 flex-col">
            <ul className="flex gap-2">
              {/* for date */}
              <li className="relative">
                <p className="ml-4 font-DM_sans font-bold text-base">Ngày</p>
                <input
                  onChange={handleDate}
                  type="date"
                  className="w-[350px] h-[60px] rounded-full border-2 px-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {dateError}
                </p>
              </li>

              {/* for time */}
              <li className="relative">
                <p className="ml-4 font-DM_sans font-bold text-base">
                  Thời gian
                </p>
                <input
                  onChange={handleTime}
                  type="time"
                  className="w-[350px] h-[60px] rounded-full border-2 px-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {timeError}
                </p>
              </li>
            </ul>

            <ul className="flex gap-2">
              {/* for name */}
              <li className="relative">
                <p className="ml-4 font-DM_sans font-bold text-base">Tên</p>
                <input
                  onChange={handleName}
                  type="text"
                  className="w-[350px] h-[60px] rounded-full border-2 px-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {nameError}
                </p>
              </li>

              {/* for phone */}
              <li className="relative">
                <p className="ml-4 font-DM_sans font-bold text-base">
                  Số điện thoại
                </p>
                <input
                  onChange={handlePhone}
                  type="number"
                  className="w-[350px] h-[60px] rounded-full border-2 px-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {phoneError}
                </p>
              </li>
            </ul>

            {/* for persons */}
            <ul className="relative">
              <p className="ml-4 font-DM_sans font-bold text-base">
                Số lượng người
              </p>
              <input
                onChange={handlePerson}
                type="Number"
                className="w-full h-[60px] rounded-full border-2 pl-4 mt-2 outline-none"
                min={1}
              />
              <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                {personError}
              </p>
            </ul>

            {/* for send button */}
            <ul>
              <button
                className="w-full py-5 bg-[#AD343E] text-white rounded-full font-DM_sans font-bold text-base hover:bg-red-500 active:scale-95 duration-200"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi"}
              </button>
            </ul>
          </ul>
        </form>
      </section>
    </>
  );
};

export default Book;