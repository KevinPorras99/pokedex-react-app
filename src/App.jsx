import { Routes, Route } from 'react-router-dom';
import PokedexPage from './pages/PokedexPage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PaginationProvider } from './contexts/PaginationContext';

export default function App() {
  return (
    <PaginationProvider>
      <FavoritesProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<PokedexPage />} />
            <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
          </Routes>
        </ThemeProvider>
      </FavoritesProvider>
    </PaginationProvider>
  );
}