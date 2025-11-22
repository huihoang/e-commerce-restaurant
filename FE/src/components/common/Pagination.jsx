import PropTypes from "prop-types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  maxVisible = 5,
}) => {
  if (totalPages <= 1) return null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const getPages = () => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const pages = [1];
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push("left-ellipsis");
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (end < totalPages - 1) {
      pages.push("right-ellipsis");
    }

    pages.push(totalPages);
    return pages;
  };

  const pages = getPages();

  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-3xl border border-slate-100 bg-white px-5 py-4 shadow-md shadow-slate-200/60 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
        >
          ← Trước
        </button>
        <div className="flex items-center gap-1 rounded-full bg-slate-50/80 px-2 py-1">
          {pages.map((page, idx) =>
            typeof page === "string" ? (
              <span key={`${page}-${idx}`} className="px-2 text-sm text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`h-9 w-9 rounded-full text-sm font-semibold transition ${
                  page === currentPage
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-600 hover:bg-white hover:shadow"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
        >
          Sau →
        </button>
      </div>
      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
        Trang {currentPage} / {totalPages}
      </span>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  maxVisible: PropTypes.number,
};

export default Pagination;

