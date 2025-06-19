import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { typeColors } from '../utils/typeColors';

const extractEvolutionChain = (chain) => {
  const evoChain = [];
  let currentPokemon = chain;
  while (currentPokemon) {
    evoChain.push({
      name: currentPokemon.species.name,
      evolution_details: currentPokemon.evolution_details[0]
    });
    currentPokemon = currentPokemon.evolves_to?.[0];
  }
  return evoChain;
};

const capitalize = str =>
  str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const PokemonDetailPage = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For forms/varieties
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  // Ref to avoid running form effect on initial mount or when changing Pokémon
  const prevNameRef = useRef();

  // Fetch Pokémon and all related data when 'name' changes (navigation or initial)
  useEffect(() => {
    let isMounted = true;
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Reset forms and selectedForm when changing Pokémon
        setForms([]);
        setSelectedForm(null);

        // Fetch base Pokémon data
        const pokemonData = await api.getPokemonByName(name);
        if (!pokemonData) throw new Error('Pokemon not found');
        if (!isMounted) return;
        setPokemon(pokemonData);

        // Fetch species data
        const speciesData = await api.getPokemonSpecies(name);
        if (speciesData) {
          setSpecies(speciesData);

          // Handle forms/varieties
          if (speciesData.varieties && speciesData.varieties.length > 1) {
            setForms(speciesData.varieties);
            // Set default selected form to the current one
            const defaultForm = speciesData.varieties.find(v => v.pokemon.name === name) || speciesData.varieties[0];
            setSelectedForm(defaultForm.pokemon);
          }

          // Evolution chain
          if (speciesData.evolution_chain?.url) {
            const evolutionData = await api.getEvolutionChain(speciesData.evolution_chain.url);
            if (evolutionData?.chain) {
              const evolutionArray = extractEvolutionChain(evolutionData.chain);
              const evolutionWithDetails = await Promise.all(
                evolutionArray.map(async (evo) => {
                  const evoData = await api.getPokemonByName(evo.name);
                  return {
                    ...evo,
                    id: evoData?.id,
                    sprite: evoData?.sprites?.front_default,
                    official_artwork: evoData?.sprites?.other?.['official-artwork']?.front_default
                  };
                })
              );
              if (isMounted) setEvolutionChain(evolutionWithDetails.filter(evo => evo.id));
            }
          }
        }

        // Weaknesses
        const typeResponses = await Promise.all(
          pokemonData.types.map(t => api.getType(t.type.name))
        );
        const allWeaknesses = typeResponses.flatMap(
          t => t.damage_relations.double_damage_from.map(dt => dt.name)
        );
        if (isMounted) setWeaknesses([...new Set(allWeaknesses)]);
      } catch (error) {
        if (isMounted) setError('Failed to load Pokémon details');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPokemonDetails();
    prevNameRef.current = name;
    return () => { isMounted = false; };
  }, [name]);

  // Fetch data for selected form (but only if it is different from the current Pokémon)
  useEffect(() => {
    if (!selectedForm) return;
    let isMounted = true;
    const fetchFormData = async () => {
      setLoading(true);
      try {
        const formData = await api.getPokemonByName(selectedForm.name);
        if (isMounted) setPokemon(formData);
      } catch {
        // fallback: do nothing
      }
      if (isMounted) setLoading(false);
    };
    fetchFormData();
    return () => { isMounted = false; };
  }, [selectedForm]);

  const getEnglishDescription = () => {
    if (!species) return '';
    const englishFlavorText = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishFlavorText ? englishFlavorText.flavor_text.replace(/\f/g, ' ') : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center font-game text-white text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center font-game text-red-500">
          {error || 'Pokemon not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-gradient-slow">
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Link 
            to="/" 
            className="inline-block mb-6 text-white hover:text-gray-200 font-game text-sm"
          >
            &larr; Back to Pokédex
          </Link>

          {/* Grid layout: main card on top, stats/details below */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Info Card - spans both columns on desktop */}
            <div className="bg-white rounded-lg shadow-lg p-6 pixel-border col-span-1 md:col-span-2 flex flex-col items-center">
              {/* Dropdown for forms (centered above the image) */}
              {forms.length > 1 && (
                <div className="w-full max-w-xs mb-4 flex flex-col items-center">
                  <label className="block mb-2 font-game text-gray-700 text-center text-base capitalize">
                    Select Form
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded font-game text-base capitalize text-center"
                    value={selectedForm?.name || name}
                    onChange={e => {
                      const form = forms.find(f => f.pokemon.name === e.target.value);
                      setSelectedForm(form.pokemon);
                    }}
                  >
                    {forms.map(form => (
                      <option key={form.pokemon.name} value={form.pokemon.name}>
                        {capitalize(form.pokemon.name)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pokemon Image */}
              <motion.div 
                className="flex flex-col md:flex-row items-center w-full"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <img 
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="mx-auto w-72 h-72"
                />
              </motion.div>
              <motion.div 
                className="text-center w-full mt-6 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-2xl font-bold mt-4 font-game">
                  {capitalize(pokemon.name)}
                </h1>
                <div className="flex justify-center gap-2 mt-2">
                  {pokemon.types.map(type => (
                    <span 
                      key={type.type.name}
                      className={`px-3 py-1 rounded-full text-sm text-white font-game ${typeColors[type.type.name] || 'bg-gray-500'}`}
                    >
                      {capitalize(type.type.name)}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 italic font-game text-sm mt-4">
                  {getEnglishDescription()}
                </p>
              </motion.div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 pixel-border col-span-1">
              <h2 className="text-xl font-bold mb-4 font-game text-center">Stats</h2>
              <div className="space-y-3">
                {pokemon.stats.map((stat, index) => (
                  <div key={stat.stat.name} className="flex flex-col">
                    <div className="flex justify-between font-game text-sm mb-1">
                      <span className="capitalize">{capitalize(stat.stat.name)}</span>
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
                  </div>
                ))}
              </div>
            </div>

            {/* Details & Abilities Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 pixel-border col-span-1">
              <h2 className="text-xl font-bold mb-4 font-game text-center">Details & Abilities</h2>
              <div className="font-game text-sm space-y-2">
                <p>
                  <span className="font-bold">Height:</span> {pokemon.height / 10} m
                </p>
                <p>
                  <span className="font-bold">Weight:</span> {pokemon.weight / 10} kg
                </p>
                <div>
                  <h3 className="font-bold mt-4">Abilities:</h3>
                  <ul className="space-y-1">
                    {pokemon.abilities.map((ability, index) => (
                      <li 
                        key={ability.ability.name} 
                        className="capitalize"
                      >
                        {capitalize(ability.ability.name)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mt-4">Weaknesses:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {weaknesses.length === 0
                      ? <span className="text-gray-500 text-xs font-game">None</span>
                      : weaknesses.map(type => (
                          <span
                            key={type}
                            className={`px-3 py-1 rounded-full text-xs text-white font-game ${typeColors[type] || 'bg-gray-500'}`}
                          >
                            {capitalize(type)}
                          </span>
                        ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evolution Chain */}
          {evolutionChain.length > 1 && (
            <motion.div 
              className="mt-12 mb-8 px-4 py-8 rounded-xl shadow-2xl bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-200 border-4 border-yellow-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <h2 className="text-2xl font-bold mb-6 font-game text-yellow-700 text-center drop-shadow-lg tracking-wider uppercase">
                Evolution Chain
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {evolutionChain.map((evo, index) => (
                  <React.Fragment key={evo.name}>
                    <div className="flex flex-col items-center">
                      <Link
                        to={`/pokemon/${evo.name}`}
                        className={`text-center transition-transform hover:scale-110 ${
                          evo.name === pokemon.name ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={evo.official_artwork || evo.sprite}
                          alt={evo.name}
                          className="w-28 h-28 mx-auto drop-shadow-lg"
                        />
                        <span className="font-game text-base capitalize block mt-2 text-yellow-800">{capitalize(evo.name)}</span>
                      </Link>
                    </div>
                    {/* Show arrow and evolution condition if not last */}
                    {index < evolutionChain.length - 1 && (
                      <div className="flex flex-col items-center mx-4">
                        <span className="text-3xl font-bold font-game text-yellow-600">→</span>
                        {/* Evolution condition */}
                        {evolutionChain[index + 1].evolution_details && (
                          <div className="text-xs text-gray-700 font-game text-center mt-1 max-w-[140px]">
                            {(() => {
                              const details = evolutionChain[index + 1].evolution_details;
                              if (!details) return null;
                              if (details.item) {
                                return (
                                  <>
                                    Evolves using{' '}
                                    <span className="capitalize font-bold">{capitalize(details.item.name)}</span>
                                  </>
                                );
                              }
                              if (details.trigger?.name === 'level-up' && details.min_level) {
                                return <>Level {details.min_level}</>;
                              }
                              if (details.trigger?.name === 'trade') {
                                return <>By trading</>;
                              }
                              if (details.trigger?.name === 'use-item' && details.item) {
                                return (
                                  <>
                                    Use{' '}
                                    <span className="capitalize font-bold">{capitalize(details.item.name)}</span>
                                  </>
                                );
                              }
                              // Add more conditions as needed
                              return (
                                <span>
                                  {details.trigger?.name
                                    ? `Condition: ${capitalize(details.trigger.name)}`
                                    : 'Special condition'}
                                </span>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;