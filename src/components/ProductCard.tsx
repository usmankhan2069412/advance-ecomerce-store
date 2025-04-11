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
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  sustainabilityScore?: number;
  isNew?: boolean;
  isFavorite?: boolean;
  category?: string;
  tags?: string[];
  inventory?: number;
  sizes?: string[];
  colors?: string[];
  compareAtPrice?: number;
  onAddToBag?: (id: string, size?: string, color?: string) => void;
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

// Assign a display name for better debugging
LocalSustainabilityIndicator.displayName = 'LocalSustainabilityIndicator';

const ProductCard = ({
  id,
  name,
  price,
  image,
  images = [],
  description,
  sustainabilityScore = 3,
  isNew = false,
  isFavorite = false,
  category = 'Uncategorized',
  tags = [],
  inventory = 0,
  sizes = ['S', 'M', 'L', 'XL'],  // Default sizes
  colors = [],
  compareAtPrice,
  onAddToBag = () => {},
  onQuickView = () => {},
  onFavoriteToggle = () => {},
}: ProductCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Handle adding to bag (size and color selection moved to product detail page)
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

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle(id, !isFavorite);
  };

  return (
    <Card className="w-80 overflow-hidden transition-all duration-300 hover:shadow-lg bg-white ">
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
                  {/* Image gallery thumbnails */}
                  {images && images.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                      {images.slice(0, 4).map((img, index) => (
                        <button
                          key={index}
                          className={`w-12 h-12 border-2 rounded-md overflow-hidden ${img === image ? 'border-primary' : 'border-gray-200'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // This would update the main image in a real implementation
                          }}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={img}
                              alt={`${name} view ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-semibold text-gray-900">{name}</h2>
                      <button
                        onClick={handleFavoriteToggle}
                        className="p-1.5 rounded-full hover:bg-gray-100"
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-xl font-medium text-gray-900">
                        ${price.toLocaleString()}
                      </p>
                      {compareAtPrice && compareAtPrice > price && (
                        <p className="text-sm text-gray-500 line-through">
                          ${compareAtPrice.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center mb-4">
                      <SustainabilityIndicator
                        level={sustainabilityScore >= 4 ? "high" : sustainabilityScore >= 3 ? "medium" : "low"}
                        size="md"
                      />
                    </div>

                    {/* Category and tags */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Category: <span className="text-gray-700">{category}</span></p>
                      {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 mb-6">{description}</p>

                    {/* Size selection */}
                    {sizes && sizes.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Size</h3>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((size) => (
                            <button
                              key={size}
                              className={`px-3 py-1.5 border rounded-md text-sm ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-gray-400'}`}
                              onClick={() => setSelectedSize(size)}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color selection */}
                    {colors && colors.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Color</h3>
                        <div className="flex flex-wrap gap-2">
                          {colors.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
                              style={{ backgroundColor: color.toLowerCase() }}
                              onClick={() => setSelectedColor(color)}
                              aria-label={`Color: ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inventory */}
                    {inventory !== undefined && (
                      <p className="text-sm mb-4">
                        {inventory > 10 ? (
                          <span className="text-green-600">In Stock</span>
                        ) : inventory > 0 ? (
                          <span className="text-orange-500">Only {inventory} left</span>
                        ) : (
                          <span className="text-red-500">Out of Stock</span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <ProductView3D productId={id} className="mb-4" />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      onClick={(e) => {
                        // In the quick view dialog, we still use size and color
                        // This will need to be handled by the parent component
                        onAddToBag(id, selectedSize, selectedColor);
                        trackAddToCart(id, name, price);
                        setIsDialogOpen(false);
                      }}
                      disabled={sizes.length > 0 && !selectedSize}
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

        {/* Category */}
        <p className="text-xs text-gray-500 mb-1">{category}</p>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{description}</p>

        {/* Size selection removed from product card - only shown on product detail page */}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">${price.toLocaleString()}</p>
            {compareAtPrice && compareAtPrice > price && (
              <p className="text-xs text-gray-500 line-through">${compareAtPrice.toLocaleString()}</p>
            )}
          </div>
          {inventory !== undefined && inventory <= 10 && inventory > 0 && (
            <p className="text-xs text-orange-500">Only {inventory} left</p>
          )}
        </div>
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

// Assign a display name for better debugging
ProductCard.displayName = 'ProductCard';
export default ProductCard;