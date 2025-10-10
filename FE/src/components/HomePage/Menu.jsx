// ==================== All Import
import React, { useEffect, useState } from "react";

const Menu = () => {
  // ==================== All useState
  const [foodData, setFoodData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ==================== All Categories
  const categories = [
    "Tất cả",
    "Bữa Sáng",
    "Bữa Trưa",
    "Đồ Uống",
    "Tráng Miệng",
  ];

  // ==================== Helper: Format giá tiền
  const formatPrice = (price) => {
    if (!price) return "";
    return Number(price).toLocaleString("vi-VN") + " đ";
  };

  // ==================== Fetch Menu Data From API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/menus`)
      .then((response) => response.json())
      .then((json) => {
        setFoodData(json);
        setFilteredData(json);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, []);

  // ==================== Handle Filter
  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === "Tất cả") {
      setFilteredData(foodData);
    } else {
      const filtered = foodData.filter((item) => item.category === category);
      setFilteredData(filtered);
    }
  };

  return (
    <>
      {/* ================= Menu Heading ================= */}
      <section className="container mt-[85px] text-center">
        <h1 className="font-PlayfairD font-normal text-[100px] leading-[96px]">
          Thực đơn của chúng tôi
        </h1>
        <p className="mt-5 font-DM_sans font-normal text-lg text-[#495460]">
          Chúng tôi xem xét tất cả các yếu tố thúc đẩy sự thay đổi, mang đến cho
          bạn những thành phần cần thiết để tạo ra một sự chuyển mình thực sự.
        </p>

        {/* ================= Category Buttons ================= */}
        <ul className="flex justify-center gap-4 mt-[50px] font-DM_sans font-bold text-base text-[#2C2F24]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`w-[150px] h-12 rounded-full border-2 transition duration-400
                ${
                  selectedCategory === cat
                    ? "bg-[#AD343E] text-white"
                    : "hover:bg-[#AD343E] hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </ul>
      </section>

      {/* ================= Filtered Food List ================= */}
      <section className="container mt-[88px] pb-[132px] flex flex-wrap justify-center gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <ul
              key={item._id}
              className="w-[306px] pb-[34px] flex flex-col items-center gap-6 border-2 rounded-xl hover:scale-105 transition duration-400"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-[200px] object-cover rounded-t-xl"
              />
              <li className="font-DM_sans font-bold text-2xl text-[#AD343E]">
                {formatPrice(item.price)}
              </li>
              <li className="font-DM_sans font-bold text-xl">{item.name}</li>
              <li className="px-[30px] text-center font-DM_sans font-normal text-base">
                {item.info}
              </li>
            </ul>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            Không có món ăn nào trong danh mục này.
          </p>
        )}
      </section>

      {/* ================= Ordering Apps Section ================= */}
      <section className="bg-[#F9F9F7]">
        <ul className="container py-[120px] flex justify-between items-center flex-wrap gap-10">
          <li className="w-full md:w-[346px]">
            <h4 className="font-PlayfairD font-medium text-[55px] leading-[60px]">
              Bạn có thể đặt qua ứng dụng
            </h4>
            <p className="mt-5 font-PlayfairD font-medium text-base leading-[24px]">
              Đem lại sự tiện lợi cho bạn.
            </p>
          </li>

          {/* ================= App Logos ================= */}
          <ul className="flex flex-wrap justify-center gap-4 w-full md:w-[830px]">
            {[
              "uberEats",
              "grubHub",
              "postMates",
              "doorDash",
              "foodPanda",
              "delivero",
              "inscart",
              "justeat",
              "didifood",
            ].map((app) => (
              <a
                key={app}
                href="#"
                className="w-[220px] hover:scale-125 transition duration-300"
              >
                <img src={`/${app}.png`} alt={`${app}_image`} />
              </a>
            ))}
          </ul>
        </ul>
      </section>
    </>
  );
};

export default Menu;