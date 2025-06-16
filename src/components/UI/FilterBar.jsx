import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { typeColors } from '../../utils/typeColors';
import Modal from './Modal';

const FilterBar = ({ selectedTypes, onTypeChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedTypes, setTempSelectedTypes] = useState(selectedTypes);
  const types = Object.keys(typeColors);

  const handleTypeToggle = (type) => {
    setTempSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  const handleApplyFilters = () => {
    onTypeChange(tempSelectedTypes);
    setIsModalOpen(false);
  };

  const handleClearFilters = () => {
    setTempSelectedTypes([]);
    onTypeChange([]);
    setIsModalOpen(false);
  };

  return (
    <div className="mb-4 flex justify-center">
      <button
        onClick={() => {
          setTempSelectedTypes(selectedTypes);
          setIsModalOpen(true);
        }}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg font-game text-sm hover:bg-blue-600 transition-colors"
      >
        {selectedTypes.length > 0 
          ? `Types: ${selectedTypes.length} selected` 
          : 'Filter by Type'}
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-xl font-game text-center mb-4">Select Types</h2>
          
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2">
            {types.map(type => (
              <motion.button
                key={type}
                onClick={() => handleTypeToggle(type)}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full font-game text-xs transition-all ${
                  tempSelectedTypes.includes(type)
                    ? `${typeColors[type]} text-white`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-6 pt-4 border-t">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-game text-xs hover:bg-gray-300 transition-all"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded-full font-game text-xs hover:bg-blue-600 transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FilterBar;