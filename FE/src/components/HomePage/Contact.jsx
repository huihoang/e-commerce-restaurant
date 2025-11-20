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
      setNameError("Vui lòng nhập họ tên");
      isValid = false;
    }
    if (email === "") {
      setEmailError("Vui lòng nhập email");
      isValid = false;
    }
    if (massage === "") {
      setMassageError("Vui lòng nhập nội dung");
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
    } catch {
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="bg-white max-w-7xl mx-auto shadow-sm">
      {/* ============== Contact Part Start ============== */}
      <section className="pb-16">
        <header className="px-6 sm:px-8 lg:px-12 text-center pt-4">
          <h1 className="font-PlayfairD text-4xl sm:text-6xl lg:text-[100px] font-normal leading-[1.2]">
            Liên hệ
          </h1>
          <p className="font-DM_sans text-lg leading-[28px] font-normal mt-6">
            Nếu bạn cần thông tin gì <br /> hãy liên hệ với chúng tôi.
          </p>
        </header>

        {/* ============== Form Part ============== */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[800px] mx-auto px-6 sm:px-8 lg:px-12 p-10 mt-12 shadow-2xl rounded-2xl"
        >
          <div className="flex gap-6 flex-col">
            <div className="flex flex-col md:flex-row gap-2">
              {/* for name */}
              <div className="relative w-full md:w-[48%]">
                <p className="ml-4 font-DM_sans font-bold text-base">Tên</p>
                <input
                  onChange={handleName}
                  value={name}
                  type="text"
                  placeholder="Điền tên của bạn"
                  className="w-full h-[60px] rounded-full border-2 pl-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {nameError}
                </p>
              </div>

              {/* for email */}
              <div className="relative w-full md:w-[48%]">
                <p className="ml-4 font-DM_sans font-bold text-base">Email</p>
                <input
                  onChange={handleEmail}
                  value={email}
                  type="text"
                  placeholder="Điền email của bạn"
                  className="w-full h-[60px] rounded-full border-2 pl-4 mt-2 outline-none"
                />
                <p className="font-DM_sans font-medium text-sm text-red-400 absolute top-0 right-5">
                  {emailError}
                </p>
              </div>
            </div>

            {/* for subject */}
            <div>
              <p className="ml-4 font-DM_sans font-bold text-base">Tiêu đề</p>
              <input
                onChange={handleSubject}
                value={subject}
                type="text"
                placeholder="Viết tiêu đề"
                className="w-full h-[60px] rounded-full border-2 pl-4 mt-2 outline-none"
              />
            </div>

            {/* for message */}
            <div className="flex flex-col gap-2 relative">
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
            </div>

            {/* Submit button */}
            <div>
              <button className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-DM_sans font-bold text-base hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Gửi
              </button>
            </div>

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
          </div>
        </form>
      </section>
    </div>
  );
};

export default Contact;
