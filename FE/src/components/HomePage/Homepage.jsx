// ==================== All Import
import { Link } from "react-router-dom";
import HomeBlogs from "./HomeBlogs";
import { FaPhone } from "react-icons/fa";
import { FiCoffee } from "react-icons/fi";
import { BiBowlRice } from "react-icons/bi";
import { GiCakeSlice } from "react-icons/gi";
import { IoIosMail, IoMdTime } from "react-icons/io";
import { LuGlassWater, LuShoppingCart } from "react-icons/lu";
import { HiOutlineMapPin, HiOutlineReceiptPercent } from "react-icons/hi2";

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
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          {/* --------- Header --------- */}
          <h1 className="font-PlayfairD text-[40px] sm:text-[60px] lg:text-[100px] font-normal leading-[1.1] text-[#2C2F24]">
            Tinh Hoa <br /> Ẩm Thực Việt
          </h1>
          <p className="mt-6 sm:mt-8 font-DM_sans text-base sm:text-xl font-normal text-[#2C2F24]">
            Khám khá ẩm thực ba miền <br /> các món ngon đồng quê.
          </p>

          {/* --------- Booking part --------- */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 text-[#182226] text-base font-DM_sans font-bold">
            <Link to="/book">
              <button className="px-8 py-5 border-2 border-[#2C2F24] rounded-full hover:bg-[#AD343E] hover:text-white hover:border-[#AD343E] transition duration-200">
                Đặt bàn
              </button>
            </Link>
            <Link to="/manu">
              <button className="px-8 py-5 border-2 border-[#2C2F24] rounded-full hover:bg-[#AD343E] hover:text-white hover:border-[#AD343E] transition duration-200">
                Khám phá thực đơn
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= Manu Browser part ================= */}
      <section className="container pt-[92px] pb-[120px]">
        <h2 className="font-PlayfairD font-medium text-[55px] leading-[60px] text-[#2C2F24] text-center">
          Danh Sách Thực Đơn
        </h2>

        <object className="mt-16 flex justify-between">
          {/* ----- breakfast part ----- */}
          <ul className="w-[305px] p-9 flex flex-col items-center gap-6 border-2 rounded-lg text-center">
            <li className="p-4 bg-[#e0e0e0] text-black text-[25px] rounded-full">
              <FiCoffee />
            </li>
            <li className="font-DM_sans font-bold text-2xl leading-[30px]">
              Bữa Sáng
            </li>
            <li className="font-DM_sans font-normal text-base leading-6">
              Các món ngon dành cho ăn sáng đậm vị.
            </li>
            <Link to="/manu">
              <button className="px-4 py-1 border-2 rounded-full border-[#AD343E] font-DM_sans font-bold text-[#AD343E] hover:text-white hover:bg-[#AD343E] hover:border-white duration-300">
                Khám phá
              </button>
            </Link>
          </ul>

          {/* ----- dishes part ----- */}
          <ul className="w-[305px] p-9 flex flex-col items-center gap-6 border-2 rounded-lg text-center">
            <li className="p-4 bg-[#e0e0e0] text-black text-[25px] rounded-full">
              <BiBowlRice />
            </li>
            <li className="font-DM_sans font-bold text-2xl leading-[30px]">
              Bữa Trưa
            </li>
            <li className="font-DM_sans font-normal text-base leading-6">
              Các món ngon dành cho bữa trưa đậm vị.
            </li>
            <Link to="/manu">
              <button className="px-4 py-1 border-2 rounded-full border-[#AD343E] font-DM_sans font-bold text-[#AD343E] hover:text-white hover:bg-[#AD343E] hover:border-white duration-300">
                Khám phá
              </button>
            </Link>
          </ul>

          {/* ----- drinks part ----- */}
          <ul className="w-[305px] p-9 flex flex-col items-center gap-6 border-2 rounded-lg text-center">
            <li className="p-4 bg-[#e0e0e0] text-black text-[25px] rounded-full">
              <LuGlassWater />
            </li>
            <li className="font-DM_sans font-bold text-2xl leading-[30px]">
              Đồ Uống
            </li>
            <li className="font-DM_sans font-normal text-base leading-6">
              Các thức uống ngon thơm mát từ ba miền
            </li>
            <Link to="/manu">
              <button className="px-4 py-1 border-2 rounded-full border-[#AD343E] font-DM_sans font-bold text-[#AD343E] hover:text-white hover:bg-[#AD343E] hover:border-white duration-300">
                Khám phá
              </button>
            </Link>
          </ul>

          {/* ----- dessert part ----- */}
          <ul className="w-[305px] p-9 flex flex-col items-center gap-6 border-2 rounded-lg text-center">
            <li className="p-4 bg-[#e0e0e0] text-black text-[25px] rounded-full">
              <GiCakeSlice />
            </li>
            <li className="font-DM_sans font-bold text-2xl leading-[30px]">
              Tráng Miệng
            </li>
            <li className="font-DM_sans font-normal text-base leading-6">
              Các loại thức bánh và tráng miệng thơm ngon.
            </li>
            <Link to="/manu">
              <button className="px-4 py-1 border-2 rounded-full border-[#AD343E] font-DM_sans font-bold text-[#AD343E] hover:text-white hover:bg-[#AD343E] hover:border-white duration-300">
                Khám phá
              </button>
            </Link>
          </ul>
        </object>
      </section>

      {/* ================= Home About part ================= */}
      <section className="bg-[#F9F9F7] pt-[120px]">
        <div className="container flex justify-between">
          {/* ----------- About Contact Part ----------- */}
          <ul>
            <img src="/visit_Image.png" alt="visit_image" />
            <ul className="p-[50px] bg-[#474747] rounded-xl flex flex-col items-start w-[410px] text-white gap-[25px] translate-x-[240px] translate-y-[-250px]">
              <li className="mb-5 font-DM_sans font-bold text-2xl">
                Hãy tới nhà hàng của chúng tôi
              </li>
              <a
                href="#"
                className="font-DM_sans text-base font-normal flex items-center hover:text-red-200"
              >
                <FaPhone className="text-xl mr-5" />
                (084)0244556624
              </a>
              <a
                href="#"
                className="font-DM_sans text-base font-normal flex items-center hover:text-red-200"
              >
                <IoIosMail className="text-xl mr-5" /> bachkhoa@hcmut.edu.vn
              </a>
              <a
                href="#"
                className="font-DM_sans text-base font-normal flex hover:text-red-200"
              >
                <HiOutlineMapPin className="text-2xl mr-5" />
                268 Đ. Lý Thường Kiệt, Phường 14, Quận 10, Hồ Chí Minh
              </a>
            </ul>
          </ul>

          {/* ----------- About info Part ----------- */}
          <ul className="w-[560px] flex flex-col gap-6 justify-start">
            <h3 className="font-PlayfairD font-medium text-[55px] leading-[60px]">
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
              <button className="w-[180px] h-[65px] rounded-full border-2 border-[#2c2f24] font-DM_sans font-bold text-base text-[#182226] mt-4 hover:text-white hover:border-white hover:bg-black transition duration-800">
                Thông tin thêm
              </button>
            </Link>
          </ul>
        </div>
      </section>

      {/* ================= Offer part ================= */}
      <section className="py-[120px] container">
        <h3 className="font-PlayfairD font-medium text-[55px] leadin-[60px] text-center">
          Chúng tôi cung cấp <br /> dịch vụ tổ chức sự kiện
        </h3>
        <ul className="mt-16 flex justify-between">
          {/* --------- Caterinf Part --------- */}
          <ul className="flex flex-col justify-start gap-6 w-[306px] hover:scale-105 duration-300 will-change-transform">
            <li>
              <img src="/service1.png" alt="service1_image" />
            </li>
            <li className="font-DM_sans font-bold text-2xl">Tiệc trà</li>
            <li className="font-DM_sans font-normal text-base">
              Bữa tiệc đầy ắp niềm vui và hạnh phúc.
            </li>
          </ul>

          {/* --------- Birthday Part --------- */}
          <ul className="flex flex-col justify-start gap-6 w-[306px] hover:scale-105 duration-300 will-change-transform">
            <li>
              <img src="/service2.png" alt="service2_image" />
            </li>
            <li className="font-DM_sans font-bold text-2xl">Sinh Nhật</li>
            <li className="font-DM_sans font-normal text-base">
              Bữa tiệc đầy ắp niềm vui và hạnh phúc.
            </li>
          </ul>

          {/* --------- Weddings Part --------- */}
          <ul className="flex flex-col justify-start gap-6 w-[306px] hover:scale-105 duration-300 will-change-transform">
            <li>
              <img src="/service3.png" alt="service3_image" />
            </li>
            <li className="font-DM_sans font-bold text-2xl">Đám cưới</li>
            <li className="font-DM_sans font-normal text-base">
              Bữa tiệc đầy ắp niềm vui và hạnh phúc.
            </li>
          </ul>

          {/* --------- Events Part --------- */}
          <ul className="flex flex-col justify-start gap-6 w-[306px] hover:scale-105 duration-300 will-change-transform">
            <li>
              <img src="/service4.png" alt="service4_image" />
            </li>
            <li className="font-DM_sans font-bold text-2xl">Sự kiện</li>
            <li className="font-DM_sans font-normal text-base">
              Bữa tiệc đầy ắp niềm vui và hạnh phúc.
            </li>
          </ul>
        </ul>
      </section>

      {/* ================= Delivery Info part ================= */}
      <section className="bg-[#f9f9f7] py-[120px]">
        <ul className="container flex justify-between">
          {/* ---------- Images ---------- */}
          <ul className="flex gap-6">
            <li className="hover:scale-105 duration-300">
              <img src="/chef.png" alt="chef_image" />
            </li>
            <li className="mt-[30px] flex flex-col gap-6">
              <img
                src="/sour-curry.png"
                alt="sour_curry_image"
                className="hover:scale-105 duration-300"
              />
              <img
                src="/iron-salad.png"
                alt="iron_salad_image"
                className="hover:scale-105 duration-300"
              />
            </li>
          </ul>

          {/* ---------- Dewlivery Info ---------- */}
          <ul className="w-[460px] flex flex-col gap-5 justify-center">
            <li className="font-PlayfairD font-medium text-[55px] leading-[60px]">
              Giao hàng tận nơi trong Thành Phố
            </li>
            <li className="font-DM_sans font-normal text-base text-[#414536]">
              Giao hàng nhanh và thuận tiện.{" "}
            </li>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-4 text-xl font-DM_sans font-normal">
                <span className="p-2 text-white text-2xl bg-[#AD343E] rounded-full hover:bg-[#ca555f]">
                  <IoMdTime />
                </span>{" "}
                Giao trong vòng 30 phút
              </li>
              <li className="flex items-center gap-4 text-xl font-DM_sans font-normal">
                <span className="p-2 text-white text-2xl bg-[#AD343E] rounded-full hover:bg-[#ca555f]">
                  <HiOutlineReceiptPercent />
                </span>
                Giá tốt nhất
              </li>
              <li className="flex items-center gap-4 text-xl font-DM_sans font-normal">
                <span className="p-2 text-white text-2xl bg-[#AD343E] rounded-full hover:bg-[#ca555f]">
                  <LuShoppingCart />
                </span>
                Đặt món Online
              </li>
            </ul>
          </ul>
        </ul>
      </section>

      {/* ================= Review Part ================= */}
      <section className="container py-[100px]">
        {/* ------ header ------ */}
        <h4 className="font-PlayfairD font-medium text-[55px] leading-[60px] text-[#2C2F24] text-center">
          Khách hàng của chúng tôi
        </h4>

        {/* ------ all reviewers ------ */}
        <div className="mt-16 flex justify-between ">
          {/* ------ reviewer ------ */}
          <ul className="w-[416px] p-[35px] flex flex-col bg-[#F9F9F7] gap-8 hover:shadow-[inset_5px_5px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <li className="font-DM_sans font-bold text-2xl leading-[30px] text-[#AD343E]">
              “Nhà hàng tuyệt vời nhất”
            </li>
            <li className="font-DM_sans font-normal text-lg leading-7">
              Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay
              từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không
              gian ấm cúng và những nụ cười thân thiện.
            </li>
            <ul className="flex gap-5">
              <img src="/reviewer1.png" alt="reviewer_img" />
              <ul className="flex flex-col justify-center gap-1">
                <li className="font-DM_sans font-bold text-base">Lam Thanh</li>
                <li className="font-DM_sans font-normal text-base">Quận 1</li>
              </ul>
            </ul>
          </ul>

          {/* ------ reviewer ------ */}
          <ul className="w-[416px] p-[35px] flex flex-col bg-[#F9F9F7] gap-8 hover:shadow-[inset_5px_5px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <li className="font-DM_sans font-bold text-2xl leading-[30px] text-[#AD343E]">
              “Nhà hàng tuyệt vời nhất”
            </li>
            <li className="font-DM_sans font-normal text-lg leading-7">
              Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay
              từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không
              gian ấm cúng và những nụ cười thân thiện.
            </li>
            <ul className="flex gap-5">
              <img src="/reviewer2.png" alt="reviewer_img" />
              <ul className="flex flex-col justify-center gap-1">
                <li className="font-DM_sans font-bold text-base">Tran Duy</li>
                <li className="font-DM_sans font-normal text-base">Quận 12</li>
              </ul>
            </ul>
          </ul>

          {/* ------ reviewer ------ */}
          <ul className="w-[416px] p-[35px] flex flex-col bg-[#F9F9F7] gap-8 hover:shadow-[inset_5px_5px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <li className="font-DM_sans font-bold text-2xl leading-[30px] text-[#AD343E]">
              “Nhà hàng tuyệt vời nhất”
            </li>
            <li className="font-DM_sans font-normal text-lg leading-7">
              Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay
              từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không
              gian ấm cúng và những nụ cười thân thiện.
            </li>
            <ul className="flex gap-5">
              <img src="/reviewer3.png" alt="reviewer_img" />
              <ul className="flex flex-col justify-center gap-1">
                <li className="font-DM_sans font-bold text-base">Thanh Nga</li>
                <li className="font-DM_sans font-normal text-base">Quận 3</li>
              </ul>
            </ul>
          </ul>
        </div>
      </section>

      {/* ================= Home Blogs part ================= */}
      <div>
        <HomeBlogs />
      </div>
    </>
  );
};

export default Homepage;
