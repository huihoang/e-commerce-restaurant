import DropdownSelect from "@/components/common/DropdownSelect";

const BookingFilters = ({
  searchTerm,
  onSearchChange,
  paymentFilter,
  onPaymentFilterChange,
  sortBy,
  onSortChange,
  paymentFilterOptions,
  sortOptions,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên, SĐT, ghi chú..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>
      <div className="w-full md:w-48">
        <DropdownSelect
          options={paymentFilterOptions}
          value={paymentFilter}
          onChange={onPaymentFilterChange}
          placeholder="Lọc thanh toán"
          className="w-full"
        />
      </div>
      <div className="w-full md:w-48">
        <DropdownSelect
          options={sortOptions}
          value={sortBy}
          onChange={onSortChange}
          placeholder="Sắp xếp"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default BookingFilters;

