import { Outlet } from 'react-router-dom';
import Navbar from '@/components/HomePage/Navbar';
import Footer from '@/components/HomePage/Footer';

const LayoutOne = () => {
    return (
        <div className="min-h-screen">
            {/* ================= Navbar part ================= */}
            <Navbar />

            {/* ================= Main Content ================= */}
            <div className="bg-slate-100">
                <Outlet />
            </div>

            {/* ================= Footer part ================= */}
            <Footer />
        </div>
    );
};

export default LayoutOne;