import React from 'react';
import { motion } from 'framer-motion';
// This component handles pagination for a list of items, allowing users to navigate through pages.

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center gap-2 my-4 flex-wrap"
    >
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-full text-xs transition-all font-game
          ${currentPage === 1 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        First
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-full text-xs transition-all font-game
          ${currentPage === 1 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        Previous
      </button>
      
      <span className="px-4 py-2 text-xs font-game text-white">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-full text-xs transition-all font-game
          ${currentPage === totalPages 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        Next
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-full text-xs transition-all font-game
          ${currentPage === totalPages 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        Last
      </button>
    </motion.div>
  );
};

export default Pagination;