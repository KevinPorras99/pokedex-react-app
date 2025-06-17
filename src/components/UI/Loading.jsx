import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingDots = () => {
  return (
    <div className="inline-flex gap-1 text-2xl"> {/* Increased dot size */}
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -4, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: dot * 0.2,
          }}
        >
          .
        </motion.span>
      ))}
    </div>
  );
};

const Loading = () => {
  const [rotations, setRotations] = useState(0);

  const handleClick = () => {
    setRotations(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        className="w-20 h-20 relative cursor-pointer"
        onClick={handleClick}
        animate={{ 
          rotate: rotations * 360 
        }}
        transition={{ 
          duration: 1,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="absolute w-full h-1/2 bg-red-600 rounded-t-full"></div>
        <div className="absolute w-full h-1/2 bottom-0 bg-white rounded-b-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-4 border-gray-800 z-10"></div>
        <div className="absolute top-1/2 w-full h-2 bg-gray-800 transform -translate-y-1/2"></div>
      </motion.div>

      <motion.div
        className="font-montserrat font-black text-white text-2xl flex items-center uppercase tracking-wider" // Increased to text-2xl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading Pokédex<LoadingDots />
      </motion.div>
      
      <motion.p
        className="font-montserrat font-bold text-gray-400 text-lg tracking-wide" // Increased to text-lg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Click the Pokéball to spin!
      </motion.p>
    </div>
  );
};

export default Loading;