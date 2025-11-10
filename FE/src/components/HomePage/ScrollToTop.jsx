// ==================== All Import
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {

  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  // ==================== For keep scroll up on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // ==================== Show floating button after scroll
  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {show && (
        <button
          aria-label="Lên đầu trang"
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default ScrollToTop;