// ==================== All Import
import { BsAlarm } from 'react-icons/bs'
import { GrMultiple } from 'react-icons/gr'
import { RiWindowLine } from 'react-icons/ri'
import { FaGooglePlay } from 'react-icons/fa'

const About = () => {
    return (
        <div className="bg-white max-w-7xl mx-auto shadow-sm">
            {/* ================= About Header Part ================= */}
            <section className='px-6 sm:px-8 lg:px-12 py-8 flex flex-col md:flex-row justify-between gap-6'>

                {/* ---------- About Banner Part ---------- */}
                <div className="w-full md:w-[50%] overflow-hidden rounded-lg">
                    <img src="/aboutBanner.jpg" alt="banner_image" className="w-full h-auto object-cover hover:scale-110 transition-transform duration-500" />
                </div>

                {/* ---------- About Banner Info Part ---------- */}
                <div className='w-full md:w-[45%] flex flex-col gap-6 justify-start'>
                    <h3 className='font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3]'>
                        Chúng tôi cung cấp bữa ăn ngon cho gia đình.
                    </h3>
                    <p className='font-DM_sans font-medium text-lg text-[#2C2F24]'>
                        Câu chuyện của chúng tôi bắt đầu với một tầm nhìn tạo ra một trải nghiệm ẩm thực độc đáo, kết hợp giữa ẩm thực cao cấp, dịch vụ xuất sắc và không gian sôi động. Được hình thành từ nền văn hóa ẩm thực phong phú của thành phố, chúng tôi mong muốn tôn vinh cội nguồn địa phương trong khi hòa quyện với khẩu vị toàn cầu.
                    </p>
                    <p className='font-DM_sans font-normal text-base text-[#414536]'>
                        Tại đây, chúng tôi tin rằng việc thưởng thức ẩm thực không chỉ đơn thuần là món ăn, mà còn là toàn bộ trải nghiệm. Đội ngũ nhân viên của chúng tôi, nổi tiếng với sự thân thiện và tận tâm, luôn nỗ lực để biến mỗi lần ghé thăm thành một kỷ niệm khó quên.
                    </p>
                </div>
            </section>

            {/* ================= About Video Part ================= */}
            <section className='w-full relative'>
                <img src="/aboutVideo.png" alt="about_video_image" className='w-full bg-cover' />
                <div className='absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full text-center'>
                    <button className='p-5 bg-white rounded-full text-xl hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300'><FaGooglePlay /></button>
                    <h3 className='w-full text-center font-PlayfairD font-medium text-2xl sm:text-4xl lg:text-[55px] leading-[1.3] mt-[34px] absolute top-[60%] left-1/2 transform -translate-x-1/2 text-white'>Cảm nhận không gian Việt tại nhà hàng chúng tôi</h3>
                </div>
            </section>

            {/* ================= All Benefits Part ================= */}
            <section className='px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between gap-6 py-12'>

                {/* ------ multi benefit ------ */}
                <div className='w-full md:w-[30%] flex gap-7'>
                    <GrMultiple className='text-4xl mt-[-4px] flex-shrink-0' />
                    <div>
                        <h4 className='font-DM_sans font-bold text-xl'>Đa dạng món ăn</h4>
                        <p className='font-DM_sans font-normal text-sm mt-4'>Món ngon 3 miền.</p>
                    </div>
                </div>

                {/* ------ order benefit ------ */}
                <div className='w-full md:w-[30%] flex gap-7'>
                    <RiWindowLine className='text-4xl mt-[-4px] flex-shrink-0' />
                    <div>
                        <h4 className='font-DM_sans font-bold text-xl'>Dễ dàng đặt món</h4>
                        <p className='font-DM_sans font-normal text-sm mt-4'>Dễ dàng đặt món qua website.</p>
                    </div>
                </div>

                {/* ------ delivery benefit ------ */}
                <div className='w-full md:w-[30%] flex gap-7'>
                    <BsAlarm className='text-4xl mt-[-4px] flex-shrink-0' />
                    <div>
                        <h4 className='font-DM_sans font-bold text-xl'>Giao hàng nhanh</h4>
                        <p className='font-DM_sans font-normal text-sm mt-4'>Giao hàng trong 30 phút.</p>
                    </div>
                </div>
            </section>

            {/* ================= Inside Info Part ================= */}
            <section className='w-full py-16 bg-gradient-to-b from-slate-50 to-white'>
                <div className='px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between gap-6'>
                    <div className='w-full md:w-[50%]'>
                        <h1 className='font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3]'>Một số thông tin về chúng tôi</h1>
                        <p className='font-DM_sans font-normal text-base mt-5'>Câu chuyện của chúng tôi bắt đầu với một tầm nhìn tạo ra một trải nghiệm ẩm thực độc đáo, kết hợp giữa ẩm thực cao cấp, dịch vụ xuất sắc và không gian sôi động. Được hình thành từ nền văn hóa ẩm thực phong phú của thành phố, chúng tôi mong muốn tôn vinh cội nguồn địa phương trong khi hòa quyện với khẩu vị toàn cầu.</p>

                        {/* ---------- inside info ---------- */}
                        <div className='flex flex-wrap gap-3 mt-[60px]'>

                            {/* ---------- location part ---------- */}
                            <div className='w-full sm:w-[48%] md:w-[23%] h-[175px] flex flex-col items-center justify-center gap-5 border-2 border-slate-200 bg-white rounded-xl hover:border-blue-300 hover:shadow-xl transition-all duration-300'>
                                <h3 className='font-PlayfairD font-medium text-4xl lg:text-[55px] leading-normal'>3</h3>
                                <p className='font-DM_sans font-medium text-lg'>Chi nhánh</p>
                            </div>

                            {/* ---------- founded part ---------- */}
                            <div className='w-full sm:w-[48%] md:w-[23%] h-[175px] flex flex-col items-center justify-center gap-5 border-2 border-slate-200 bg-white rounded-xl hover:border-blue-300 hover:shadow-xl transition-all duration-300'>
                                <h3 className='font-PlayfairD font-medium text-4xl lg:text-[55px] leading-normal'>2025</h3>
                                <p className='font-DM_sans font-medium text-lg'>Thành lập</p>
                            </div>

                            {/* ---------- staff part ---------- */}
                            <div className='w-full sm:w-[48%] md:w-[23%] h-[175px] flex flex-col items-center justify-center gap-5 border-2 border-slate-200 bg-white rounded-xl hover:border-blue-300 hover:shadow-xl transition-all duration-300'>
                                <h3 className='font-PlayfairD font-medium text-4xl lg:text-[55px] leading-normal'>65+</h3>
                                <p className='font-DM_sans font-medium text-lg'>Nhân viên</p>
                            </div>

                            {/* ---------- satisfied customer part ---------- */}
                            <div className='w-full sm:w-[48%] md:w-[23%] h-[175px] flex flex-col items-center justify-center gap-5 border-2 border-slate-200 bg-white rounded-xl hover:border-blue-300 hover:shadow-xl transition-all duration-300'>
                                <h3 className='font-PlayfairD font-medium text-4xl lg:text-[55px] leading-normal'>100%</h3>
                                <p className='font-DM_sans font-medium text-lg'>Hài lòng khách hàng</p>
                            </div>
                        </div>
                    </div>

                    {/* ---------- inside part image ---------- */}
                    <div className='w-full md:w-[45%] overflow-hidden rounded-lg'>
                        <img src="/cooking.png" alt="cooking_image" className="object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>
            </section>

            {/* ================= Review Part ================= */}
            <section className='px-6 sm:px-8 lg:px-12 pt-16 pb-16'>

                {/* ------ header ------ */}
                <h4 className='font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3] text-[#2C2F24] text-center'>Khách hàng của chúng tôi</h4>

                {/* ------ all reviewers ------ */}
                <div className='mt-16 flex flex-col md:flex-row justify-between gap-6'>

                    {/* ------ reviewer ------ */}
                    <div className='w-full md:w-[32%] p-[35px] flex flex-col bg-gradient-to-br from-slate-50 to-white gap-8 hover:shadow-xl hover:border-blue-200 border-2 border-transparent rounded-2xl transition-all duration-300'>
                        <h5 className='font-DM_sans font-bold text-2xl leading-normal text-blue-600'>&quot;Nhà hàng tuyệt vời nhất&quot;</h5>
                        <p className='font-DM_sans font-normal text-lg leading-7'>Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không gian ấm cúng và những nụ cười thân thiện.</p>
                        <div className='flex gap-5'>
                            <div className="overflow-hidden rounded-full">
                                <img src='/reviewer3.png' alt="reviewer_img" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className='flex flex-col justify-center gap-1'>
                                <p className='font-DM_sans font-bold text-base'>Thanh Nga</p>
                                <p className='font-DM_sans font-normal text-base'>Quận 3</p>
                            </div>
                        </div>
                    </div>

                    {/* ------ reviewer ------ */}
                    <div className='w-full md:w-[32%] p-[35px] flex flex-col bg-gradient-to-br from-slate-50 to-white gap-8 hover:shadow-xl hover:border-blue-200 border-2 border-transparent rounded-2xl transition-all duration-300'>
                        <h5 className='font-DM_sans font-bold text-2xl leading-normal text-blue-600'>&quot;Nhà hàng tuyệt vời nhất&quot;</h5>
                        <p className='font-DM_sans font-normal text-lg leading-7'>Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không gian ấm cúng và những nụ cười thân thiện.</p>
                        <div className='flex gap-5'>
                            <div className="overflow-hidden rounded-full">
                                <img src='/reviewer3.png' alt="reviewer_img" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className='flex flex-col justify-center gap-1'>
                                <p className='font-DM_sans font-bold text-base'>Thanh Nga</p>
                                <p className='font-DM_sans font-normal text-base'>Quận 3</p>
                            </div>
                        </div>
                    </div>

                    {/* ------ reviewer ------ */}
                    <div className='w-full md:w-[32%] p-[35px] flex flex-col bg-gradient-to-br from-slate-50 to-white gap-8 hover:shadow-xl hover:border-blue-200 border-2 border-transparent rounded-2xl transition-all duration-300'>
                        <h5 className='font-DM_sans font-bold text-2xl leading-normal text-blue-600'>&quot;Nhà hàng tuyệt vời nhất&quot;</h5>
                        <p className='font-DM_sans font-normal text-lg leading-7'>Tối qua, chúng tôi đã dùng bữa tại đây và thật sự ấn tượng. Ngay từ khoảnh khắc bước vào, chúng tôi đã được đón chào bằng không gian ấm cúng và những nụ cười thân thiện.</p>
                        <div className='flex gap-5'>
                            <div className="overflow-hidden rounded-full">
                                <img src='/reviewer3.png' alt="reviewer_img" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className='flex flex-col justify-center gap-1'>
                                <p className='font-DM_sans font-bold text-base'>Thanh Nga</p>
                                <p className='font-DM_sans font-normal text-base'>Quận 3</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
