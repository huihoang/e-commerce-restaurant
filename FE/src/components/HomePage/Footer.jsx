// ==================== All Import
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaPhone } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';

const Footer = () => {
    return (
        <>
            {/* ================= Footer Part ================= */}
            <footer className='w-full bg-[#474747] py-[2%] mt-20'>
                <ul className='flex justify-evenly'>
                    <ul className='flex flex-col gap-[30px] text-white'>

                        {/* ------- Footer Logo ------- */}
                        <Link to='/' className='flex items-center '>
                            <img src="/footerLogo.png" alt="footer_logo_Image" />
                            <h3 className='ml-3 font-PlayfairD font-semibold text-[33px] italic leading-[30px]'>BK Restaurant</h3>
                        </Link>

                        {/* ------- Footer Info ------- */}
                        <li>
                            "Tinh hoa ẩm thực vào trong từng món ăn"
                        </li>
                        <li className='flex items-center gap-3'><FaPhone className='text-[#AD343E]' /> <span>+84 123 456 789</span></li>
                        <li className='flex items-center gap-3'><IoIosMail className='text-[#AD343E]' /> <span>bachkhoa@hcmut.edu.vn</span></li>

                        {/* ------- All Social Links ------- */}
                        <li className='flex gap-3'>
                            <a href="#" className='text-[20px] p-[10px] bg-[#AD343E] hover:bg-red-600 rounded-full'><FaTwitter /></a>
                            <a href="#" className='text-[20px] p-[10px] bg-[#AD343E] hover:bg-red-600 rounded-full'><FaFacebookF /></a>
                            <a href="#" className='text-[20px] p-[10px] bg-[#AD343E] hover:bg-red-600 rounded-full'><FaInstagram /></a>
                        </li>
                    </ul>

                    {/* ================= All Utility Pages Link Part ================= */}
                    <ul className='text-white'>
                        <h2 className='font-DM_sans font-bold text-base'>Thông tin thêm</h2>
                        <li className='flex flex-col gap-5 font-DM_sans font-normal text-base mt-10'>
                            <Link to="#" className='hover:text-red-400'>Chi Nhánh</Link>
                            <Link to="#" className='hover:text-red-400'>Đại Lý</Link>
                            <Link to="#" className='hover:text-red-400'>Chính sách bảo mật</Link>
                            <Link to="#" className='hover:text-red-400'>Điều khoản dịch vụ</Link>
                        </li>
                    </ul>

                    {/* ================= Footer Images Part ================= */}
                    <ul>
                        <a href='#' className='text-white font-DM_sans font-bold text-base hover:text-red-300 duration-200'>Theo dõi chúng tôi trên Instagram</a>
                        <li className='w-[410px] mt-10 flex flex-wrap gap-3'>
                            <img src="/footerImg1.png" alt="footer_img1" className='hover:scale-105 duration-300' />
                            <img src="/footerImg2.png" alt="footer_img2" className='hover:scale-105 duration-300' />
                            <img src="/footerImg3.png" alt="footer_img3" className='hover:scale-105 duration-300' />
                            <img src="/footerImg4.png" alt="footer_img4" className='hover:scale-105 duration-300' />
                        </li>
                    </ul>
                </ul>

                {/* ================= Copy-Right Part ================= */}
                <p className='mt-[130px] text-[#ADB29E] text-base font-DM_sans font-normal text-center'>Copyright © 2025 Hcmut. All Rights Reserved</p>
            </footer>
        </>
    );
};

export default Footer;