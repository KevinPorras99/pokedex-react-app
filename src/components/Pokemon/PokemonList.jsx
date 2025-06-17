import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PokemonCard from './PokemonCard';
import Pagination from '../UI/Pagination';

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

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentPage}
          {...pageTransition}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8"
        >
          {currentPokemon.map((pokemon, index) => (
            <motion.div
              key={pokemon.id}
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.05 }
              }}
            >
              <PokemonCard pokemon={pokemon} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default PokemonList;