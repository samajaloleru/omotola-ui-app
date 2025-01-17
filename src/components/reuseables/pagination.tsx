import React, { useState } from 'react';

type PaginationData={
    currentPage: number,
    pageSize: number,
    dataLength: number,
    totalPages: number,
    onPageChange: (newValue: number) => void,
    onPageSizeChange: (newValue: number) => void,
}

const Pagination = ({ currentPage, totalPages, dataLength, pageSize, onPageChange, onPageSizeChange }: PaginationData) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className='flex flex-col gap-10 justify-center w-full'>
      <div className='flex flex-row items-center justify-center text-white gap-3'>
        <div className=''>
          Showing {dataLength} out of {pageSize}
        </div>
        <div className='border-white text-white relative w-[4rem] gap-3 h-8 flex flex-row items-center justify-center border'>
          {pageSize}
          <i onClick={() => setIsDropdown(!isDropdown)} className="fi fi-rr-angle-small-down mb-[-.3rem]"></i>

          <div className={`${isDropdown ? '' : 'hidden' } absolute mt-[8rem] border-white border w-full items-center flex flex-col`}>
            <span className='cursor-pointer' onClick={()=> [onPageSizeChange(10), setIsDropdown(!isDropdown)]} >10</span>
            <span className='cursor-pointer' onClick={()=> [onPageSizeChange(20), setIsDropdown(!isDropdown)]} >20</span>
            <span className='cursor-pointer' onClick={()=> [onPageSizeChange(30), setIsDropdown(!isDropdown)]} >30</span>
            <span className='cursor-pointer' onClick={()=> [onPageSizeChange(40), setIsDropdown(!isDropdown)]} >40</span>
          </div>
        </div>
      </div>

      <div className='flex flex-row justify-center gap-4 w-full'>
        <div onClick={() => onPageChange(currentPage-1)} className={`${currentPage === 1 ? 'hidden' : '' } border-white text-white w-8 h-8 flex flex-col items-center justify-center border`}>
          <i className="fi fi-rr-angle-small-left mb-[-.3rem]"></i>
        </div>
        {pages.map((page) => (
          <button className='border-white text-white w-8 h-8 border' key={page} onClick={() => onPageChange(page)} disabled={page === currentPage}>
            {page}
          </button>
        ))}
        <div onClick={() => onPageChange(currentPage+1)} className={`${currentPage === totalPages ? 'hidden' : '' } border-white text-white w-8 h-8 flex flex-col items-center justify-center border`}>
          <i className="fi fi-rr-angle-small-right mb-[-.3rem]"></i>
        </div>
      </div>
    </div>
  );
};

export default Pagination;