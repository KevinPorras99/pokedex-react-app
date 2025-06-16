import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PokemonList from '../components/Pokemon/PokemonList';
import SearchBar from '../components/UI/SearchBar';
import FilterBar from '../components/UI/FilterBar';
import api from '../services/api';
import backgroundImage from '../assets/background.png';

const MAX_POKEMON_ID = 1302;
const BATCH_SIZE = 50;

const PokedexPage = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    sessionStorage.getItem('pokedexSearchTerm') || ''
  );
  const [selectedTypes, setSelectedTypes] = useState(
    JSON.parse(sessionStorage.getItem('pokedexSelectedTypes')) || []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(
    sessionStorage.getItem('pokedexSortBy') || 'id'
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(sessionStorage.getItem('pokedexPage')) || 1
  );

  // Define filterAndSortPokemon before using it
  const filterAndSortPokemon = (term, types, sort, data) => {
    let filtered = [...(data || pokemonData)];

    if (term?.trim()) {
      filtered = filtered.filter(pokemon =>
        pokemon?.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (types.length > 0) {
      filtered = filtered.filter(pokemon =>
        pokemon && types.every(type => pokemon.types.includes(type))
      );
    }

    filtered.sort((a, b) => {
      if (sort === 'name') return a?.name.localeCompare(b?.name);
      return (a?.id || 0) - (b?.id || 0);
    });

    setFilteredPokemon(filtered);
  };

  useEffect(() => {
    sessionStorage.setItem('pokedexPage', currentPage.toString());
    sessionStorage.setItem('pokedexSearchTerm', searchTerm);
    sessionStorage.setItem('pokedexSelectedTypes', JSON.stringify(selectedTypes));
    sessionStorage.setItem('pokedexSortBy', sortBy);
  }, [currentPage, searchTerm, selectedTypes, sortBy]);

  useEffect(() => {
  const loadAllPokemon = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get initial list of all Pokémon
      const allData = await api.getAllPokemon(MAX_POKEMON_ID, 0);
      console.log(`Found ${allData.results.length} Pokémon to load`);

      let loadedPokemon = [];
      for (const pokemon of allData.results) {
        try {
          const details = await api.getPokemonByName(pokemon.name);
          if (details) {
            const processedPokemon = {
              id: details.id,
              name: details.name,
              types: details.types.map(t => t.type.name),
              sprites: {
                front_default: details.sprites.front_default,
                other: {
                  'official-artwork': {
                    front_default: details.sprites.other?.['official-artwork']?.front_default
                  }
                }
              }
            };

            loadedPokemon.push(processedPokemon);
            
            // Sort and update state every 10 Pokémon
            if (loadedPokemon.length % 10 === 0) {
              const sortedPokemon = [...loadedPokemon].sort((a, b) => a.id - b.id);
              setPokemonData(sortedPokemon);
              filterAndSortPokemon(searchTerm, selectedTypes, sortBy, sortedPokemon);
              
              const progress = Math.round((loadedPokemon.length / allData.results.length) * 100);
              console.log(`Progress: ${progress}% (${loadedPokemon.length}/${allData.results.length})`);
            }
          }
        } catch (error) {
          console.error(`Failed to load ${pokemon.name}:`, error);
          continue;
        }
      }

      // Final update with all loaded Pokémon
      const finalPokemon = [...loadedPokemon].sort((a, b) => a.id - b.id);
      setPokemonData(finalPokemon);
      filterAndSortPokemon(searchTerm, selectedTypes, sortBy, finalPokemon);
      setLoading(false);

    } catch (error) {
      console.error('Error loading Pokémon:', error);
      setError('Error loading Pokémon. Please try again.');
      setLoading(false);
    }
  };

  loadAllPokemon();
}, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterAndSortPokemon(term, selectedTypes, sortBy);
    setCurrentPage(1);
  };

  const handleTypeChange = (types) => {
    setSelectedTypes(types);
    filterAndSortPokemon(searchTerm, types, sortBy);
    setCurrentPage(1);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    filterAndSortPokemon(searchTerm, selectedTypes, sortType);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`
        }}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center pt-20 font-game text-white text-sm"
        >
          Loading Pokédex...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`
        }}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center pt-20 font-game text-red-500 text-sm"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`
      }}
    >
      <div className="container mx-auto px-4 py-8 font-game">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 text-center text-white"
        >
          Pokédex
        </motion.h1>
        
        <div className="space-y-6 mb-8">
          <SearchBar 
            searchTerm={searchTerm}
            onSearch={handleSearch}
            placeholder="Search Pokémon by name..."
          />
          
          <FilterBar
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
          />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-3"
          >
            <button
              onClick={() => handleSort('id')}
              className={`px-4 py-2 rounded-full text-xs transition-all ${
                sortBy === 'id' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Sort by ID
            </button>
            <button
              onClick={() => handleSort('name')}
              className={`px-4 py-2 rounded-full text-xs transition-all ${
                sortBy === 'name' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Sort by Name
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6 text-white text-sm"
        >
          Showing {filteredPokemon.length} Pokémon
          {selectedTypes.length > 0 && ` of types ${selectedTypes.join(' & ')}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </motion.div>

        {filteredPokemon.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8 text-white text-sm"
          >
            No Pokémon found matching your criteria
          </motion.div>
        ) : (
          <PokemonList 
            pokemonData={filteredPokemon}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            itemsPerPage={20}
            totalItems={filteredPokemon.length}
          />
        )}
      </div>
    </div>
  );
};

export default PokedexPage;