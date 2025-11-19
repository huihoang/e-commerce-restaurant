// ==================== All Import
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaPhone } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';

const Footer = () => {
    return (
        <>
            {/* ================= Footer Part ================= */}
            <footer className='w-full bg-gradient-to-br from-slate-800 to-slate-900 py-12'>
                <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12'>
                        {/* ================= Footer Info & Logo Part ================= */}
                        <div className='flex flex-col gap-6 text-white'>
                            {/* ------- Footer Logo ------- */}
                            <Link to='/' className='flex items-center'>
                                <img src="/footerLogo.png" alt="footer_logo_Image" />
                                <h3 className='ml-3 font-PlayfairD font-semibold text-[33px] italic leading-normal'>BK Restaurant</h3>
                            </Link>

                            {/* ------- Footer Info ------- */}
                            <p className='text-slate-300'>
                                &quot;Tinh hoa ẩm thực vào trong từng món ăn&quot;
                            </p>
                            <div className='flex items-center gap-3'>
                                <FaPhone className='text-blue-400' />
                                <span>+84 123 456 789</span>
                            </div>
                            <div className='flex items-center gap-3'>
                                <IoIosMail className='text-blue-400' />
                                <span>bachkhoa@hcmut.edu.vn</span>
                            </div>

                            {/* ------- All Social Links ------- */}
                            <div className='flex gap-3'>
                                <a href="#" className='text-[20px] p-[10px] bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'><FaTwitter /></a>
                                <a href="#" className='text-[20px] p-[10px] bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'><FaFacebookF /></a>
                                <a href="#" className='text-[20px] p-[10px] bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'><FaInstagram /></a>
                            </div>
                        </div>

                        {/* ================= All Utility Pages Link Part ================= */}
                        <div className='text-white'>
                            <h2 className='font-DM_sans font-bold text-base mb-6'>Thông tin thêm</h2>
                            <div className='flex flex-col gap-4 font-DM_sans font-normal text-base'>
                                <Link to="#" className='hover:text-blue-300 transition-colors duration-300'>Chi Nhánh</Link>
                                <Link to="#" className='hover:text-blue-300 transition-colors duration-300'>Đại Lý</Link>
                                <Link to="#" className='hover:text-blue-300 transition-colors duration-300'>Chính sách bảo mật</Link>
                                <Link to="#" className='hover:text-blue-300 transition-colors duration-300'>Điều khoản dịch vụ</Link>
                            </div>
                        </div>

                        {/* ================= Footer Images Part ================= */}
                        <div className='flex flex-col'>
                            <a href='#' className='text-white font-DM_sans font-bold text-base hover:text-blue-300 transition-colors duration-300 mb-6'>Theo dõi chúng tôi trên Instagram</a>
                            <div className='grid grid-cols-2 gap-3'>
                                <div className='overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300'>
                                    <img src="/footerImg1.png" alt="footer_img1" className='w-full h-full object-cover hover:scale-110 transition-transform duration-500' />
                                </div>
                                <div className='overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300'>
                                    <img src="/footerImg2.png" alt="footer_img2" className='w-full h-full object-cover hover:scale-110 transition-transform duration-500' />
                                </div>
                                <div className='overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300'>
                                    <img src="/footerImg3.png" alt="footer_img3" className='w-full h-full object-cover hover:scale-110 transition-transform duration-500' />
                                </div>
                                <div className='overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300'>
                                    <img src="/footerImg4.png" alt="footer_img4" className='w-full h-full object-cover hover:scale-110 transition-transform duration-500' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= Copy-Right Part ================= */}
                <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-12 pt-8 border-t border-slate-700'>
                    <p className='text-slate-400 text-base font-DM_sans font-normal text-center'>Copyright © 2025 Hcmut. All Rights Reserved</p>
                </div>
            </footer>
        </>
    );
};

export default Footer;