import React from 'react';

const PokemonStats = ({ stats }) => {
  return (
    <div className="pokemon-stats">
      <h2 className="text-lg font-bold">Stats</h2>
      <ul className="list-disc pl-5">
        {stats.map((stat) => (
          <li key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonStats;