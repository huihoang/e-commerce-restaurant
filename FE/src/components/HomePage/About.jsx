// ==================== All Import
import React                     from 'react'
import { BsAlarm }               from 'react-icons/bs'
import { IoIosMail }             from 'react-icons/io'
import { GrMultiple }            from 'react-icons/gr'
import { RiWindowLine }          from 'react-icons/ri'
import { HiOutlineMapPin }       from 'react-icons/hi2'
import { FaGooglePlay, FaPhone } from 'react-icons/fa'

const About = () => {
    return (
        <>
            {/* ================= About Header Part ================= */}
            <section className='container mt-[85px] flex justify-between'>

                {/* ---------- About Banner Part ---------- */}
                <ul>
                    <img src="/aboutBanner.png" alt="banner_image" />
                    <ul className='p-[50px] bg-[#474747] rounded-xl flex flex-col items-start w-[410px] text-white gap-[25px] translate-x-[300px] translate-y-[-200px]'>
                        <li className='mb-5 font-DM_sans font-bold text-2xl'>Hãy tới nhà hàng của chúng tôi</li>
                        <a href='#' className='font-DM_sans text-base font-normal flex items-center hover:text-red-200'>
                            < FaPhone className='text-xl mr-5' />
                            (084)0244556624
                        </a>
                        <a href='#' className='font-DM_sans text-base font-normal flex items-center hover:text-red-200'>
                            < IoIosMail className='text-xl mr-5' /> 
                            bachkhoa@hcmut.edu.vn
                        </a>
                        <a href='#' className='font-DM_sans text-base font-normal flex hover:text-red-200'>
                            < HiOutlineMapPin className='text-2xl mr-5' />
                            268 Đ. Lý Thường Kiệt, Phường 14, Quận 10, Hồ Chí Minh
                        </a>
                    </ul>
                </ul>

                {/* ---------- About Banner Info Part ---------- */}
                <ul className='w-[560px] flex flex-col gap-6 justify-start'>
                    <h3 className='font-PlayfairD font-medium text-[55px] leading-[60px]'>
                    Chúng tôi cung cấp bữa ăn ngon cho gia đình.
                    </h3>
                    <p className='font-DM_sans font-medium text-lg text-[#2C2F24]'>
                    Câu chuyện của chúng tôi bắt đầu với một tầm nhìn tạo ra một trải nghiệm ẩm thực độc đáo, kết hợp giữa ẩm thực cao cấp, dịch vụ xuất sắc và không gian sôi động. Được hình thành từ nền văn hóa ẩm thực phong phú của thành phố, chúng tôi mong muốn tôn vinh cội nguồn địa phương trong khi hòa quyện với khẩu vị toàn cầu.
                    </p>
                    <p className='font-DM_sans font-normal text-base text-[#414536]'>
                    Tại đây, chúng tôi tin rằng việc thưởng thức ẩm thực không chỉ đơn thuần là món ăn, mà còn là toàn bộ trải nghiệm. Đội ngũ nhân viên của chúng tôi, nổi tiếng với sự thân thiện và tận tâm, luôn nỗ lực để biến mỗi lần ghé thăm thành một kỷ niệm khó quên.
                    </p>
                </ul>
            </section>

            {/* ================= About Video Part ================= */}
            <section className='w-full relative'>
                <img src="/aboutVideo.png" alt="about_video_image" className='w-full bg-cover' />
                <ul className='absolute top-[40%] left-[50%]'>
                    <button className='p-5 bg-white rounded-full text-xl hover:scale-125 transition duration-300'><FaGooglePlay /></button>
                    <li className='w-[596px] text-center font-PlayfairD font-medium text-[55px] leading-[60px] mt-[34px] absolute top-[60%] left-[-250px] text-white'>Cảm nhận không gian Việt tại nhà hàng chúng tôi</li>
                </ul>
            </section>

            {/* ================= All Benefits Part ================= */}
            <section className='container flex justify-between py-20'>

                {/* ------ multi benefit ------ */}
                <div className='w-[366px] flex gap-7'> 
                    <GrMultiple className='text-4xl mt-[-4px]' />
                    <ul>
                        <li className='font-DM_sans font-bold text-xl'>Đa dạng món ăn</li>
                        <li className='font-DM_sans font-normal text-sm mt-4'>Món ngon 3 miền.</li>
                    </ul>
                </div>

                {/* ------ order benefit ------ */}
                <div className='w-[366px] flex gap-7'> 
                    <RiWindowLine className='text-4xl mt-[-4px]' />
                    <ul>
                        <li className='font-DM_sans font-bold text-xl'>Dễ dàng đặt món</li>
                        <li className='font-DM_sans font-normal text-sm mt-4'>Dễ dàng đặt món qua website.</li>
                    </ul>
                </div>

                {/* ------ delivery benefit ------ */}
                <div className='w-[366px] flex gap-7'> 
                    <BsAlarm className='text-4xl mt-[-4px]' />
                    <ul>
                        <li className='font-DM_sans font-bold text-xl'>Giao hàng nhanh</li>
                        <li className='font-DM_sans font-normal text-sm mt-4'>Giao hàng trong 30 phút.</li>
                    </ul>
                </div>
            </section>

            {/* ================= Inside Info Part ================= */}
            <section className='w-full py-[120px] bg-[#F9F9F7]'>
                <div className='container flex justify-between'>
                    <ul className='w-[610px]'>
                        <h1 className='font-PlayfairD font-medium text-[55px] leading-[60px]'>Một số thông tin về chúng tôi</h1>
                        <p className='font-DM_sans font-normal text-base mt-5'>Câu chuyện của chúng tôi bắt đầu với một tầm nhìn tạo ra một trải nghiệm ẩm thực độc đáo, kết hợp giữa ẩm thực cao cấp, dịch vụ xuất sắc và không gian sôi động. Được hình thành từ nền văn hóa ẩm thực phong phú của thành phố, chúng tôi mong muốn tôn vinh cội nguồn địa phương trong khi hòa quyện với khẩu vị toàn cầu.</p>
                        
                        {/* ---------- inside info ---------- */}
                        <ul className='flex flex-wrap gap-6 mt-[60px]'>

                            {/* ---------- location part ---------- */}
                            <ul className='w-[290px] h-[175px] flex flex-col items-center justify-center gap-5 border-1 bg-white rounded-xl hover:scale-105 transition duration-300 will-change-transform'>
                                <li className='font-PlayfairD font-medium text-[55px]'>3</li>
                                <li className='font-DM_sans font-medium text-lg'>Chi nhánh</li>
                            </ul>

                            {/* ---------- founded part ---------- */}
                            <ul className='w-[290px] h-[175px] flex flex-col items-center justify-center gap-5 border-1 bg-white rounded-xl hover:scale-105 transition duration-300 will-change-transform'>
                                <li className='font-PlayfairD font-medium text-[55px]'>2025</li>
                                <li className='font-DM_sans font-medium text-lg'>Thành lập</li>
                            </ul>

                            {/* ---------- staff part ---------- */}
                            <ul className='w-[290px] h-[175px] flex flex-col items-center justify-center gap-5 border-1 bg-white rounded-xl hover:scale-105 transition duration-300 will-change-transform'>
                                <li className='font-PlayfairD font-medium text-[55px]'>65+</li>
                                <li className='font-DM_sans font-medium text-lg'>Nhân viên</li>
                            </ul>

                            {/* ---------- satisfied customer part ---------- */}
                            <ul className='w-[290px] h-[175px] flex flex-col items-center justify-center gap-5 border-1 bg-white rounded-xl hover:scale-105 transition duration-300 will-change-transform'>
                                <li className='font-PlayfairD font-medium text-[55px]'>100%</li>
                                <li className='font-DM_sans font-medium text-lg'>Hài lòng khách hàng</li>
                            </ul>
                        </ul>
                    </ul>

                    {/* ---------- inside part image ---------- */}
                    <ul>
                        <img src="/cooking.png" alt="cooking_image" />
                    </ul>
                </div>
            </section>

            {/* ================= Review Part ================= */}
            <section className='container py-[100px]'>

                {/* ------ header ------ */}
                <h4 className='font-PlayfairD font-medium text-[55px] leading-[60px] text-[#2C2F24] text-center'>Khách hàng của chúng tôi</h4>

                {/* ------ all reviewers ------ */}
                <div className='mt-16 flex justify-between '>

                    {/* ------ reviewer ------ */}
                    <ul className='w-[416px] p-[35px] flex flex-col bg-[#F9F9F7] gap-8 hover:shadow-[inset_5px_5px_20px_rgba(0,0,0,0.2)] rounded-2xl'>
                        <li className='font-DM_sans font-bold text-2xl leading-[30px] text-[#AD343E]'>“Nhà hàng tuyệt vời nhất”</li>
                        <li className='font-DM_sans font-normal text-lg leading-7'>Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không gian ấm cúng và những nụ cười thân thiện.</li>
                        <ul className='flex gap-5'>
                            <img src='/reviewer3.png' alt="reviewer_img" />
                            <ul className='flex flex-col justify-center gap-1'>
                                <li className='font-DM_sans font-bold text-base'>Thanh Nga</li>
                                <li className='font-DM_sans font-normal text-base'>Quận 3</li>
                            </ul>
                        </ul>   
                    </ul>

                    {/* ------ reviewer ------ */}
                    <ul className='w-[416px] p-[35px] flex flex-col bg-[#F9F9F7] gap-8 hover:shadow-[inset_5px_5px_20px_rgba(0,0,0,0.2)] rounded-2xl'>
                        <li className='font-DM_sans font-bold text-2xl leading-[30px] text-[#AD343E]'>“Nhà hàng tuyệt vời nhất”</li>
                        <li className='font-DM_sans font-normal text-lg leading-7'>Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không gian ấm cúng và những nụ cười thân thiện.</li>
                        <ul className='flex gap-5'>
                            <img src='/reviewer3.png' alt="reviewer_img" />
                            <ul className='flex flex-col justify-center gap-1'>
                                <li className='font-DM_sans font-bold text-base'>Thanh Nga</li>
                                <li className='font-DM_sans font-normal text-base'>Quận 3</li>
                            </ul>
                        </ul>   
                    </ul>

                    {/* ------ reviewer ------ */}
                    <ul className='w-[416px] p-[35px] flex flex-col bg-[#F9F9F7] gap-8 hover:shadow-[inset_5px_5px_20px_rgba(0,0,0,0.2)] rounded-2xl'>
                        <li className='font-DM_sans font-bold text-2xl leading-[30px] text-[#AD343E]'>“Nhà hàng tuyệt vời nhất”</li>
                        <li className='font-DM_sans font-normal text-lg leading-7'>Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không gian ấm cúng và những nụ cười thân thiện.</li>
                        <ul className='flex gap-5'>
                            <img src='/reviewer3.png' alt="reviewer_img" />
                            <ul className='flex flex-col justify-center gap-1'>
                                <li className='font-DM_sans font-bold text-base'>Thanh Nga</li>
                                <li className='font-DM_sans font-normal text-base'>Quận 3</li>
                            </ul>
                        </ul>   
                    </ul>
                </div>
            </section>
        </>
    )
}

export default About