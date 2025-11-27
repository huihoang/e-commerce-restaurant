import PropTypes from "prop-types";

const BookingModalHeader = ({ onClose }) => (
  <div className="flex items-center justify-between rounded-t-3xl border-b border-slate-200 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
    <h3 className="text-2xl font-bold text-white">✏️ Chỉnh sửa Đặt Bàn</h3>
    <button
      onClick={onClose}
      className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
      aria-label="Đóng"
    >
      ✕
    </button>
  </div>
);

export default BookingModalHeader;

BookingModalHeader.propTypes = {
  onClose: PropTypes.func.isRequired,
};

