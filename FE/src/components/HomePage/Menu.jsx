// ==================== All Import
import { useEffect, useMemo, useState } from "react";
import { addToCart } from "@/utils/cart";

const FALLBACK_CATEGORIES = ["Bữa Sáng", "Bữa Trưa", "Đồ Uống", "Tráng Miệng"];
const categoryColorMap = {
  "Bữa Sáng": "bg-amber-400/90",
  "Bữa Trưa": "bg-emerald-500/90",
  "Đồ Uống": "bg-cyan-500/90",
  "Tráng Miệng": "bg-rose-500/90",
};

const Menu = () => {
  // ==================== All useState
  const [foodData, setFoodData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [categories, setCategories] = useState([]);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const getMockRating = (index) => (4.5 + (index % 5) * 0.1).toFixed(1);
  const getMockOrders = (index) => `${400 + index * 37} lượt đặt`;

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
  }, [API_BASE_URL]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then((response) => response.json())
      .then((json) => {
        setCategories(Array.isArray(json) ? json : []);
      })
      .catch((err) => console.error("Lỗi fetch categories:", err));
  }, [API_BASE_URL]);

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      if (!cat) return;
      const name = cat.name || cat.slug;
      if (cat._id && name) {
        map.set(cat._id, name);
      }
      if (name) {
        map.set(name, name);
      }
    });
    FALLBACK_CATEGORIES.forEach((name) => {
      if (!map.has(name)) {
        map.set(name, name);
      }
    });
    return map;
  }, [categories]);

  const categoryButtons = useMemo(() => {
    const names = categories
      .filter((cat) => cat.isActive !== false)
      .map((cat) => cat.name)
      .filter(Boolean);
    const uniqueNames = Array.from(
      new Set(names.length > 0 ? names : FALLBACK_CATEGORIES)
    );
    return ["Tất cả", ...uniqueNames];
  }, [categories]);

  useEffect(() => {
    if (!categoryButtons.includes(selectedCategory)) {
      setSelectedCategory("Tất cả");
      setFilteredData(foodData);
    }
  }, [categoryButtons, selectedCategory, foodData]);

  const getCategoryLabel = (value) => {
    if (!value) return "Chưa phân loại";
    if (typeof value === "object") {
      return value.name || categoryMap.get(value._id) || "Chưa phân loại";
    }
    return categoryMap.get(value) || value || "Chưa phân loại";
  };

  const getCategoryBadgeClass = (label) =>
    categoryColorMap[label] || "bg-slate-900/80";

  // ==================== Handle Filter
  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === "Tất cả") {
      setFilteredData(foodData);
    } else {
      const filtered = foodData.filter((item) => {
        const label = getCategoryLabel(item.category);
        return label === category;
      });
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
          {categoryButtons.map((cat) => (
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
          filteredData.map((item, index) => (
            <div
              data-card
              key={item._id}
              className="w-full sm:w-[306px] pb-4 flex flex-col items-center gap-4 border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden relative"
            >
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow ${getCategoryBadgeClass(
                    getCategoryLabel(item.category)
                  )}`}
                >
                  {getCategoryLabel(item.category)}
                </span>
              </div>
              <div className="w-full h-[200px] overflow-hidden rounded-t-xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                {item.discountPercent > 0 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-DM_sans text-lg text-slate-400 line-through">
                        {formatPrice(item.price)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                        -{item.discountPercent}%
                      </span>
                    </div>
                    <h4 className="font-DM_sans font-bold text-2xl text-red-600">
                      {formatPrice(
                        Number(item.price) * (1 - (item.discountPercent || 0) / 100)
                      )}
                    </h4>
                  </>
                ) : (
                  <h4 className="font-DM_sans font-bold text-2xl text-blue-600">
                    {formatPrice(item.price)}
                  </h4>
                )}
              </div>
              <h5 className="font-DM_sans font-bold text-xl text-center">{item.name}</h5>
              <p className="px-[30px] text-center font-DM_sans font-normal text-base text-slate-600">
                {item.info}
              </p>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <span className="flex items-center gap-1 text-amber-500">
                  ★ {getMockRating(index)}
                </span>
                <span className="text-slate-400">•</span>
                <span>{getMockOrders(index)}</span>
              </div>

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