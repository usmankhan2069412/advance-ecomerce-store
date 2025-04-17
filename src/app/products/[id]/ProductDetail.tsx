'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductView3D } from "@/components/ui/ProductView3D";
import { ARButton } from "@/components/ui/ARButton";
import SustainabilityIndicator from "@/components/SustainabilityIndicator";
import VirtualTryOn from "@/components/ai/VirtualTryOn";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Star, ShoppingBag, Share2, Maximize, Info, Heart } from "lucide-react";
import { trackProductView, trackAddToCart } from "@/lib/analytics";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

interface ProductDetailProps {
  params: {
    id: string;
  };
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const productId = params.id as string;

  // Product state
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showTryOn, setShowTryOn] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  // Get cart and favorites contexts
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Mock product data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProduct = {
        id: productId,
        name: "Ethereal Silk Evening Gown",
        price: 1299.99,
        description: "Exquisite hand-crafted silk evening gown with delicate embroidery and a modern silhouette. Perfect for special occasions and red carpet events.",
        details: "<p>This stunning gown features:</p><ul><li>100% pure silk fabric</li><li>Hand-embroidered details</li><li>Sustainably sourced materials</li><li>Made in our ethical workshop</li><li>Designed by award-winning designer Maria Chen</li></ul>",
        care: "<p>To keep your gown looking its best:</p><ul><li>Dry clean only</li><li>Store in a cool, dry place</li><li>Use padded hanger</li><li>Avoid direct sunlight</li></ul>",
        sustainabilityScore: 4,
        images: [
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
          "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&q=80"
        ],
        colors: [
          { name: "Midnight Blue", value: "#0a1f44", inStock: true },
          { name: "Emerald Green", value: "#046307", inStock: true },
          { name: "Ruby Red", value: "#9b111e", inStock: false },
          { name: "Champagne Gold", value: "#f7e7ce", inStock: true }
        ],
        sizes: [
          { name: "XS", inStock: true },
          { name: "S", inStock: true },
          { name: "M", inStock: true },
          { name: "L", inStock: false },
          { name: "XL", inStock: true }
        ],
        rating: 4.8,
        reviewCount: 124,
        isNew: true,
        material: "100% Silk",
        modelSize: "Model wears size S",
        modelHeight: "Model is 5'10\" (178 cm)"
      };

      // Mock related products
      const mockRelatedProducts = [
        {
          id: "2",
          name: "Crystal Embellished Clutch",
          price: 349.99,
          image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
          rating: 4.7,
          reviewCount: 42
        },
        {
          id: "3",
          name: "Satin Stiletto Heels",
          price: 249.99,
          image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
          rating: 4.5,
          reviewCount: 36
        },
        {
          id: "4",
          name: "Pearl Drop Earrings",
          price: 189.99,
          image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
          rating: 4.9,
          reviewCount: 28
        },
        {
          id: "5",
          name: "Beaded Evening Shawl",
          price: 159.99,
          image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&q=80",
          rating: 4.6,
          reviewCount: 19
        }
      ];

      setProduct(mockProduct);
      setRelatedProducts(mockRelatedProducts);
      setSelectedColor(mockProduct.colors.find((c: any) => c.inStock)?.name || "");
      setSelectedSize(mockProduct.sizes.find((s: any) => s.inStock)?.name || "");
      setLoading(false);

      // Track product view
      trackProductView(productId, mockProduct.name, mockProduct.price);
    }, 800);
  }, [productId]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // Add the product to the cart using the cart context
    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor
    });

    // Track the add to cart event for analytics
    trackAddToCart(productId, product.name, product.price);

    // Show success message
    toast.success(`${product.name} added to your bag!`);
  };

  // Handle toggling favorite status
  const handleToggleFavorite = () => {
    if (!product) return;

    if (isFavorite(productId)) {
      removeFavorite(productId);
      toast.success(`${product.name} removed from favorites`);
    } else {
      addFavorite({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        description: product.description
      });
      toast.success(`${product.name} added to favorites`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg aspect-square"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[activeImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />

            {/* Zoom button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="md"
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="relative aspect-square w-full">
                  <Image
                    src={product.images[activeImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>

            {/* AI Try-On button */}
            <Button
              variant="outline"
              size="md"
              className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={() => setShowTryOn(true)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-5 gap-2 pb-2">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                className={`relative aspect-square rounded-md overflow-hidden transition-all duration-200 ${index === activeImageIndex ? 'ring-2 ring-primary scale-105 z-10' : 'ring-1 ring-gray-200 hover:ring-gray-300'}`}
                onClick={() => setActiveImageIndex(index)}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - View ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 20vw, 10vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* 3D View */}
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
            <ProductView3D productId={productId} className="w-full h-full" />
          </div>
        </div>

        {/* Product Information */}
        <div>
          {/* Product Name and Price */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-semibold">${product.price.toLocaleString()}</p>
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Sustainability Score */}
          <div className="flex items-center mb-6">
            <SustainabilityIndicator
              level={product.sustainabilityScore >= 4 ? "high" : product.sustainabilityScore >= 3 ? "medium" : "low"}
              size="md"
            />
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Color: {selectedColor}</h3>
            <div className="flex space-x-2">
              {product.colors.map((color: any) => (
                <button
                  key={color.name}
                  className={`
                    w-10 h-10 rounded-full relative
                    ${!color.inStock ? 'opacity-50 cursor-not-allowed' : ''}
                    ${selectedColor === color.name ? 'ring-2 ring-black ring-offset-2' : ''}
                  `}
                  style={{ backgroundColor: color.value }}
                  onClick={() => color.inStock && setSelectedColor(color.name)}
                  disabled={!color.inStock}
                  aria-label={`Color: ${color.name}`}
                >
                  {!color.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-0.5 bg-gray-500 transform rotate-45"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Size: {selectedSize}</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-sm p-0 h-auto">
                    Size Guide
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <h2 className="text-xl font-bold mb-4">Size Guide</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Size</th>
                          <th className="py-2 px-4 text-left">Bust</th>
                          <th className="py-2 px-4 text-left">Waist</th>
                          <th className="py-2 px-4 text-left">Hips</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-4">XS</td>
                          <td className="py-2 px-4">32"</td>
                          <td className="py-2 px-4">24"</td>
                          <td className="py-2 px-4">34"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">S</td>
                          <td className="py-2 px-4">34"</td>
                          <td className="py-2 px-4">26"</td>
                          <td className="py-2 px-4">36"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">M</td>
                          <td className="py-2 px-4">36"</td>
                          <td className="py-2 px-4">28"</td>
                          <td className="py-2 px-4">38"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">L</td>
                          <td className="py-2 px-4">38"</td>
                          <td className="py-2 px-4">30"</td>
                          <td className="py-2 px-4">40"</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">XL</td>
                          <td className="py-2 px-4">40"</td>
                          <td className="py-2 px-4">32"</td>
                          <td className="py-2 px-4">42"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">{product.modelSize}, {product.modelHeight}</p>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size: any) => (
                <button
                  key={size.name}
                  className={`
                    py-2 border rounded-md text-sm font-medium
                    ${!size.inStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:border-black'}
                    ${selectedSize === size.name ? 'border-black' : 'border-gray-200'}
                  `}
                  onClick={() => size.inStock && setSelectedSize(size.name)}
                  disabled={!size.inStock}
                >
                  {size.name}
                  {!size.inStock && <span className="block text-xs">Out of stock</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center border border-gray-200 rounded-md w-32">
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <div className="flex-1 text-center">{quantity}</div>
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart and Actions */}
          <div className="flex flex-col space-y-4 mb-8">
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Bag
            </Button>

            <div className="flex space-x-4">
              <ARButton
                productId={productId}
                productName={product.name}
                variant="outline"
                className="flex-1"
              />

              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={handleToggleFavorite}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${isFavorite(productId) ? 'fill-red-500 text-red-500' : ''}`}
                />
                {isFavorite(productId) ? 'Favorited' : 'Favorite'}
              </Button>

              <Button variant="outline" size="md" className="flex-1">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="care">Care</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
              <div dangerouslySetInnerHTML={{ __html: product.details }} />
            </TabsContent>
            <TabsContent value="care" className="pt-4">
              <div dangerouslySetInnerHTML={{ __html: product.care }} />
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <p>Free standard shipping on all orders over $100.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Standard delivery: 3-5 business days</li>
                <li>Express delivery: 1-2 business days</li>
                <li>Free returns within 30 days</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Try-On Dialog */}
      <Dialog open={showTryOn} onOpenChange={setShowTryOn}>
        <DialogContent className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Virtual Try-On</h2>
          <VirtualTryOn productId={productId} productImage={product.images[0]} />
        </DialogContent>
      </Dialog>

      {/* Related Products */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {relatedProducts.map((relatedProduct) => (
                <CarouselItem key={relatedProduct.id} className="md:basis-1/3 lg:basis-1/4">
                  <Card className="h-full">
                    <CardContent className="p-0">
                      <Link href={`/products/${relatedProduct.id}`}>
                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                          <Image
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium truncate">{relatedProduct.name}</h3>
                          <div className="flex items-center justify-between mt-1">
                            <p className="font-semibold">${relatedProduct.price.toLocaleString()}</p>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs ml-1">{relatedProduct.rating}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
