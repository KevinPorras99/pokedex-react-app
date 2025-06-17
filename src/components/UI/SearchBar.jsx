import React from 'react';

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search Pokémon by name..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border dark:bg-white-700 dark:text-black font-game text-sm"
      />
    </div>
  );
};

export default SearchBar;