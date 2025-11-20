// ==================== All Import
import { Link } from "react-router-dom";
import HomeBlogs from "./HomeBlogs";
import { FiCoffee } from "react-icons/fi";
import { BiBowlRice } from "react-icons/bi";
import { GiCakeSlice } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";
import { LuGlassWater, LuShoppingCart } from "react-icons/lu";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import { AiFillStar } from "react-icons/ai";
import { BsLightningCharge } from "react-icons/bs";
import { FaReceipt, FaRegClock } from "react-icons/fa";

const Homepage = () => {

  const marketingPromos = [
    {
      title: "Combo Gia Đình",
      desc: "Giảm 15% khi đặt trước 24h",
      cta: "Đặt combo",
      to: "/menu",
    },
    {
      title: "Tiệc Riêng",
      desc: "Setup không gian miễn phí",
      cta: "Đặt lịch",
      to: "/book",
    },
    {
      title: "Delivery Flash",
      desc: "Miễn phí ship trong giờ vàng",
      cta: "Gọi món",
      to: "/cart",
    },
  ];

  const testimonials = [
    {
      quote: "Nhà hàng tuyệt vời nhất",
      content:
        "Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Không gian ấm cúng, món ăn tròn vị.",
      author: "Lam Thanh",
      location: "Quận 1",
      avatar: "/reviewer1.png",
      rating: 4.9,
      orders: "1.2K đơn đã giao",
    },
    {
      quote: "Ẩm thực tinh tế",
      content:
        "Menu phong phú, phục vụ lịch sự. Đặt bàn cuối tuần lúc nào cũng được chuẩn bị chu đáo.",
      author: "Trần Duy",
      location: "Quận 12",
      avatar: "/reviewer2.png",
      rating: 4.8,
      orders: "980 đơn đặt bàn",
    },
    {
      quote: "Phục vụ đỉnh cao",
      content:
        "Chúng tôi đặt tiệc sinh nhật và mọi thứ hoàn hảo. Đặc biệt thích các món khai vị.",
      author: "Thanh Nga",
      location: "Quận 3",
      avatar: "/reviewer3.png",
      rating: 5,
      orders: "1.5K lượt đánh giá",
    },
  ];

  const policies = [
    {
      title: "Giao hàng nội thành",
      desc: "Trong bán kính 7km, miễn phí cho đơn từ 300.000đ.",
      icon: <LuShoppingCart />,
    },
    {
      title: "Hoàn tiền linh hoạt",
      desc: "Hoàn 100% nếu báo huỷ trước 4 giờ so với lịch đã đặt.",
      icon: <FaReceipt />,
    },
    {
      title: "Hotline hỗ trợ",
      desc: "028 1234 5678 (8:00 - 22:00) • Zalo chăm sóc khách hàng.",
      icon: <FaRegClock />,
    },
  ];

  const faqs = [
    {
      q: "Bao lâu tôi nhận được món?",
      a: "Thời gian giao trung bình 25 phút, giờ cao điểm tối đa 40 phút.",
    },
    {
      q: "Đặt bàn có cần cọc không?",
      a: "Bàn đến 6 người cọc 500.000đ, từ 7 người trở lên cọc 1.000.000đ.",
    },
    {
      q: "Có hỗ trợ thực đơn chay?",
      a: "Chúng tôi có thực đơn chay riêng, bạn có thể chọn trong bước đặt món.",
    },
  ];
  return (
    <>
      {/* ================= Banner part ================= */}
      <section className="relative w-full h-screen">
        <img
          src="/banner_bg.png"
          alt="banner_image"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 text-white">
          <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] px-8 py-10 max-w-3xl w-full shadow-2xl border border-white/20">
            <p className="uppercase tracking-[0.3em] text-sm sm:text-base font-semibold text-amber-200">
              Tinh hoa ẩm thực Việt
            </p>
            <h1 className="mt-4 font-PlayfairD text-[40px] sm:text-[60px] lg:text-[90px] font-semibold leading-[1.1]">
              Gọi món trong 60s,{" "}
              <span className="text-amber-300">đặt bàn chỉ 3 bước</span>
            </h1>
            <p className="mt-6 sm:mt-8 font-DM_sans text-base sm:text-xl font-normal text-slate-50">
              Ưu đãi giao hàng miễn phí, set menu cuối tuần và trải nghiệm tiệc
              riêng ngay trung tâm thành phố.
            </p>

            <div className="mt-8 mb-12 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center text-base font-DM_sans font-bold">
              <Link to="/menu">
                <button className="px-8 py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full hover:from-amber-500 hover:to-orange-600 shadow-[0_15px_40px_rgba(251,191,36,0.4)] transition-all duration-300">
                  Gọi món ngay
                </button>
              </Link>
              <Link to="/book">
                <button className="px-8 py-5 bg-white/90 text-blue-700 rounded-full border border-white/40 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Đặt bàn cuối tuần
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Content Container (with margins) ================= */}
      <div className="bg-white max-w-7xl mx-auto shadow-sm">
        {/* ============== Marketing promos ============== */}
        <section className="px-6 sm:px-8 lg:px-12 -mt-20 relative z-20">
          <div className="grid sm:grid-cols-3 gap-4">
            {marketingPromos.map((promo, idx) => (
              <div
                key={promo.title}
                className="rounded-2xl p-5 bg-white shadow-xl border border-slate-100 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                    <BsLightningCharge />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Ưu đãi #{idx + 1}
                    </p>
                    <h4 className="text-lg font-bold text-slate-900">
                      {promo.title}
                    </h4>
                  </div>
                </div>
                <p className="text-slate-600 text-sm">{promo.desc}</p>
                <Link
                  to={promo.to}
                  className="mt-auto inline-flex items-center gap-2 text-blue-600 font-semibold"
                >
                  {promo.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>
        {/* ================= Menu Browser part ================= */}
        <section className="px-6 sm:px-8 lg:px-12 pt-16 pb-16">
          <h2 className="font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3] text-[#2C2F24] text-center">
            Danh Sách Thực Đơn
          </h2>

          <div className="mt-8 flex flex-col sm:flex-row justify-between gap-3">
            {/* ----- breakfast part ----- */}
            <div className="w-full sm:w-[48%] lg:w-[305px] p-9 flex flex-col items-center gap-6 border-2 rounded-lg text-center">
              <div className="p-4 bg-[#e0e0e0] text-black text-[25px] rounded-full">
                <FiCoffee />
              </div>
              <h4 className="font-DM_sans font-bold text-2xl leading-normal">
                Bữa Sáng
              </h4>
              <p className="font-DM_sans font-normal text-base leading-6">
                Các món ngon dành cho ăn sáng đậm vị.
              </p>
              <Link to="/menu">
                <button className="px-4 py-1 border-2 rounded-full border-blue-600 font-DM_sans font-bold text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-300">
                  Khám phá
                </button>
              </Link>
            </div>

            {/* ----- dishes part ----- */}
            <div className="w-full sm:w-[48%] lg:w-[305px] p-9 flex flex-col items-center gap-6 border-2 rounded-lg text-center">
              <div className="p-4 bg-[#e0e0e0] text-black text-[25px] rounded-full">
                <BiBowlRice />
              </div>
              <h4 className="font-DM_sans font-bold text-2xl leading-normal">
                Bữa Trưa
              </h4>
              <p className="font-DM_sans font-normal text-base leading-6">
                Các món ngon dành cho bữa trưa đậm vị.
              </p>
              <Link to="/menu">
                <button className="px-4 py-1 border-2 rounded-full border-blue-600 font-DM_sans font-bold text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-300">
                  Khám phá
                </button>
              </Link>
            </div>

            {/* ----- drinks part ----- */}
            <div className="w-full sm:w-[48%] lg:w-[305px] p-9 flex flex-col items-center gap-6 border-2 rounded-lg text-center">
              <div className="p-4 bg-[#e0e0e0] text-black text-[25px] rounded-full">
                <LuGlassWater />
              </div>
              <h4 className="font-DM_sans font-bold text-2xl leading-normal">
                Đồ Uống
              </h4>
              <p className="font-DM_sans font-normal text-base leading-6">
                Các thức uống ngon thơm mát từ ba miền
              </p>
              <Link to="/menu">
                <button className="px-4 py-1 border-2 rounded-full border-blue-600 font-DM_sans font-bold text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-300">
                  Khám phá
                </button>
              </Link>
            </div>

            {/* ----- dessert part ----- */}
            <div className="w-full sm:w-[48%] lg:w-[305px] p-9 flex flex-col items-center gap-6 border-2 rounded-lg text-center">
              <div className="p-4 bg-[#e0e0e0] text-black text-[25px] rounded-full">
                <GiCakeSlice />
              </div>
              <h4 className="font-DM_sans font-bold text-2xl leading-normal">
                Tráng Miệng
              </h4>
              <p className="font-DM_sans font-normal text-base leading-6">
                Các loại thức bánh và tráng miệng thơm ngon.
              </p>
              <Link to="/menu">
                <button className="px-4 py-1 border-2 rounded-full border-blue-600 font-DM_sans font-bold text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-300">
                  Khám phá
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ================= Home About part ================= */}
        <section className="bg-gradient-to-b from-slate-50 to-white pt-16">
          <div className="px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between gap-6">
            {/* ----------- About Image Part ----------- */}
            <div className="w-full md:w-[50%]">
              <div className="overflow-hidden rounded-lg">
                <img src="/visit_Image.jpg" alt="visit_image" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            </div>

          {/* ----------- About info Part ----------- */}
          <div className="w-full md:w-[45%] flex flex-col gap-6 justify-start">
            <h3 className="font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3]">
              Chúng tôi cung cấp bữa ăn ngon cho gia đình.
            </h3>
            <p className="font-DM_sans font-medium text-lg text-[#2C2F24]">
              Câu chuyện của chúng tôi bắt đầu với một tầm nhìn tạo ra một trải
              nghiệm ẩm thực độc đáo, kết hợp giữa ẩm thực cao cấp, dịch vụ xuất
              sắc và không gian sôi động. Được hình thành từ nền văn hóa ẩm thực
              phong phú của thành phố, chúng tôi mong muốn tôn vinh cội nguồn
              địa phương trong khi hòa quyện với khẩu vị toàn cầu.
            </p>
            <p className="font-DM_sans font-normal text-base text-[#414536]">
              Tại đây, chúng tôi tin rằng việc thưởng thức ẩm thực không chỉ đơn
              thuần là món ăn, mà còn là toàn bộ trải nghiệm. Đội ngũ nhân viên
              của chúng tôi, nổi tiếng với sự thân thiện và tận tâm, luôn nỗ lực
              để biến mỗi lần ghé thăm thành một kỷ niệm khó quên.
            </p>
            <Link to="/about">
              <button className="w-[180px] h-[65px] rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-DM_sans font-bold text-base mt-4 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Thông tin thêm
              </button>
            </Link>
          </div>
          </div>
        </section>

        {/* ================= Offer part ================= */}
        <section className="py-16 px-6 sm:px-8 lg:px-12">
        <h3 className="font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3] text-center">
          Chúng tôi cung cấp <br /> dịch vụ tổ chức sự kiện
        </h3>
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-6">
          {/* --------- Caterinf Part --------- */}
          <div className="flex flex-col justify-start gap-6 w-full sm:w-[48%] lg:w-[306px] p-4 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blue-200">
            <div className="overflow-hidden rounded-lg">
              <img src="/service1.png" alt="service1_image" className="rounded-lg w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <h4 className="font-DM_sans font-bold text-2xl text-slate-800">Tiệc trà</h4>
            <p className="font-DM_sans font-normal text-base text-slate-600">
              Bữa tiệc đầy ắp niềm vui và hạnh phúc.
            </p>
          </div>

          {/* --------- Birthday Part --------- */}
          <div className="flex flex-col justify-start gap-6 w-full sm:w-[48%] lg:w-[306px] p-4 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blue-200">
            <div className="overflow-hidden rounded-lg">
              <img src="/service2.jpg" alt="service2_image" className="rounded-lg w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <h4 className="font-DM_sans font-bold text-2xl text-slate-800">Sinh Nhật</h4>
            <p className="font-DM_sans font-normal text-base text-slate-600">
              Bữa tiệc đầy ắp niềm vui và hạnh phúc.
            </p>
          </div>

          {/* --------- Weddings Part --------- */}
          <div className="flex flex-col justify-start gap-6 w-full sm:w-[48%] lg:w-[306px] p-4 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blue-200">
            <div className="overflow-hidden rounded-lg">
              <img src="/service3.jpg" alt="service3_image" className="rounded-lg w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <h4 className="font-DM_sans font-bold text-2xl text-slate-800">Đám cưới</h4>
            <p className="font-DM_sans font-normal text-base text-slate-600">
              Bữa tiệc đầy ắp niềm vui và hạnh phúc.
            </p>
          </div>

          {/* --------- Events Part --------- */}
          <div className="flex flex-col justify-start gap-6 w-full sm:w-[48%] lg:w-[306px] p-4 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blue-200">
            <div className="overflow-hidden rounded-lg">
              <img src="/service4.jpg" alt="service4_image" className="rounded-lg w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <h4 className="font-DM_sans font-bold text-2xl text-slate-800">Sự kiện</h4>
            <p className="font-DM_sans font-normal text-base text-slate-600">
              Bữa tiệc đầy ắp niềm vui và hạnh phúc.
            </p>
          </div>
        </div>
        </section>

        {/* ================= Delivery Info part ================= */}
        <section className="bg-gradient-to-b from-white to-slate-50 py-16">
          <div className="px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          {/* ---------- Images ---------- */}
          <div className="w-full md:w-[45%] flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-[48%] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <img src="/chef.png" alt="chef_image" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="w-full sm:w-[48%] mt-0 sm:mt-[30px] flex flex-col gap-6">
              <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <img
                  src="/sour-curry.png"
                  alt="sour_curry_image"
                  className="rounded-lg w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <img
                  src="/iron-salad.png"
                  alt="iron_salad_image"
                  className="rounded-lg w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* ---------- Delivery Info ---------- */}
          <div className="w-full md:w-[50%] flex flex-col gap-5 justify-center">
            <h4 className="font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3]">
              Giao hàng tận nơi trong Thành Phố
            </h4>
            <p className="font-DM_sans font-normal text-base text-[#414536]">
              Giao hàng nhanh và thuận tiện.{" "}
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-xl font-DM_sans font-normal">
                <span className="p-2 text-white text-2xl bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <IoMdTime />
                </span>{" "}
                Giao trong vòng 30 phút
              </div>
              <div className="flex items-center gap-4 text-xl font-DM_sans font-normal">
                <span className="p-2 text-white text-2xl bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <HiOutlineReceiptPercent />
                </span>
                Giá tốt nhất
              </div>
              <div className="flex items-center gap-4 text-xl font-DM_sans font-normal">
                <span className="p-2 text-white text-2xl bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <LuShoppingCart />
                </span>
                Đặt món Online
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* ================= Review Part ================= */}
        <section className="px-6 sm:px-8 lg:px-12 py-16">
          <h4 className="font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3] text-[#2C2F24] text-center">
            Khách hàng của chúng tôi
          </h4>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.author}
                className="p-[35px] flex flex-col bg-gradient-to-br from-slate-50 to-white gap-6 hover:shadow-xl hover:border-blue-200 border-2 border-transparent rounded-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-DM_sans font-bold text-2xl leading-normal text-blue-600">
                    &quot;{item.quote}&quot;
                  </h5>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <AiFillStar />
                    {item.rating}
                  </span>
                </div>
                <p className="font-DM_sans text-lg leading-7 text-slate-600">
                  {item.content}
                </p>
                <div className="flex gap-5 items-center">
                  <div className="overflow-hidden rounded-full border-2 border-white shadow-lg w-16 h-16">
                    <img
                      src={item.avatar}
                      alt="reviewer_img"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <p className="font-DM_sans font-bold text-base">
                      {item.author}
                    </p>
                    <p className="font-DM_sans text-base text-slate-500">
                      {item.location}
                    </p>
                    <p className="text-xs text-emerald-500 font-semibold">
                      {item.orders}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= Policy & FAQ part ================= */}
        <section className="px-6 sm:px-8 lg:px-12 py-16 bg-slate-50">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-[0.3em]">
                Chính sách & hỗ trợ
              </p>
              <h4 className="font-PlayfairD text-4xl mt-3 text-[#2C2F24]">
                Yên tâm gọi món, đã có chúng tôi đồng hành
              </h4>
              <div className="mt-6 space-y-4">
                {policies.map((policy) => (
                  <div
                    key={policy.title}
                    className="p-4 rounded-2xl bg-white flex items-start gap-4 shadow-sm border border-slate-100"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl">
                      {policy.icon}
                    </div>
                    <div>
                      <h5 className="font-semibold text-lg">{policy.title}</h5>
                      <p className="text-slate-600 text-sm">{policy.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-[0.3em]">
                Câu hỏi thường gặp
              </p>
              <div className="mt-6 space-y-4">
                {faqs.map((faq, idx) => (
                  <details
                    key={faq.q}
                    className="group border border-slate-200 rounded-2xl p-5 bg-white"
                    open={idx === 0}
                  >
                    <summary className="font-semibold text-lg text-slate-800 cursor-pointer flex justify-between items-center">
                      {faq.q}
                      <span className="text-blue-600 text-sm">
                        {idx === 0 ? "Mở" : "Xem"}
                      </span>
                    </summary>
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= Home Blogs part ================= */}
        <div>
          <HomeBlogs />
        </div>
      </div>
    </>
  );
};

export default Homepage;
