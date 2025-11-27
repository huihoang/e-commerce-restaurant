const PaymentActions = ({ onClose, onConfirm }) => {
  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Hủy
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
      >
        ✅ Xác nhận thanh toán
      </button>
    </div>
  );
};

export default PaymentActions;


