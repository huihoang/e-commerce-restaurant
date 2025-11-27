import DropdownSelect from "@/components/common/DropdownSelect";

const BlogFilters = ({
  searchTerm,
  onSearchChange,
  categoryOptions,
  categoryFilter,
  onCategoryChange,
  sortOption,
  onSortChange,
}) => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm bài theo tiêu đề hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-purple-500 focus:outline-none"
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>
          </div>
          <DropdownSelect
            options={categoryOptions}
            value={categoryFilter}
            onChange={onCategoryChange}
            placeholder="Danh mục"
            className="w-full sm:w-48"
          />
        </div>
        <div className="w-full lg:w-52">
          <DropdownSelect
            options={sortOption.options}
            value={sortOption.value}
            onChange={sortOption.onChange}
            placeholder="Sắp xếp"
          />
        </div>
      </div>
    </div>
  );
};

export default BlogFilters;


