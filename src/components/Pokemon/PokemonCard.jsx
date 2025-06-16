import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTypeColor } from '../../utils/pokemonTypes';

const PokemonCard = ({ pokemon }) => {
  if (!pokemon) return null;

  const { id, name, types, sprites } = pokemon;
  const mainType = types[0];
  const formattedId = String(id).padStart(3, '0');
  const imageUrl = sprites.other['official-artwork'].front_default || sprites.front_default;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="w-full max-w-xs"
    >
      <Link 
        to={`/pokemon/${name}`}
        className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:shadow-xl"
      >
        <div 
          className="p-4 relative"
          style={{
            background: `linear-gradient(45deg, ${getTypeColor(mainType)}66, ${getTypeColor(mainType)}33)`
          }}
        >
          <span className="absolute top-2 right-2 text-white opacity-50 font-game text-sm">
            #{formattedId}
          </span>
          
          <div className="relative pt-[100%]">
            {imageUrl && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={imageUrl}
                alt={name}
                className="absolute inset-0 w-full h-full object-contain"
                loading="lazy"
              />
            )}
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-white capitalize text-center font-game text-sm mb-2">
            {name}
          </h2>
          
          <div className="flex justify-center gap-2">
            {types.map(type => (
              <span
                key={type}
                className="px-2 py-1 rounded-full text-white text-xs font-game capitalize"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PokemonCard;