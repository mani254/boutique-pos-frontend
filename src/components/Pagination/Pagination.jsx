import React from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";

const Pagination = ({ currentPage, setCurrentPage, total }) => {
  const totalPages = Math.ceil(parseInt(total) / 10);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPages10 = () => {
    if (currentPage + 10 <= totalPages) {
      setCurrentPage(currentPage + 10);
    } else {
      setCurrentPage(totalPages);
    }
  };

  const handlePrevPages10 = () => {
    if (currentPage - 10 >= 1) {
      setCurrentPage(currentPage - 10);
    } else {
      setCurrentPage(1);
    }
  };

  return (
    <div className="mt-4 flex items-center justify-center">
      <div className="flex">
        <button onClick={handlePrevPages10} disabled={currentPage <= 10}>
          <FaAnglesLeft />
        </button>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          <FaAngleLeft />
        </button>
        <p className="mx-2">
          Page {currentPage} of {totalPages}
        </p>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          <FaAngleRight />
        </button>
        <button
          onClick={handleNextPages10}
          disabled={currentPage + 10 > totalPages}
        >
          <FaAnglesRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
