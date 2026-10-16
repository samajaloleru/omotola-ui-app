import React, { useMemo } from 'react';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';

type PaginationData = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newValue: number) => void;
  onPageSizeChange: (newValue: number) => void;
};

const pageSizes = [10, 20, 30, 50, 100];

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationData) => {
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  // Page numbers with ellipsis (-1) when there are more than 5 pages
  const pages = useMemo(() => {
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pageNumbers: number[] = [];
    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - maxVisiblePages + 1));
    const endPage = startPage + maxVisiblePages - 1;

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push(-1);
    }
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push(-1);
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  }, [currentPage, totalPages]);

  const goTo = (page: number) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  const navButton = 'grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-sand hover:text-ink disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav aria-label="Pagination" className="flex w-full flex-col items-center justify-between gap-4 border-t border-line px-4 py-4 sm:flex-row sm:px-6">
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="tabular-nums">
          <span className="font-medium text-ink">{startIndex}–{endIndex}</span> of {totalItems}
        </span>
        <label className="flex items-center gap-2">
          <span className="sr-only sm:not-sr-only">Rows</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="cursor-pointer rounded-md border border-line bg-white px-2 py-1 text-ink outline-none focus:border-plum"
          >
            {pageSizes.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <button className={navButton} onClick={() => goTo(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page">
          <PiCaretLeftBold />
        </button>

        {pages.map((page, index) => page === -1 ? (
          <span key={`gap-${index}`} className="grid h-9 w-6 place-items-center text-muted">…</span>
        ) : (
          <button
            key={page}
            className={`h-9 min-w-[2.25rem] rounded-lg px-2 text-sm tabular-nums transition ${
              page === currentPage ? 'bg-plum font-medium text-white' : 'text-muted hover:bg-sand hover:text-ink'
            }`}
            onClick={() => goTo(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ))}

        <button className={navButton} onClick={() => goTo(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Next page">
          <PiCaretRightBold />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
