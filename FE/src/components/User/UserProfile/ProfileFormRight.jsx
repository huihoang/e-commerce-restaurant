const ProfileFormRight = ({ formData, user, roleLabel, isEditing, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Birthday Field */}
      <div>
        <label
          htmlFor="birthday"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          🎂 Ngày sinh nhật
        </label>
        {isEditing ? (
          <input
            id="birthday"
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 cursor-pointer"
            onClick={(e) => e.target.showPicker?.()}
            onFocus={(e) => e.target.showPicker?.()}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-900 font-medium">
              {user.birthday
                ? new Date(user.birthday).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"}
            </p>
          </div>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          📞 Số điện thoại
        </label>
        {isEditing ? (
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Nhập số điện thoại"
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-900 font-medium">
              {user.phone || "Chưa cập nhật"}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProfileFormRight;


