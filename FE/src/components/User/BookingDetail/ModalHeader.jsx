const ModalHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 rounded-t-3xl">
      <h3 className="text-2xl font-bold text-white">📋 Chi Tiết Đơn Đặt Món</h3>
      <button
        onClick={onClose}
        className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
        aria-label="Đóng"
      >
        ✕
      </button>
    </div>
  );
};

export default ModalHeader;

