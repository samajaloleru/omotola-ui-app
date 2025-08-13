import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

type PaginationData = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number; // Add this
  onPageChange: (newValue: number) => void;
  onPageSizeChange: (newValue: number) => void;
};

const Pagination = ({ 
  currentPage, 
  totalPages,
  totalItems,
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}: PaginationData) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [pages, setPages] = useState<number[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  const pageSizes = [10, 20, 30, 50, 100];

  // Calculate start and end index for showing entries
  useEffect(() => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    setStartIndex(start);
    setEndIndex(end);
  }, [currentPage, pageSize, totalItems]);

  // Generate page numbers with smart truncation
  useEffect(() => {
    let pageNumbers: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push(-1);
        pageNumbers.push(totalPages);
      }
    }
    
    setPages(pageNumbers);
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page !== -1 && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    onPageSizeChange(size);
    setIsDropdown(false);
    onPageChange(1); // Reset to first page when changing page size
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full rounded-b-xl p-4 bg-primary text-white shadow-sm border border-gray-200 z-40">
      {/* Entries info and page size selector */}
      <div className="flex items-center mb-4 md:mb-0">
        <div className="text-xs md:text-sm text-gray-600 mr-4">
          Showing <span className="font-medium">{startIndex}</span> to{' '}
          <span className="font-medium">{endIndex}</span> of{' '}
          <span className="font-medium">{totalItems}</span> entries
        </div>
        
        <div className="relative">
          <div 
            className="flex items-center justify-between w-24 px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            onClick={() => setIsDropdown(!isDropdown)}
          >
            <span>{pageSize}</span>
            <FiChevronDown className={`transition-transform ${isDropdown ? 'rotate-180' : ''}`} />
          </div>
          
          {isDropdown && (
            <div className="absolute bottom-14 z-10 mt-1 w-full bg-black border border-gray-200 rounded-md shadow-lg">
              {pageSizes.map(size => (
                <div 
                  key={size}
                  className={`px-4 py-2 text-xs md:text-sm hover:bg-gray-100 cursor-pointer ${
                    pageSize === size ? 'bg-blue-50 text-blue-600 font-medium' : ''
                  }`}
                  onClick={() => handlePageSizeChange(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <button
          className={`p-2 rounded-md ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <FiChevronsLeft size={18} />
        </button>
        
        <button
          className={`p-2 rounded-md ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <FiChevronLeft size={18} />
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            className={`w-5 md:w-10 h-6 md:h-10 flex items-center justify-center rounded-md text-xs md:text-sm ${
              page === currentPage
                ? 'bg-gradient-to-r from-primary to-[#e67238] text-white font-medium'
                : page === -1
                ? 'cursor-default'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handlePageChange(page)}
            disabled={page === -1}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page === -1 ? '...' : page}
          </button>
        ))}
        
        <button
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <FiChevronRight size={18} />
        </button>
        
        <button
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          <FiChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;