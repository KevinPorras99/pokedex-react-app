import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PokemonList from '../components/Pokemon/PokemonList';
import SearchBar from '../components/UI/SearchBar';
import FilterBar from '../components/UI/FilterBar';
import api from '../services/api';
import backgroundImage from '../assets/background.png';

const PokedexPage = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    sessionStorage.getItem('pokedexSearchTerm') || ''
  );
  const [selectedType, setSelectedType] = useState(
    sessionStorage.getItem('pokedexSelectedType') || ''
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(
    sessionStorage.getItem('pokedexSortBy') || 'id'
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(sessionStorage.getItem('pokedexPage')) || 1
  );

  // Save states to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('pokedexPage', currentPage.toString());
    sessionStorage.setItem('pokedexSearchTerm', searchTerm);
    sessionStorage.setItem('pokedexSelectedType', selectedType);
    sessionStorage.setItem('pokedexSortBy', sortBy);
  }, [currentPage, searchTerm, selectedType, sortBy]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch initial list with limit of 151 for first generation
        const { results } = await api.getAllPokemon(1025, 0);
        
        // Fetch details in smaller batches to avoid rate limiting
        const detailedData = [];
        for (let i = 0; i < results.length; i += 20) {
          const batch = results.slice(i, i + 20);
          const batchData = await Promise.all(
            batch.map(async (pokemon) => {
              try {
                const details = await api.getPokemonByName(pokemon.name);
                return {
                  ...pokemon,
                  id: details.id,
                  types: details.types.map(t => t.type.name),
                  sprites: details.sprites
                };
              } catch (error) {
                console.error(`Error fetching ${pokemon.name}:`, error);
                return null;
              }
            })
          );
          detailedData.push(...batchData.filter(Boolean));
          
          // Update state progressively
          setPokemonData(prev => [...prev, ...batchData.filter(Boolean)]);
        }

        // Final sort and filter
        const sortedData = detailedData.sort((a, b) => a.id - b.id);
        setPokemonData(sortedData);
        filterAndSortPokemon(searchTerm, selectedType, sortBy, sortedData);
      } catch (error) {
        console.error('Error:', error);
        setError('Error loading Pokémon. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const filterAndSortPokemon = (term, type, sort, data = pokemonData) => {
    let filtered = [...data];

    if (term?.trim()) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (type) {
      filtered = filtered.filter(pokemon =>
        pokemon.types.includes(type)
      );
    }

    switch (sort) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'id':
        filtered.sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }

    setFilteredPokemon(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterAndSortPokemon(term, selectedType, sortBy);
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    filterAndSortPokemon(searchTerm, type, sortBy);
    setCurrentPage(1);
  };

  const handleSort = (sort) => {
    setSortBy(sort);
    filterAndSortPokemon(searchTerm, selectedType, sort);
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
            selectedType={selectedType}
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
          {selectedType && ` of type ${selectedType}`}
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
          />
        )}
      </div>
    </div>
  );
};

export default PokedexPage;