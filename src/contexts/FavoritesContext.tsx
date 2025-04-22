'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Use named function with explicit return type
export function FavoritesProvider({ children }: { children: ReactNode }): JSX.Element {
  // Initialize with empty array to avoid hydration mismatch
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites(currentFavorites => {
      // Check if item already exists in favorites
      if (currentFavorites.some(favorite => favorite.id === item.id)) {
        return currentFavorites;
      }
      return [...currentFavorites, item];
    });
  };

  const removeFavorite = (itemId: string) => {
    setFavorites(currentFavorites =>
      currentFavorites.filter(item => item.id !== itemId)
    );
  };

  const isFavorite = (itemId: string) => {
    return favorites.some(item => item.id === itemId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Use named function with explicit return type
export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
