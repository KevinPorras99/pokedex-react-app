import React from 'react';

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <div className="mb-6 flex justify-center">
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder="Search Pokémon by name..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border dark:bg-white-700 dark:text-black font-game text-sm pr-8"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearch('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg font-bold focus:outline-none"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;