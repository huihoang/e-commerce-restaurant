import { useRef } from "react";

const UserFormModal = ({
  isOpen,
  isEditing,
  formData,
  roleOptions,
  onChange,
  onClose,
  onSubmit,
}) => {
  const birthdayInputRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xl font-semibold text-slate-900">
            {isEditing ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tên đăng nhập
              </label>
              <input
                name="username"
                value={formData.username || ""}
                onChange={onChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={onChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Họ và tên
              </label>
              <input
                name="fullName"
                value={formData.fullName || ""}
                onChange={onChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                placeholder="Nhập họ tên nhân viên"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Số điện thoại
              </label>
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={onChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ngày sinh
              </label>
              <div
                className="mt-1 w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus-within:border-blue-500 focus-within:outline-none"
                onClick={() => birthdayInputRef.current?.showPicker?.()}
              >
                <input
                  ref={birthdayInputRef}
                  type="date"
                  name="birthday"
                  value={formData.birthday || ""}
                  onChange={onChange}
                  className="w-full cursor-pointer bg-transparent focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Vai trò
              </label>
              <select
                name="role"
                value={formData.role || "user"}
                onChange={onChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {!isEditing && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mật khẩu mặc định
              </label>
              <input
                type="password"
                name="password"
                minLength={6}
                value={formData.password || ""}
                onChange={onChange}
                placeholder="Nhập mật khẩu tối thiểu 6 ký tự"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700"
            >
              {isEditing ? "Lưu thay đổi" : "Tạo người dùng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

