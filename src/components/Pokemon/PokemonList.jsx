import React from 'react';
import { motion } from 'framer-motion';
import PokemonCard from './PokemonCard';
import Pagination from '../UI/Pagination';

const PokemonList = ({ pokemonData = [], currentPage, onPageChange }) => {
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(pokemonData.length / ITEMS_PER_PAGE);
  
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = pokemonData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          onPrevious={() => onPageChange(Math.max(currentPage - 1, 1))}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {currentItems.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          onPrevious={() => onPageChange(Math.max(currentPage - 1, 1))}
        />
      )}
    </motion.div>
  );
};

export default PokemonList;