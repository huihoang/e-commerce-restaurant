import DropdownSelect from "@/components/common/DropdownSelect";

const UserFiltersBar = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  roleFilterOptions,
  onRoleFilterChange,
  onAddUser,
}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-blue-500 focus:outline-none"
          />
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
            🔍
          </span>
        </div>
        <DropdownSelect
          options={roleFilterOptions}
          value={roleFilter}
          onChange={onRoleFilterChange}
          placeholder="Chọn vai trò"
          className="w-full sm:w-48"
        />
      </div>
      <button
        onClick={onAddUser}
        className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50"
      >
        ➕ Thêm người dùng
      </button>
    </div>
  );
};

export default UserFiltersBar;

