import PropTypes from "prop-types";

const ModalActionsSection = ({ onCancel, onSave }) => (
  <div className="mt-6 flex justify-end gap-3">
    <button
      type="button"
      onClick={onCancel}
      className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      Hủy bỏ
    </button>
    <button
      type="button"
      onClick={onSave}
      className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
    >
      💾 Lưu thay đổi
    </button>
  </div>
);

export default ModalActionsSection;

ModalActionsSection.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

