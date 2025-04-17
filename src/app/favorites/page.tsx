'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, ShoppingBag } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { addItem } = useCart();

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    });
    toast.success(`${item.name} added to your bag!`);
  };

  const handleRemoveFavorite = (id: string, name: string) => {
    removeFavorite(id);
    toast.success(`${name} removed from favorites`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-medium mb-4">Your favorites list is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Add items to your favorites by clicking the heart icon on product pages.
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative">
                <Link href={`/products/${item.id}`}>
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(item.id, item.name)}
                  className="absolute top-3 right-3 bg-white/80 rounded-full p-1.5 hover:bg-white text-red-500 transition-colors z-10"
                  aria-label="Remove from favorites"
                >
                  <Heart className="h-5 w-5 fill-red-500" />
                </button>
              </div>
              
              <CardContent className="pt-4">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-medium text-lg truncate">{item.name}</h3>
                </Link>
                {item.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1 mb-2">{item.description}</p>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between items-center pt-0">
                <p className="font-semibold text-gray-900">${item.price.toLocaleString()}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Bag
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
