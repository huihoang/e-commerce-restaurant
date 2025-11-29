import { useState } from "react";

const UserSettings = () => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    language: "vi",
  });

  const handleToggle = (field) => {
    setPreferences((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    setPreferences((prev) => ({ ...prev, language: value }));
  };

  return (
    <section className="bg-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Tuỳ chỉnh
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Cài đặt tài khoản
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Quản lý thông báo, ngôn ngữ hiển thị và các tuỳ chọn cá nhân khác.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Email thông báo
                  </h3>
                  <p className="text-sm text-slate-500">
                    Nhận thông tin về đơn đặt bàn và ưu đãi mới qua email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("emailNotifications")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    preferences.emailNotifications
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                      preferences.emailNotifications
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    SMS thông báo
                  </h3>
                  <p className="text-sm text-slate-500">
                    Cập nhật nhanh qua tin nhắn SMS (nếu đã xác thực số điện
                    thoại).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("smsNotifications")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    preferences.smsNotifications ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                      preferences.smsNotifications
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Ngôn ngữ hiển thị
                  </h3>
                  <p className="text-sm text-slate-500">
                    Chọn ngôn ngữ ưa thích cho giao diện người dùng.
                  </p>
                </div>
                <select
                  value={preferences.language}
                  onChange={handleSelect}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserSettings;

