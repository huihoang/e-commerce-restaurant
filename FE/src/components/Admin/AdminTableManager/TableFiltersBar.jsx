import DropdownSelect from "@/components/common/DropdownSelect";

const TableFiltersBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  statusOptions,
  onStatusFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Tìm kiếm theo số bàn, vị trí, mô tả..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-indigo-500 focus:outline-none"
        />
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
          🔍
        </span>
      </div>
      <div className="w-full lg:w-48">
        <DropdownSelect
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusFilterChange}
          placeholder="Lọc trạng thái"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default TableFiltersBar;

