const ProfileActions = ({ isEditing, saving, onSave, onCancel }) => {
  if (!isEditing) return null;

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-green-700 hover:to-emerald-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
            Đang lưu...
          </span>
        ) : (
          "💾 Lưu thay đổi"
        )}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ❌ Hủy bỏ
      </button>
    </div>
  );
};

export default ProfileActions;


