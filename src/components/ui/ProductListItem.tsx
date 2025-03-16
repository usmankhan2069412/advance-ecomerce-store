"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ProductListItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  sustainabilityScore?: number;
  isNew?: boolean;
  className?: string;
}

export function ProductListItem({
  id,
  name,
  price,
  image,
  category,
  description,
  sustainabilityScore,
  isNew = false,
  className,
}: ProductListItemProps) {
  const [isWishlist, setIsWishlist] = useState(false);

  return (
    <div
      className={cn(
        "product-card flex bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm",
        className,
      )}
    >
      <div className="relative w-1/3 min-w-[120px]">
        <Link href={`/products/${id}`}>
          <div className="relative h-full">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 33vw, 25vw"
            />
          </div>
        </Link>

        {isNew && (
          <div className="absolute top-4 left-4 bg-accent-gold text-primary text-xs font-medium px-2 py-1 rounded">
            New Arrival
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-heading text-lg font-medium">{name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {category}
            </p>
          </div>
          <div className="flex items-center">
            <p className="font-medium mr-3">${price.toFixed(2)}</p>
            <button
              onClick={() => setIsWishlist(!isWishlist)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-primary dark:text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={
                isWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isWishlist && "fill-red-500 text-red-500",
                )}
              />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {description}
        </p>

        {sustainabilityScore && (
          <div className="flex items-center mb-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-accent-gold h-1.5 rounded-full"
                style={{ width: `${sustainabilityScore}%` }}
                aria-label={`Sustainability score: ${sustainabilityScore}%`}
              />
            </div>
            <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
              {sustainabilityScore}%
            </span>
          </div>
        )}

        <div className="mt-auto">
          <Button variant="primary" className="w-full" withCheckmark>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
