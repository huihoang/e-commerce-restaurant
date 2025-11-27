import { useMemo } from "react";

const TableSelectionGrid = ({
  tables = [],
  selectedValue,
  onSelect,
  getValue = (table) => table._id ?? table.number?.toString(),
  getLabel = (table) => table.name || `Bàn ${table.number}`,
  getSubLabel = (table) =>
    `${table.capacity || 0} người${
      table.location ? ` • ${table.location}` : ""
    }`,
  groupBy = (table) => table.location || "Khu vực khác",
  icon = "🪑",
  className = "",
  gridClassName = "grid grid-cols-2 md:grid-cols-4 gap-3",
}) => {
  const groupedTables = useMemo(() => {
    return tables.reduce((acc, table) => {
      const group = groupBy(table) || "Khu vực khác";
      if (!acc[group]) acc[group] = [];
      acc[group].push(table);
      return acc;
    }, {});
  }, [tables, groupBy]);

  return (
    <div
      className={`space-y-4 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white/80 p-3 ${className}`}
    >
      {Object.entries(groupedTables).map(([group, groupTables]) => (
        <div key={group}>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            {group}
          </h4>
          <div className={gridClassName}>
            {groupTables.map((table) => {
              const value = getValue(table);
              const selected =
                value?.toString() === selectedValue?.toString();
              return (
                <button
                  key={table._id || table.number}
                  type="button"
                  onClick={() => onSelect(value, table)}
                  className={`flex flex-col items-center justify-center rounded-xl border px-3 py-3 text-center text-sm transition ${
                    selected
                      ? "border-emerald-500 bg-emerald-50 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1 font-semibold text-slate-800 text-base">
                    <span role="img" aria-label="table">
                      {icon}
                    </span>
                    {getLabel(table)}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    {getSubLabel(table)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableSelectionGrid;


