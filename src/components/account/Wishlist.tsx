'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface WishlistProps {
  items: WishlistItem[];
  onRemove: (id: string) => void;
}

export default function Wishlist({ items = [], onRemove }: WishlistProps) {
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
        <p className="text-gray-600 mb-4">Save items you love to your wishlist</p>
        <Button>Continue Shopping</Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-2">{item.name}</h3>
            <p className="text-lg font-semibold mb-4">${item.price.toFixed(2)}</p>
            <div className="flex gap-2">
              <Button
                className="flex-1 flex items-center gap-2"
                onClick={() => addItem({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: 1,
                  image: item.image
                })}
                disabled={!item.inStock}
              >
                <ShoppingBag className="w-4 h-4" />
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                className="p-2"
                onClick={() => onRemove(item.id)}
              >
                <Heart className="w-4 h-4 fill-current text-red-500" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}