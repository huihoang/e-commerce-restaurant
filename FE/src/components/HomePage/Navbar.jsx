// ==================== All Import
import React            from 'react'
import { IoIosMail }    from 'react-icons/io'
import { Link }         from 'react-router-dom'
import ScrollToTop      from './ScrollToTop'
import { FaFacebookF, FaGithub, FaInstagram, FaPhone, FaTwitter } from 'react-icons/fa'

const Navbar = () => {
    return (
        <>
            {/* ======== For Scroll Top ======== */}
            <ScrollToTop/>
            
            {/* ================== Top Navbar Part ================== */}
            <nav className='w-full sticky top-0 z-50'>
                <header className='py-2 bg-[#474747]'>
                    <ul className='container flex justify-between'>
                        <ul className='flex gap-6 text-white font-DM_sans text-base font-normal'>
                            <li className='flex items-center gap-1'><FaPhone />(084)0244556624</li>
                            <li className='flex items-center gap-1'><IoIosMail /> bachkhoa@hcmut.edu.vn</li>
                        </ul>

                        {/* ---------- All Social Link ---------- */}
                        <ul className='flex gap-4'>
                            <a href='#' className='p-[8px] bg-[#f9f9f746] hover:bg-[#f9f9f783] text-white rounded-full'><FaTwitter /></a>
                            <a href='#' className='p-[8px] bg-[#f9f9f746] hover:bg-[#f9f9f783] text-white rounded-full'><FaFacebookF /></a>
                            <a href='#' className='p-[8px] bg-[#f9f9f746] hover:bg-[#f9f9f783] text-white rounded-full'><FaInstagram /></a>
                        </ul>
                    </ul>
                </header>

                {/* ================== Main Navbar Part ================== */}
                <main className='py-4 border-b-2 bg-[#F9F9F7]'>
                    <ul className='container flex justify-between'>

                        {/* ---------- Logo Part ---------- */}
                        <Link to = "/" className='flex gap-4 items-center '>
                            <img src="/Logo.png" alt="Logo_image" />
                            <h1 className='font-PlayfairD font-semibold text-[42px] italic text-[#474747] '>Nhà Hàng Việt</h1>
                        </Link>

                        {/* ---------- All Pages Link ---------- */}
                        <ul className='flex items-center gap-8 text-[#2C2F24] font-DM_sans font-bold text-base'>
                            <Link to = "/"        className='py-1 px-4 hover:bg-[#AD343E] hover:text-white transition duration-400 rounded-2xl'>Trang chủ</Link>
                            <Link to = "/about"   className='py-1 px-4 hover:bg-[#AD343E] hover:text-white transition duration-400 rounded-2xl'>Giới thiệu</Link>
                            <Link to = "/menu"    className='py-1 px-4 hover:bg-[#AD343E] hover:text-white transition duration-400 rounded-2xl'>Thực đơn</Link>
                            <Link to = "/contact" className='py-1 px-4 hover:bg-[#AD343E] hover:text-white transition duration-400 rounded-2xl'>Liên hệ</Link>
                            <Link to = "/login" className='py-1 px-4 hover:bg-[#AD343E] hover:text-white transition duration-400 rounded-2xl'>Tài Khoản</Link>
                        </ul>

                        {/* ---------- For Book Table ---------- */}
                        <ul className='flex items-center'>
                            <Link to="/book">
                                <button className='px-4 py-1 border-2 rounded-full border-[#2C2F24] font-DM_sans font-bold text-base hover:text-white hover:bg-black hover:border-white duration-300'>
                                    Đặt bàn
                                </button>
                            </Link>
                        </ul>
                    </ul>
                </main>
            </nav>
        </>
    );
};

export default Navbar;