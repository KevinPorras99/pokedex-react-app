import React from 'react';
import { typeColors } from '../../utils/typeColors';

const FilterBar = ({ selectedType, onTypeChange }) => {
  const types = Object.keys(typeColors);

  return (
    <div className="mb-6 px-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => onTypeChange('')}
          className={`px-4 py-2 rounded-full font-game text-xs transition-all ${
            selectedType === '' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Types
        </button>
        {types.map(type => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`px-4 py-2 rounded-full font-game text-xs transition-all ${
              selectedType === type
                ? `${typeColors[type]} text-white`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;