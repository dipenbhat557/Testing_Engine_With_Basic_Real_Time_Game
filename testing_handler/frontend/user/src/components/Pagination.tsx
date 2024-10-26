import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center gap-3">
      <button
        className="w-[100px] border rounded-xl disabled:bg-slate-700 disabled:bg-opacity-30"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="p-2">{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        className="w-[100px] border rounded-xl disabled:bg-slate-700 disabled:bg-opacity-30"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
