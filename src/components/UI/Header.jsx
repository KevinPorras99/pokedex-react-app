import React from 'react';
import { motion } from 'framer-motion';
import pokemonLogo from '../../assets/pokemon-logo.png';

const Header = () => {
  return (
    <motion.header
      transition={{ type: "spring", stiffness: 120 }}
      className="w-full bg-gradient-to-b from-black via-gray-800 to-gray-900/50 backdrop-blur-sm text-white shadow-lg z-50"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-48 md:w-56 flex items-center">
            <img 
              src={pokemonLogo} 
              alt="Pokemon Logo" 
              className="w-full h-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        
        <nav className="flex gap-4">
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://github.com/KevinPorras99/pokedex-react-app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-game text-sm hover:text-gray-200 transition-colors"
          >
            GitHub
          </motion.a>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;