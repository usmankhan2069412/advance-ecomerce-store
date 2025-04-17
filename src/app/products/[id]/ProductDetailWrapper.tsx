'use client';

import React from 'react';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import ProductDetail from './ProductDetail';

interface ProductDetailWrapperProps {
  params: { id: string };
}

const ProductDetailWrapper = ({ params }: ProductDetailWrapperProps) => {
  return (
    <FavoritesProvider>
      <ProductDetail params={params} />
    </FavoritesProvider>
  );
};

export default ProductDetailWrapper;
