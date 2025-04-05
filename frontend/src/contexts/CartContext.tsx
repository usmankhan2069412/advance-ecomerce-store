'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyPromoCode: (code: string) => void;
  subtotal: number;
  total: number;
  shippingCost: number;
  tax: number;
  promoCodeDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  const shippingCost = 10; // Example fixed shipping cost

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // Example 10% tax rate
  const total = subtotal + shippingCost + tax - promoCodeDiscount;

  const addItem = (item: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...currentItems, item];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const applyPromoCode = (code: string) => {
    // Example promo code logic
    if (code === 'DISCOUNT20') {
      setPromoCodeDiscount(subtotal * 0.2); // 20% discount
    } else {
      setPromoCodeDiscount(0);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        applyPromoCode,
        subtotal,
        total,
        shippingCost,
        tax,
        promoCodeDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}