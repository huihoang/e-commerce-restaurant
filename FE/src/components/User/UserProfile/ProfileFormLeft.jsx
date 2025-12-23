const ProfileFormLeft = ({ formData, user, role, isEditing, onChange }) => {
  const isStaff = role === "staff";
  const fullNameLabel = isStaff ? "Tên nhân viên" : "Tên người dùng";
  const fullNamePlaceholder = isStaff ? "Nhập tên nhân viên" : "Nhập tên người dùng";

  return (
    <div className="space-y-6">
      {/* Username Field */}
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          👤 Tên đăng nhập
        </label>
        {isEditing ? (
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Nhập tên đăng nhập"
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-900 font-medium">{user.username}</p>
          </div>
        )}
      </div>

      {/* Full Name Field */}
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          🆔 {fullNameLabel}
        </label>
        {isEditing ? (
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder={fullNamePlaceholder}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-900 font-medium">
              {user.fullName || "Chưa cập nhật"}
            </p>
          </div>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          📧 Email
        </label>
        {isEditing ? (
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Nhập email"
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-900 font-medium">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFormLeft;


