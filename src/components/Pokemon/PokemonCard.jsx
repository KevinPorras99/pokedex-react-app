import React from 'react';
import { Link } from 'react-router-dom';

const PokemonCard = ({ pokemon }) => {
  const id = pokemon.url.split('/')[6];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <Link to={`/pokemon/${pokemon.name}`} className="pokemon-card pixel-border">
      <img src={imageUrl} alt={pokemon.name} />
      <h2>{pokemon.name}</h2>
      <p className="text-center text-gray-500">#{id.padStart(3, '0')}</p>
    </Link>
  );
};

export default PokemonCard;