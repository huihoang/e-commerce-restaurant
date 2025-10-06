import { useState } from "react";

const Contact = () => {
  // ==================== All Hooks
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [subject, setSubject] = useState("");
  const [massage, setMassage] = useState("");
  const [massageError, setMassageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ==================== All Functions
  // -------- function for name
  const handleName = (e) => {
    setName(e.target.value);
    setNameError("");
  };

  // -------- function for email
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  // -------- function for subject
  const handleSubject = (e) => {
    setSubject(e.target.value);
  };

  // -------- function for message
  const handleMassage = (e) => {
    setMassage(e.target.value);
    setMassageError("");
  };

  // ==================== Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success messages
    setNameError("");
    setEmailError("");
    setMassageError("");
    setSuccessMessage("");
    setErrorMessage("");

    let isValid = true;

    // Check for validation
    if (name === "") {
      setNameError("Please Enter Your Name");
      isValid = false;
    }
    if (email === "") {
      setEmailError("Please Enter Your Email");
      isValid = false;
    }
    if (massage === "") {
      setMassageError("Please Write A Message Below");
      isValid = false;
    }

    if (!isValid) return;

    // Send form data to backend
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message: massage }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Nội dung liên hệ của bạn đã được gửi thành công");
        // Clear the form
        setName("");
        setEmail("");
        setSubject("");
        setMassage("");
      } else {
        setErrorMessage(
          data.message || "Bạn vui lòng điền đầy đủ thông tin chính xác"
        );
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      {/* ============== Contact Part Start ============== */}
      <section>
        <header className="container text-center mt-4">
          <h1 className="font-PlayfairD text-[100px] font-normal leading-[96px]">
            Liên hệ
          </h1>
          <p className="font-DM_sans text-lg leading-[28px] font-normal mt-6">
            Nếu bạn cần thông tin gì <br /> hãy liên hệ với chúng tôi.
          </p>
        </header>

        {/* ============== Form Part ============== */}
        <form
          onSubmit={handleSubmit}
          className="w-[800px] container p-10 mt-[72px] shadow-2xl rounded-2xl"
        >
          <ul className="flex gap-6 flex-col">
            <ul className="flex gap-2">
              {/* for name */}
              <li className="relative">
                <p className="ml-4 font-DM_sans font-bold text-base">Tên</p>
                <input
                  onChange={handleName}
                  value={name}
                  type="text"
                  placeholder="Điền tên của bạn"
                  className="w-[350px] h-[60px] rounded-full border-2 pl-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {nameError}
                </p>
              </li>

              {/* for email */}
              <li className="relative">
                <p className="ml-4 font-DM_sans font-bold text-base">Email</p>
                <input
                  onChange={handleEmail}
                  value={email}
                  type="text"
                  placeholder="Điền email của bạn"
                  className="w-[350px] h-[60px] rounded-full border-2 pl-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {emailError}
                </p>
              </li>
            </ul>

            {/* for subject */}
            <ul>
              <p className="ml-4 font-DM_sans font-bold text-base">Tiêu đề</p>
              <input
                onChange={handleSubject}
                value={subject}
                type="text"
                placeholder="Viết tiêu đề"
                className="w-full h-[60px] rounded-full border-2 pl-4 mt-2 outline-none"
              />
            </ul>

            {/* for message */}
            <ul className="flex flex-col gap-2 relative">
              <p className="ml-4 font-DM_sans font-bold text-base">Nội dung</p>
              <textarea
                onChange={handleMassage}
                value={massage}
                placeholder="Viết nội dung"
                className="h-[155px] border-2 outline-none rounded-md p-6"
              />
              <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                {massageError}
              </p>
            </ul>

            {/* Submit button */}
            <ul>
              <button className="w-full py-5 bg-[#AD343E] text-white rounded-full font-DM_sans font-bold text-base hover:bg-red-500 active:scale-95 duration-200">
                Gửi
              </button>
            </ul>

            {/* Success/Error message */}
            {successMessage && (
              <p className="text-green-500 text-center mt-4 font-bold">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-center mt-4 font-bold">
                {errorMessage}
              </p>
            )}
          </ul>
        </form>

        {/* ============== Contact Info Part ============== */}
        <div className="container w-[780px] flex justify-between mt-[82px]">
          {/* number */}
          <ul className="flex flex-col gap-6">
            <li className="text-[#2C2F24] font-bold font-DM_sans text-xl">
              Gọi chúng tôi:
            </li>
            <a
              href="tel:(084)0244556624"
              className="text-[#AD343E] font-bold font-DM_sans text-2xl hover:text-red-400 duration-200"
            >
              (084)0244556624
            </a>
          </ul>

          {/* hour time */}
          <ul className="flex flex-col gap-6">
            <li className="text-[#2C2F24] font-bold font-DM_sans text-xl">
              Giờ hoạt động:
            </li>
            <li className="text-[#2C2F24] font-normal font-DM_sans text-lg">
              T2-T7: 11am - 8pm,
              <br />
              CN: 9am - 10pm
            </li>
          </ul>

          {/* location */}
          <ul className="flex flex-col gap-6">
            <li className="text-[#2C2F24] font-bold font-DM_sans text-xl">
              Địa chỉ:
            </li>
            <li className="text-[#2C2F24] font-normal font-DM_sans text-lg">
              268 Đ. Lý Thường Kiệt
              <br />
              Phường 14, Quận 10
              <br />
              Hồ Chí Minh
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Contact;
