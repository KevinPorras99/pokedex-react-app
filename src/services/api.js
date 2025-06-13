const BASE_URL = 'https://pokeapi.co/api/v2';

const api = {
  getAllPokemon: async (limit = 20, offset = 0) => {
    try {
      const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      return await response.json();
    } catch (error) {
      throw new Error('Error fetching Pokemon list');
    }
  },

  getPokemonId: async (name) => {
    try {
      const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error fetching Pokemon ID:', error);
      return null;
    }
  },

  getPokemonByName: async (name) => {
    try {
      const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
      return await response.json();
    } catch (error) {
      throw new Error('Error fetching Pokemon details');
    }
  },

  getPokemonSpecies: async (name) => {
    try {
      const response = await fetch(`${BASE_URL}/pokemon-species/${name.toLowerCase()}`);
      return await response.json();
    } catch (error) {
      throw new Error('Error fetching Pokemon species');
    }
  },

  getEvolutionChain: async (url) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw new Error('Error fetching evolution chain');
    }
  },

  getPokemonIdFromUrl: (url) => {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? matches[1] : null;
  },

  getPokemonUrl: (name) => {
    return `${BASE_URL}/pokemon/${name}`;
  }
};

export default api;