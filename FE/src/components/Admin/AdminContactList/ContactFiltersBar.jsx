import DropdownSelect from "@/components/common/DropdownSelect";

const ContactFiltersBar = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  categoryOptions,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Tìm theo tên, email hoặc nội dung..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-cyan-500 focus:outline-none"
        />
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
          🔍
        </span>
      </div>
      <DropdownSelect
        options={categoryOptions}
        value={categoryFilter}
        onChange={onCategoryChange}
        placeholder="Chọn chủ đề"
        className="w-full lg:w-60"
      />
    </div>
  );
};

export default ContactFiltersBar;

