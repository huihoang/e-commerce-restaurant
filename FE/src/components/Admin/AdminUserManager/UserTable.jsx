const UserTable = ({ users, roleBadges, roleLabels, onEdit, onDelete }) => {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm text-slate-700">
          <thead>
            <tr className="bg-slate-50 text-slate-900">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                Người dùng
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                Email
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                Họ tên
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                Số điện thoại
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                Ngày sinh
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest">
                Vai trò
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-widest">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-6 text-center text-sm text-slate-500">
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`border-t border-slate-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                }`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white">
                      {user.username?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{user.username}</p>
                      <p className="text-xs text-slate-500">ID: {user._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-slate-700">{user.email}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-slate-700">
                    {user.fullName || "Chưa cập nhật"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-slate-700">
                    {user.phone || "Chưa cập nhật"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-slate-700">
                    {user.birthday
                      ? new Date(user.birthday).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      roleBadges[user.role] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {roleLabels[user.role] || "Không xác định"}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  <div className="flex items-center justify-center gap-3 whitespace-nowrap text-sm font-semibold">
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-4 py-2 text-blue-600 transition hover:bg-blue-500/20"
                    >
                      ✏️ <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => onDelete(user._id)}
                      className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-4 py-2 text-rose-600 transition hover:bg-rose-500/20"
                    >
                      🗑 <span>Xóa</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;

