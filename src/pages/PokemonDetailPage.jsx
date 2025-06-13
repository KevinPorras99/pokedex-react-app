import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { typeColors } from '../utils/typeColors';


const PokemonDetailPage = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch basic data and species in parallel
        const [pokemonData, speciesData] = await Promise.all([
          api.getPokemonByName(name),
          api.getPokemonSpecies(name)
        ]);

        // Fetch evolution chain
        const evolutionData = await api.getEvolutionChain(speciesData.evolution_chain.url);
        const chain = [];
        let current = evolutionData.chain;

        // Process evolution chain and fetch IDs for each evolution
        const processEvolution = async (evolution) => {
          const pokemonName = evolution.species.name;
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
          const data = await response.json();
          
          return {
            name: pokemonName,
            id: data.id,
            min_level: evolution.evolution_details[0]?.min_level || null
          };
        };

        // Build evolution chain with IDs
        while (current) {
          const evolutionData = await processEvolution(current);
          chain.push(evolutionData);
          current = current.evolves_to[0] || null;
        }

        setPokemon(pokemonData);
        setSpecies(speciesData);
        setEvolutionChain(chain);
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching Pokémon details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [name]);

  const getEnglishDescription = () => {
    if (!species) return '';
    const englishFlavorText = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishFlavorText ? englishFlavorText.flavor_text.replace(/\f/g, ' ') : '';
  };

  if (loading) return <div className="text-center mt-8 font-game text-white text-sm">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500 font-game text-sm">{error}</div>;
  if (!pokemon || !species) return <div className="text-center mt-8 font-game text-white text-sm">Pokémon not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <Link to="/" className="inline-block mb-6 text-white hover:text-gray-200 font-game text-sm">
        &larr; Back to Pokédex
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg p-6 pixel-border">
        <motion.div 
          className="text-center"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img 
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="mx-auto w-64 h-64"
          />
          <h1 className="text-2xl font-bold capitalize mt-4 font-game">{pokemon.name}</h1>
          <div className="flex justify-center gap-2 mt-2">
            {pokemon.types.map(type => (
              <span 
                key={type.type.name}
                className={`px-3 py-1 rounded-full text-sm text-white font-game ${typeColors[type.type.name] || 'bg-gray-500'}`}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="mt-6 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-700 italic font-game text-sm">
            {getEnglishDescription()}
          </p>
        </motion.div>

        <motion.div 
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <h2 className="text-xl font-bold mb-2 font-game">Stats</h2>
            {pokemon.stats.map((stat, index) => (
              <motion.div 
                key={stat.stat.name} 
                className="mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex justify-between font-game text-sm">
                  <span className="capitalize">{stat.stat.name}</span>
                  <span>{stat.base_stat}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div 
                    className={`${typeColors[pokemon.types[0].type.name]} h-2.5 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-2 font-game">Details</h2>
            <div className="font-game text-sm space-y-2">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Height: {pokemon.height / 10}m
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Weight: {pokemon.weight / 10}kg
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="font-bold mt-4">Abilities:</h3>
                <ul className="space-y-1">
                  {pokemon.abilities.map((ability, index) => (
                    <motion.li 
                      key={ability.ability.name} 
                      className="capitalize"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      {ability.ability.name}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {evolutionChain.length > 1 && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h2 className="text-xl font-bold mb-4 font-game text-center">Evolution Chain</h2>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {evolutionChain.map((evo, index) => (
                <div key={evo.name} className="flex items-center">
                  <Link
                    to={`/pokemon/${evo.name}`}
                    className={`text-center transition-transform hover:scale-105 ${
                      evo.name === pokemon.name ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                      alt={evo.name}
                      className="w-20 h-20 mx-auto"
                    />
                    <span className="font-game text-xs capitalize">{evo.name}</span>
                    {evo.min_level && (
                      <span className="block text-xs text-gray-500 font-game">
                        Level {evo.min_level}
                      </span>
                    )}
                  </Link>
                  {index < evolutionChain.length - 1 && (
                    <span className="mx-2 font-bold font-game">→</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PokemonDetailPage;