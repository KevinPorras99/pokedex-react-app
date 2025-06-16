import React from 'react';
import { motion } from 'framer-motion';
import PokemonCard from './PokemonCard';

const PokemonList = ({ 
  pokemonData, 
  currentPage, 
  onPageChange, 
  itemsPerPage, 
  totalItems 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPokemon = pokemonData.slice(startIndex, endIndex);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {currentPokemon.map(pokemon => (
          <motion.div
            key={pokemon?.id || Math.random()}
            variants={itemVariants}
            className="flex justify-center"
          >
            {pokemon && <PokemonCard pokemon={pokemon} />}
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          First
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          <span className="text-white font-game">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default PokemonList;