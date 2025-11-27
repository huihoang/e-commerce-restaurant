import DropdownSelect from "@/components/common/DropdownSelect";

const CategoryFilters = ({
  searchTerm,
  onSearchChange,
  statusOptions,
  statusFilter,
  onStatusChange,
}) => {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-purple-500 focus:outline-none"
          />
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
            🔍
          </span>
        </div>
        <DropdownSelect
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusChange}
          placeholder="Trạng thái"
          className="w-full lg:w-48"
        />
      </div>
    </section>
  );
};

export default CategoryFilters;


