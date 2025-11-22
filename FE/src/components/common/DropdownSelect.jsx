import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

const DropdownSelect = (props) => {
  const {
    options,
    value,
    onChange,
    placeholder = "Chọn",
    className = "",
  } = props;

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/80">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-4 py-3 text-sm font-medium transition ${
                  isSelected
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

DropdownSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default DropdownSelect;

