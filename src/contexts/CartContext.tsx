'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyPromoCode: (code: string) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
  total: number;
  shippingCost: number;
  tax: number;
  promoCodeDiscount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Use named function with explicit return type
export function CartProvider({ children }: { children: ReactNode }): JSX.Element {
  // Initialize with empty array to avoid hydration mismatch
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  const shippingCost = 10; // Example fixed shipping cost

  // Load cart items from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }

      // Load promo code discount
      const savedDiscount = localStorage.getItem('promoDiscount');
      if (savedDiscount) {
        setPromoCodeDiscount(parseFloat(savedDiscount));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  // Save promo code discount to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('promoDiscount', promoCodeDiscount.toString());
    }
  }, [promoCodeDiscount]);

  // Open cart when items are added
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // Example 10% tax rate
  const total = subtotal + shippingCost + tax - promoCodeDiscount;

  const addItem = (item: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i =>
        i.id === item.id &&
        i.size === item.size &&
        i.color === item.color
      );

      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...currentItems, item];
    });

    // Open cart when item is added
    openCart();
  };

  const clearCart = () => {
    setItems([]);
    setPromoCodeDiscount(0);
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
        isCartOpen,
        openCart,
        closeCart,
        subtotal,
        total,
        shippingCost,
        tax,
        promoCodeDiscount,
        clearCart,
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