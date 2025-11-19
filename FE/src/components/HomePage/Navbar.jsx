// ==================== All Import
import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import { getCartCount, onCartChange } from '@/utils/cart';
import { LuShoppingCart } from 'react-icons/lu';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const off = onCartChange(() => setCartCount(getCartCount()));
        return () => off && off();
    }, []);

    const closeMenu = () => setOpen(false);

    // Lock scroll when drawer is open
    useEffect(() => {
        if (open) {
            const original = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [open]);

    return (
        <>
            {/* ======== For Scroll Top ======== */}
            <ScrollToTop />

            {/* ================== Top Navbar Part ================== */}
            <nav className='sticky top-0 z-50 bg-white shadow-sm'>
                {/* ================== Main Navbar Part ================== */}
                <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between py-4'>

                        {/* ---------- Logo Part ---------- */}
                        <Link to="/" className='flex gap-3 items-center ' onClick={closeMenu}>
                            <img src="/Logo.png" width={55} height={55} alt="Logo_image" />
                            <h1 className='font-PlayfairD font-semibold text-2xl sm:text-3xl lg:text-[42px] italic text-slate-800 '>BK Restaurant</h1>
                        </Link>

                        {/* ---------- All Pages Link (Desktop) ---------- */}
                        <ul className='hidden md:flex items-center gap-2 lg:gap-4 text-slate-700 font-DM_sans font-bold text-base'>
                            <NavLink
                                to="/"
                                className={({ isActive }) => `py-1 px-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 hover:text-blue-600'}`}
                            >Trang chủ</NavLink>
                            <NavLink
                                to="/about"
                                className={({ isActive }) => `py-1 px-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 hover:text-blue-600'}`}
                            >Giới thiệu</NavLink>
                            <NavLink
                                to="/menu"
                                className={({ isActive }) => `py-1 px-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 hover:text-blue-600'}`}
                            >Thực đơn</NavLink>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) => `py-1 px-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 hover:text-blue-600'}`}
                            >Liên hệ</NavLink>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => `py-1 px-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 hover:text-blue-600'}`}
                            >Tài Khoản</NavLink>
                        </ul>

                        {/* ---------- CTA & Hamburger ---------- */}
                        <div className='flex items-center gap-3'>
                            {/* Cart */}
                            <Link to='/cart' className='relative p-2 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition' aria-label='Giỏ hàng'>
                                <LuShoppingCart className='text-xl' />
                                {cartCount > 0 && (
                                    <span className='absolute -top-2 -right-2 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] leading-[20px] text-center'>
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/book" className='hidden md:block'>
                                <button className='px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-DM_sans font-bold text-base hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300'>
                                    Đặt bàn
                                </button>
                            </Link>
                            <button
                                className='md:hidden p-2 rounded-lg border border-slate-700'
                                aria-label='Mở menu'
                                onClick={() => setOpen(true)}
                            >
                                <span className='block w-6 h-0.5 bg-slate-700 mb-1'></span>
                                <span className='block w-6 h-0.5 bg-slate-700 mb-1'></span>
                                <span className='block w-6 h-0.5 bg-slate-700'></span>
                            </button>
                        </div>
                    </div>

                {/* ============== Mobile Drawer (always mounted for smooth anim) ============== */}
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={closeMenu}
                />
                {/* Panel */}
                <div
                    role='dialog'
                    aria-modal='true'
                    className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-[60] shadow-xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className='p-4 border-b flex items-center justify-between'>
                        <Link to='/' className='flex items-center gap-2' onClick={closeMenu}>
                            <img src='/Logo.png' alt='Logo_image' className='w-8 h-8' />
                            <span className='font-PlayfairD text-xl italic text-slate-800'>BK Restaurant</span>
                        </Link>
                        <button aria-label='Đóng menu' onClick={closeMenu} className='p-2 rounded hover:bg-blue-50 transition-colors'>
                            ✕
                        </button>
                    </div>
                    <nav className='p-4 font-DM_sans font-bold text-base text-slate-700 space-y-2'>
                        <NavLink to='/' onClick={closeMenu} className={({isActive}) => `block py-3 px-4 rounded-lg transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 hover:text-blue-600'}`}>Trang chủ</NavLink>
                        <NavLink to='/about' onClick={closeMenu} className={({isActive}) => `block py-3 px-4 rounded-lg transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 hover:text-blue-600'}`}>Giới thiệu</NavLink>
                        <NavLink to='/menu' onClick={closeMenu} className={({isActive}) => `block py-3 px-4 rounded-lg transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 hover:text-blue-600'}`}>Thực đơn</NavLink>
                        <NavLink to='/contact' onClick={closeMenu} className={({isActive}) => `block py-3 px-4 rounded-lg transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 hover:text-blue-600'}`}>Liên hệ</NavLink>
                        <NavLink to='/login' onClick={closeMenu} className={({isActive}) => `block py-3 px-4 rounded-lg transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 hover:text-blue-600'}`}>Tài Khoản</NavLink>
                        <NavLink to='/book' onClick={closeMenu} className={({isActive}) => `block py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center transition-all duration-300 ${isActive ? 'from-blue-700 to-indigo-700 shadow-lg' : 'hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'}`}>Đặt bàn</NavLink>
                    </nav>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
