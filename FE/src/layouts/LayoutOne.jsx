import { Outlet } from 'react-router-dom';
import Navbar from '@/components/HomePage/Navbar';
import Footer from '@/components/HomePage/Footer';

const LayoutOne = () => {
    return (
        <>
            {/* ================= Navbar part ================= */}
            <Navbar />

            {/* ================= Outlet part ================= */}
            <Outlet />

            {/* ================= Footer part ================= */}
            <Footer />
        </>
    );
};

export default LayoutOne;