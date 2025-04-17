'use client';

import React from 'react';
import Header from './Header';
import { useFavorites } from '@/contexts/FavoritesContext';

interface HeaderWrapperProps {
  transparent?: boolean;
}

const HeaderWrapper = ({ transparent = false }: HeaderWrapperProps) => {
  // This component safely accesses the favorites context
  const { favorites } = useFavorites();
  
  return <Header transparent={transparent} />;
};

export default HeaderWrapper;
