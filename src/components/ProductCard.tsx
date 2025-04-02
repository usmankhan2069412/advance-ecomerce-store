"use client";

import React, { useState, useRef /* Removed useRef */ } from "react";
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
  id?: string; // Consider making this required: id: string;
  name?: string;
  price?: number;
  image?: string;
  description?: string;
  sustainabilityScore?: number;
  isNew?: boolean;
  isFavorite?: boolean; // This prop is defined but not used
  onAddToBag?: (id: string) => void;
  onQuickView?: (id: string) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void; // This prop is defined but not used
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

// Assign a display name for better debugging
LocalSustainabilityIndicator.displayName = 'LocalSustainabilityIndicator';

const ProductCard = ({
  id, // If id is always required, change to id: string in props and remove optional chaining below if needed
  name,
  price,
  image,
  description,
  sustainabilityScore = 3,
  isNew = false,
  // isFavorite and onFavoriteToggle are unused currently
  onAddToBag = () => {},
  onQuickView = () => {},
}: ProductCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Removed the useRef for sustainabilityLevelRef

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) { // Add check if id might be undefined
      onAddToBag(id);
      trackAddToCart(id as string, name as string, price as number);
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
     if (id) { // Add check if id might be undefined
       onQuickView(id);
       setIsDialogOpen(true);
       trackProductView(id as string, name as string, price as number);
     }
  };

  // Defensive check: If required props are missing, maybe render nothing or a placeholder
  if (!id || !name || price === undefined || !image) {
      // Or render a placeholder/skeleton loader
      console.warn("ProductCard missing required props:", { id, name, price, image });
      return null;
  }

  return (
    <Card className="w-80 overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-white">
      <div className="relative h-96 w-full overflow-hidden group">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority // Use priority carefully, only for above-the-fold images
        />
        {isNew && (
          <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded-sm">
            NEW
          </div>
        )}
        {/* Add Favorite Button Here if using isFavorite/onFavoriteToggle */}
        {/* Example:
         <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering quick view if needed
              onFavoriteToggle(id, !isFavorite);
            }}
            className="absolute top-3 right-3 bg-white/80 rounded-full p-1.5 hover:bg-white text-gray-600 hover:text-red-500 transition-colors z-10"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : 'fill-transparent'}`} />
          </button>
        */}
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
            <DialogContent className="sm:max-w-[800px] bg-white dark:bg-white"> {/* Consider dark mode bg */}
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
                    priority // Priority here might be less critical than the card view image
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900">{name}</h2>
                    <p className="text-xl font-medium mb-4 text-gray-900">
                      ${price.toLocaleString()}
                    </p>
                    <div className="flex items-center mb-4">
                      {/* Directly calculate level here */}
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
                      onClick={(e) => {
                        // No need for preventDefault/stopPropagation if it's just a normal button click inside the dialog
                        onAddToBag(id);
                        trackAddToCart(id, name, price);
                        // Optionally close the dialog after adding to bag:
                        // setIsDialogOpen(false);
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
          onClick={handleAddToBag} // Already calls preventDefault/stopPropagation
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Bag
        </Button>
      </CardFooter>
    </Card>
  );
};

// Assign a display name for better debugging
ProductCard.displayName = 'ProductCard';
export default ProductCard;