// ==================== All Import
import { useEffect, useState } from "react";
import { addToCart } from "@/utils/cart";

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
    <div className="bg-white max-w-7xl mx-auto shadow-sm">
      {/* ================= Menu Heading ================= */}
      <section className="px-6 sm:px-8 lg:px-12 mt-12 text-center">
        <h1 className="font-PlayfairD font-normal text-4xl sm:text-6xl lg:text-[100px] leading-[1.2]">
          Thực đơn của chúng tôi
        </h1>
        <p className="mt-5 font-DM_sans font-normal text-lg text-[#495460]">
          Chúng tôi xem xét tất cả các yếu tố thúc đẩy sự thay đổi, mang đến cho
          bạn những thành phần cần thiết để tạo ra một sự chuyển mình thực sự.
        </p>

        {/* ================= Category Buttons ================= */}
        <ul className="flex flex-wrap justify-center gap-4 mt-[50px] font-DM_sans font-bold text-base text-slate-700">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`w-full sm:w-[150px] h-12 rounded-full border-2 transition-all duration-300 shadow-md hover:shadow-lg
                ${selectedCategory === cat
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600"
                  : "bg-white border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500"
                }`}
            >
              {cat}
            </button>
          ))}
        </ul>
      </section>

      {/* ================= Filtered Food List ================= */}
      <section className="px-6 sm:px-8 lg:px-12 mt-12 pb-16 flex flex-wrap justify-center gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              data-card
              key={item._id}
              className="w-full sm:w-[306px] pb-4 flex flex-col items-center gap-4 border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
            >
              <div className="w-full h-[200px] overflow-hidden rounded-t-xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="font-DM_sans font-bold text-2xl text-blue-600">
                {formatPrice(item.price)}
              </h4>
              <h5 className="font-DM_sans font-bold text-xl">{item.name}</h5>
              <p className="px-[30px] text-center font-DM_sans font-normal text-base">
                {item.info}
              </p>

              <div className="flex items-center gap-3 mt-auto w-full justify-center pt-2">
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-20 h-10 border rounded-lg px-2"
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => {}}
                />
                <button
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition"
                  onClick={(e) => {
                    const card = e.currentTarget.closest('[data-card]');
                    const input = card?.querySelector('input[type="number"]');
                    const qty = input ? Number(input.value) || 1 : 1;
                    addToCart(item, qty);
                  }}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            Không có món ăn nào trong danh mục này.
          </p>
        )}
      </section>

      {/* ================= Ordering Apps Section ================= */}
      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="px-6 sm:px-8 lg:px-12 pt-16 pb-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="w-full md:w-[30%] flex-shrink-0">
              <h4 className="font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3]">
                Bạn có thể đặt qua ứng dụng
              </h4>
              <p className="mt-5 font-PlayfairD font-medium text-base leading-[24px]">
                Đem lại sự tiện lợi cho bạn.
              </p>
            </div>

            {/* ================= App Logos ================= */}
            <div className="flex flex-wrap justify-center gap-4 w-full md:w-[70%] flex-shrink-0">
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
                className="w-[220px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img src={`/${app}.png`} alt={`${app}_image`} className="rounded-lg w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </a>
            ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;