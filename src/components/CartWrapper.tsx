'use client';

import { useCart } from '@/contexts/CartContext';
import SlideInCart from './SlideInCart';

export default function CartWrapper({ children }: { children: React.ReactNode }) {
  const { isCartOpen, closeCart } = useCart();

  return (
    <>
      {children}
      <SlideInCart isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
