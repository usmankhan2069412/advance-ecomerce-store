
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingBag, Menu, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Import from a separate utility file to avoid circular dependencies
import { useFavorites } from "@/contexts/FavoritesContext";

interface HeaderProps {
  transparent?: boolean;
}

const Header = ({ transparent = false }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { items, removeItem, updateQuantity } = useCart();
  const router = useRouter();
  const { isAuthenticated, userProfile, logout } = useAuth();

  // Safely use favorites context
  let favorites: any[] = [];
  let favoritesCount = 0;

  try {
    // Only try to use favorites if we're in a client component
    if (typeof window !== 'undefined') {
      const favoritesContext = useFavorites();
      favorites = favoritesContext.favorites || [];
      favoritesCount = favorites.length;
    }
  } catch (error) {
    // Fallback if context is not available
    favorites = [];
    favoritesCount = 0;
  }

  // Calculate total items in cart
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navItems = [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Collections", href: "/collections" },
    { label: "Women", href: "/women" },
    { label: "Men", href: "/men" },
    { label: "Accessories", href: "/accessories" },
    { label: "AI Studio", href: "/ai-studio" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full py-4 px-6 flex items-center justify-between transition-colors duration-300",
        transparent && !isScrolled
          ? "bg-transparent text-white"
          : isScrolled
          ? "bg-black text-white shadow-sm"
          : "bg-white text-black shadow-sm",
      )}
    >
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          AETHERIA
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium hover:text-gray-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-2 icon-container">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative no-hover">
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
              <User className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 bg-white">
            {isAuthenticated ? (
              <>
                <div className="px-2 py-1.5 mb-1">
                  <p className="text-sm font-medium">Hello, {userProfile?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{userProfile?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="w-full text-left cursor-pointer block"
                  >
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account?tab=orders"
                    className="w-full text-left cursor-pointer block"
                  >
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left cursor-pointer"
                  >
                    Logout
                  </button>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/auth" className="cursor-pointer">
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/auth"
                    className="cursor-pointer"
                    onClick={() => {
                      // Set a query parameter to open the signup tab
                      router.push('/auth?tab=signup');
                    }}
                  >
                    Create Account
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative no-hover"
              aria-label={`Shopping cart with ${cartItemsCount} items`}
            >
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-0 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
              <ShoppingBag className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-4 bg-white">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Your Cart ({cartItemsCount})</h3>
                <Button variant="link" size="sm" onClick={() => router.push('/cart')}>
                  View Cart
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b">
                      <div className="w-12 h-12 relative bg-gray-100 rounded overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            {(item.size || item.color) && (
                              <p className="text-xs text-gray-500">
                                {item.size && <span className="mr-1">Size: {item.size}</span>}
                                {item.color && <span>Color: {item.color}</span>}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                            aria-label="Remove item"
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="text-xs px-1 border rounded"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="text-xs">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-xs px-1 border rounded"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-medium text-sm">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {items.length > 3 && (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-500">
                        +{items.length - 3} more items
                      </p>
                    </div>
                  )}
                </div>
              )}

              {items.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Subtotal:</span>
                    <span className="font-medium">
                      ${items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => router.push('/checkout')}
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="md" className="no-hover">
              <Menu className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
