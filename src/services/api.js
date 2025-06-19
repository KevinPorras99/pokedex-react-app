const BASE_URL = 'https://pokeapi.co/api/v2';

const api = {
  async getAllPokemon(limit = 20, offset = 0) {
    try {
      console.log(`Fetching Pokémon list: limit=${limit}, offset=${offset}`);
      const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('getAllPokemon error:', error);
      throw error;
    }
  },

  async getPokemonByName(name, retryCount = 0) {
    try {
      const response = await fetch(`${BASE_URL}/pokemon/${name}`);
      
      if (response.status === 429 && retryCount < MAX_RETRIES) {
        console.log(`Rate limited for ${name}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.getPokemonByName(name, retryCount + 1);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch ${name}: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);
      return null;
    }
  },

  async getPokemonSpecies(id) {
    try {
      const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch species ${id}: ${response.status}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error(`Error fetching species ${id}:`, error);
      return null;
    }
  },

  async getType(typeName) {
    try {
      const response = await fetch(`${BASE_URL}/type/${typeName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch type ${typeName}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching type ${typeName}:`, error);
      return null;
    }
  },

  async getEvolutionChain(url) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch evolution chain: ${response.status}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
      return null;
    }
  }
};

export default api;