'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Check, X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  sizes?: string[];
  colors?: string[];
  inventory?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showQuantity?: boolean;
}

export default function AddToCartButton({
  productId,
  productName,
  productPrice,
  productImage,
  sizes = [],
  colors = [],
  inventory = 10,
  className = '',
  variant = 'primary',
  size = 'md',
  showQuantity = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    setIsAdded(false);
  }, [productId]);

  const handleAddToCart = () => {
    // If product has sizes but none selected
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // If product has colors but none selected
    if (colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    // Add to cart
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: quantity,
      image: productImage,
      size: selectedSize,
      color: selectedColor,
    });

    // Show success animation
    setIsAdded(true);
    toast.success(`${productName} added to your bag!`);
    
    // Reset after animation
    setTimeout(() => {
      setIsOpen(false);
      setIsAdded(false);
    }, 1500);
  };

  const handleOpenSelector = () => {
    if (sizes.length > 0 || colors.length > 0) {
      setIsOpen(true);
    } else {
      // If no options to select, add directly
      handleAddToCart();
    }
  };

  const incrementQuantity = () => {
    if (quantity < inventory) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${className} ${isAdded ? 'bg-green-500 border-green-500 text-white' : ''}`}
        onClick={handleOpenSelector}
        disabled={inventory === 0}
      >
        {isAdded ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <ShoppingBag className="h-4 w-4 mr-2" />
        )}
        {inventory > 0 ? (isAdded ? 'Added to Bag' : 'Add to Bag') : 'Out of Stock'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add to Bag</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">{productName}</p>
                <p className="font-medium">${productPrice.toFixed(2)}</p>
              </div>

              {sizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`px-3 py-1.5 border rounded-md text-sm ${
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Select Color</p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color ? 'border-black' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Color: ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {showQuantity && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrementQuantity}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      disabled={quantity >= inventory}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={
                    (sizes.length > 0 && !selectedSize) ||
                    (colors.length > 0 && !selectedColor) ||
                    isAdded
                  }
                >
                  {isAdded ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Bag
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
