"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Heart, ShoppingBag, Eye, Leaf } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SustainabilityIndicator from "./SustainabilityIndicator";
import { ARButton } from "@/components/ui/ARButton";
import { ProductView3D } from "@/components/ui/ProductView3D";
import { trackProductView, trackAddToCart } from "@/lib/analytics";

interface ProductCardProps {
  id?: string;
  name?: string;
  price?: number;
  image?: string;
  description?: string;
  sustainabilityScore?: number;
  isNew?: boolean;
  isFavorite?: boolean;
  onAddToBag?: (id: string) => void;
  onQuickView?: (id: string) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
}

// Create a local sustainability indicator for the product card
// Memoize the entire component to prevent unnecessary re-renders
const LocalSustainabilityIndicator = React.memo(({ score = 3 }: { score?: number }) => {
  const maxScore = 5;
  const tooltipText = `Sustainability Score: ${score}/${maxScore}`;
  
  // Use useMemo to prevent recreating the leaf elements on every render
  const leafElements = React.useMemo(() => {
    return Array.from({ length: maxScore }).map((_, index) => (
      <Leaf
        key={index}
        className={`h-4 w-4 ${
          index < score
            ? "text-green-500 fill-green-500"
            : "text-gray-300"
        }`}
      />
    ));
  }, [score, maxScore]);

  // Create a stable reference for the tooltip content
  const tooltipContent = React.useMemo(() => (
    <p>{tooltipText}</p>
  ), [tooltipText]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            {leafElements}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

const ProductCard = ({
  id = "1",
  name = "Silk Couture Evening Gown",
  price = 1299.99,
  image = "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80",
  description = "Exquisite hand-crafted silk evening gown with delicate embroidery and a modern silhouette. Perfect for special occasions.",
  sustainabilityScore = 4,
  isNew = true,
  onAddToBag = () => {},
  onQuickView = () => {},
}: ProductCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use ref for sustainability level to prevent re-renders
  const sustainabilityLevelRef = useRef(
    sustainabilityScore >= 4
      ? "high"
      : sustainabilityScore >= 3
        ? "medium"
        : "low",
  );

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToBag(id);
    trackAddToCart(id, name, price);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(id);
    setIsDialogOpen(true);
    trackProductView(id, name, price);
  };

  return (
    <Card className="w-80 overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-white">
      <div className="relative h-96 w-full overflow-hidden group">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        {isNew && (
          <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded-sm">
            NEW
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="mr-2 bg-white/90 hover:bg-white"
                onClick={handleQuickViewClick}
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] bg-white">
              <DialogTitle asChild>
                <VisuallyHidden>{name} - Quick View</VisuallyHidden>
              </DialogTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-[400px] w-full">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover rounded-md"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900">{name}</h2>
                    <p className="text-xl font-medium mb-4 text-gray-900">
                      ${price.toLocaleString()}
                    </p>
                    <div className="flex items-center mb-4">
                      <SustainabilityIndicator
                        level={sustainabilityScore >= 4 ? "high" : sustainabilityScore >= 3 ? "medium" : "low"}
                        size="md"
                      />
                    </div>
                    <p className="text-gray-600 mb-6">{description}</p>
                  </div>
                  <div className="mb-6">
                    <ProductView3D productId={id} className="mb-4" />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        onAddToBag(id);
                        trackAddToCart(id, name, price);
                      }}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Bag
                    </Button>
                    <ARButton
                      productId={id}
                      productName={name}
                      variant="outline"
                      size="md"
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-lg truncate text-gray-900">{name}</h3>
          <LocalSustainabilityIndicator score={sustainabilityScore} />
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <p className="font-semibold text-gray-900">${price.toLocaleString()}</p>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={handleAddToBag}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Bag
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
