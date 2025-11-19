// ==================== All Import
import { Link } from "react-router-dom";
import HomeBlogs from "./HomeBlogs";
import { FiCoffee } from "react-icons/fi";
import { BiBowlRice } from "react-icons/bi";
import { GiCakeSlice } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";
import { LuGlassWater, LuShoppingCart } from "react-icons/lu";
import { HiOutlineReceiptPercent } from "react-icons/hi2";

const Homepage = () => {
  return (
    <>
      {/* ================= Banner part ================= */}
      <section className="relative w-full h-screen">
        <img
          src="/banner_bg.png"
          alt="banner_image"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 text-white">
          {/* --------- Header --------- */}
          <h1 className="font-PlayfairD text-[40px] sm:text-[60px] lg:text-[100px] font-normal leading-[1.2]">
            Tinh Hoa <br /> Ẩm Thực Việt
          </h1>
          <p className="mt-6 sm:mt-8 font-DM_sans text-base sm:text-xl font-normal">
            Khám khá ẩm thực ba miền <br /> các món ngon đồng quê.
          </p>

          {/* --------- Booking part --------- */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 text-[#182226] text-base font-DM_sans font-bold">
            <Link to="/book">
              <button className="px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                Đặt bàn
              </button>
            </Link>
            <Link to="/menu">
              <button className="px-8 py-5 bg-white border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 hover:border-blue-700 shadow-md hover:shadow-lg transition-all duration-300 font-semibold">
                Khám phá thực đơn
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= Content Container (with margins) ================= */}
      <div className="bg-white max-w-7xl mx-auto shadow-sm">
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
        {/* ------ header ------ */}
        <h4 className="font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3] text-[#2C2F24] text-center">
          Khách hàng của chúng tôi
        </h4>

        {/* ------ all reviewers ------ */}
        <div className="mt-8 flex flex-col md:flex-row justify-between gap-6">
          {/* ------ reviewer ------ */}
          <div className="w-full md:w-[32%] p-[35px] flex flex-col bg-gradient-to-br from-slate-50 to-white gap-8 hover:shadow-xl hover:border-blue-200 border-2 border-transparent rounded-2xl transition-all duration-300">
            <h5 className="font-DM_sans font-bold text-2xl leading-normal text-blue-600">
              &quot;Nhà hàng tuyệt vời nhất&quot;
            </h5>
            <p className="font-DM_sans font-normal text-lg leading-7">
              Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay
              từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không
              gian ấm cúng và những nụ cười thân thiện.
            </p>
            <div className="flex gap-5">
              <div className="overflow-hidden rounded-full">
                <img src="/reviewer1.png" alt="reviewer_img" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <p className="font-DM_sans font-bold text-base">Lam Thanh</p>
                <p className="font-DM_sans font-normal text-base">Quận 1</p>
              </div>
            </div>
          </div>

          {/* ------ reviewer ------ */}
          <div className="w-full md:w-[32%] p-[35px] flex flex-col bg-gradient-to-br from-slate-50 to-white gap-8 hover:shadow-xl hover:border-blue-200 border-2 border-transparent rounded-2xl transition-all duration-300">
            <h5 className="font-DM_sans font-bold text-2xl leading-normal text-blue-600">
              &quot;Nhà hàng tuyệt vời nhất&quot;
            </h5>
            <p className="font-DM_sans font-normal text-lg leading-7">
              Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay
              từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không
              gian ấm cúng và những nụ cười thân thiện.
            </p>
            <div className="flex gap-5">
              <div className="overflow-hidden rounded-full">
                <img src="/reviewer2.png" alt="reviewer_img" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <p className="font-DM_sans font-bold text-base">Tran Duy</p>
                <p className="font-DM_sans font-normal text-base">Quận 12</p>
              </div>
            </div>
          </div>

          {/* ------ reviewer ------ */}
          <div className="w-full md:w-[32%] p-[35px] flex flex-col bg-gradient-to-br from-slate-50 to-white gap-8 hover:shadow-xl hover:border-blue-200 border-2 border-transparent rounded-2xl transition-all duration-300">
            <h5 className="font-DM_sans font-bold text-2xl leading-normal text-blue-600">
              &quot;Nhà hàng tuyệt vời nhất&quot;
            </h5>
            <p className="font-DM_sans font-normal text-lg leading-7">
              Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay
              từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không
              gian ấm cúng và những nụ cười thân thiện.
            </p>
            <div className="flex gap-5">
              <div className="overflow-hidden rounded-full">
                <img src="/reviewer3.png" alt="reviewer_img" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <p className="font-DM_sans font-bold text-base">Thanh Nga</p>
                <p className="font-DM_sans font-normal text-base">Quận 3</p>
              </div>
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
