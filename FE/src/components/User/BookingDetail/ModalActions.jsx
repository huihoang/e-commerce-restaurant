const ModalActions = ({ onClose }) => {
  return (
    <div className="mt-6 flex justify-end">
      <button
        onClick={onClose}
        className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
      >
        Đóng
      </button>
    </div>
  );
};

export default ModalActions;

