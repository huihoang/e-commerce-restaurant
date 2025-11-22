import { useEffect } from "react";
import PropTypes from "prop-types";

const NotificationModal = ({ isOpen, type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === "success";
  const bgColor = isSuccess
    ? "from-green-500 to-emerald-600"
    : "from-red-500 to-rose-600";
  const icon = isSuccess ? "✅" : "❌";
  const title = isSuccess ? "Thành công" : "Lỗi";

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pointer-events-none">
      <div
        className={`rounded-2xl bg-gradient-to-r ${bgColor} text-white shadow-2xl p-6 max-w-md w-full pointer-events-auto transform transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        role="alert"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-3xl">{icon}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-sm text-white/90">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-full bg-white/20 p-1 text-white transition hover:bg-white/30"
            aria-label="Đóng"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

NotificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default NotificationModal;

