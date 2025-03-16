"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";
import { SkeletonProductGrid } from "./SkeletonCard";
import { LayoutSelector } from "./LayoutSelector";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  sustainabilityScore?: number;
  isNew?: boolean;
};

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  className?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  className,
}: ProductGridProps) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading) {
    return <SkeletonProductGrid />;
  }

  if (!isClient) {
    // Server-side rendering fallback
    return null;
  }

  return (
    <div className={className}>
      <div className="flex justify-end mb-6">
        <LayoutSelector
          onLayoutChange={(newLayout) =>
            setLayout(newLayout as "grid" | "list")
          }
        />
      </div>

      {layout === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              sustainabilityScore={product.sustainabilityScore}
              isNew={product.isNew}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              description={product.description}
              sustainabilityScore={product.sustainabilityScore}
              isNew={product.isNew}
            />
          ))}
        </div>
      )}
    </div>
  );
}
