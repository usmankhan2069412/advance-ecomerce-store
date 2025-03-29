"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sustainabilityScore?: number;
  isNew?: boolean;
  className?: string;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  sustainabilityScore,
  isNew = false,
  className,
}: ProductCardProps) {
  const [isWishlist, setIsWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  return (
    <div
      className={cn(
        "product-card bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover-lift",
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link href={`/products/${id}`}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {isNew && (
          <div className="absolute top-4 left-4 bg-accent-gold text-primary text-xs font-medium px-2 py-1 rounded">
            New Arrival
          </div>
        )}

        <button
          onClick={() => setIsWishlist(!isWishlist)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-primary dark:text-secondary hover:bg-white dark:hover:bg-gray-800 transition-colors"
          aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn("h-5 w-5", isWishlist && "fill-red-500 text-red-500")}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-heading text-lg font-medium">{name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {category}
            </p>
          </div>
          <p className="font-medium">${price.toFixed(2)}</p>
        </div>

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

        <Button
          variant="primary"
          className={cn("w-full mt-2 btn-morphing", isAddingToCart && "success")}
          onClick={() => {
            setIsAddingToCart(true);
            setTimeout(() => setIsAddingToCart(false), 2000);
          }}
          disabled={isAddingToCart}
        >
          <span className="btn-text"><ShoppingBag className="mr-2 h-4 w-4" />Add to Cart</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="checkmark h-5 w-5"
          >
            <path d="M21.801 10A10 10 0 1 1 17 3.335" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
