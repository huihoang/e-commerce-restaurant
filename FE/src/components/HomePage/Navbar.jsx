// ==================== All Import
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import { getCartCount, onCartChange } from '@/utils/cart';
import { LuShoppingCart } from 'react-icons/lu';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        role: '',
        username: '',
    });
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const off = onCartChange(() => setCartCount(getCartCount()));
        return () => off && off();
    }, []);

    const syncAuthState = useCallback(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role') || '';
        const username = localStorage.getItem('username') || '';
        setAuthState({
            isLoggedIn: Boolean(token && role),
            role,
            username,
        });
    }, []);

    useEffect(() => {
        syncAuthState();
    }, [syncAuthState]);

    useEffect(() => {
        const handleStorage = () => syncAuthState();
        globalThis.addEventListener('storage', handleStorage);
        return () => globalThis.removeEventListener('storage', handleStorage);
    }, [syncAuthState]);

    useEffect(() => {
        const handleAuthChange = () => syncAuthState();
        globalThis.addEventListener('auth-change', handleAuthChange);
        return () => globalThis.removeEventListener('auth-change', handleAuthChange);
    }, [syncAuthState]);

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

    useEffect(() => {
        setUserMenuOpen(false);
        closeMenu();
    }, [location.pathname]);

    useEffect(() => {
        if (!userMenuOpen) return undefined;
        const handleClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [userMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        globalThis.dispatchEvent(new Event('auth-change'));
        syncAuthState();
        navigate('/login');
    };

    const userInitial =
        authState.username?.trim().charAt(0).toUpperCase() || 'U';
    const displayUsername = authState.username || 'Tài khoản';

    const renderUserControls = () => {
        if (!authState.isLoggedIn) {
            return (
                <NavLink
                    to="/login"
                    className={({ isActive }) =>
                        `hidden md:inline-flex items-center rounded-full border border-blue-600 px-4 py-1 text-sm font-semibold transition ${
                            isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'text-blue-600 hover:bg-blue-50'
                        }`
                    }
                >
                    Đăng nhập
                </NavLink>
            );
        }

        if (authState.role === 'admin' || authState.role === 'staff') {
            return (
                <Link
                    to="/admin"
                    className="hidden md:inline-flex items-center rounded-full border border-blue-600 px-4 py-1 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                    Khu vực quản trị
                </Link>
            );
        }

        return (
            <div className="relative hidden md:block" ref={menuRef}>
                <button
                    className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    type="button"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        {userInitial}
                    </span>
                    <span className="max-w-[120px] truncate">{displayUsername}</span>
                    <span className={`text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </button>
                {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                        <Link
                            to="/profile"
                            className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50"
                        >
                            Thông tin người dùng
                        </Link>
                        <Link
                            to="/history"
                            className="mt-1 block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50"
                        >
                            Lịch sử đặt món
                        </Link>
                        <Link
                            to="/settings"
                            className="mt-1 block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50"
                        >
                            Cài đặt
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-2 block w-full rounded-xl bg-rose-50 px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-100"
                        >
                            Đăng xuất
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderMobileAuthLinks = () => {
        if (!authState.isLoggedIn) {
            return (
                <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg transition-all duration-300 ${
                            isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'hover:bg-blue-50 hover:text-blue-600'
                        }`
                    }
                >
                    Đăng nhập
                </NavLink>
            );
        }

        if (authState.role === 'admin' || authState.role === 'staff') {
            return (
                <NavLink
                    to="/admin"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg transition-all duration-300 ${
                            isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'hover:bg-blue-50 hover:text-blue-600'
                        }`
                    }
                >
                    Khu vực quản trị
                </NavLink>
            );
        }

        return (
            <>
                <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg transition-all duration-300 ${
                            isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'hover:bg-blue-50 hover:text-blue-600'
                        }`
                    }
                >
                    Thông tin người dùng
                </NavLink>
                <NavLink
                    to="/history"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg transition-all duration-300 ${
                            isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'hover:bg-blue-50 hover:text-blue-600'
                        }`
                    }
                >
                    Lịch sử đặt món
                </NavLink>
                <NavLink
                    to="/settings"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg transition-all duration-300 ${
                            isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'hover:bg-blue-50 hover:text-blue-600'
                        }`
                    }
                >
                    Cài đặt
                </NavLink>
                <button
                    type="button"
                    onClick={() => {
                        handleLogout();
                        closeMenu();
                    }}
                    className="block w-full rounded-lg bg-rose-50 px-4 py-3 text-left font-semibold text-rose-600 transition hover:bg-rose-100"
                >
                    Đăng xuất
                </button>
            </>
        );
    };

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
                            {renderUserControls()}
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
                        {renderMobileAuthLinks()}
                        <NavLink to='/book' onClick={closeMenu} className={({isActive}) => `block py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center transition-all duration-300 ${isActive ? 'from-blue-700 to-indigo-700 shadow-lg' : 'hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'}`}>Đặt bàn</NavLink>
                    </nav>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
