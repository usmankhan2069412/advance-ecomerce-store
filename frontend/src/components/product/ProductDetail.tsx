'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, ShoppingBag, Heart, Share2, Maximize, Info } from 'lucide-react';
import VirtualTryOn from '@/components/ai/VirtualTryOn';

interface ProductDetailProps {
    product: {
        id: string;
        name: string;
        price: number;
        description: string;
        images: string[];
        colors: Array<{ name: string; value: string; inStock: boolean }>;
        sizes: Array<{ name: string; inStock: boolean }>;
        rating: number;
        reviewCount: number;
        details: string;
        care: string;
        material: string;
        modelSize: string;
        modelHeight: string;
    };
    relatedProducts: Array<{
        id: string;
        name: string;
        price: number;
        image: string;
        rating: number;
        reviewCount: number;
    }>;
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showZoom, setShowZoom] = useState(false);
    const [showTryOn, setShowTryOn] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const { addItem } = useCart();

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        if (!selectedColor) {
            alert('Please select a color');
            return;
        }
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0]
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Product Images Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <Image
                            src={product.images[activeImageIndex]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <button
                            onClick={() => setShowZoom(true)}
                            className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white"
                        >
                            <Maximize className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowTryOn(true)}
                            className="absolute top-4 right-16 p-2 bg-white/80 rounded-full hover:bg-white"
                        >
                            <Info className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImageIndex(index)}
                                className={`relative aspect-square overflow-hidden rounded-md ${index === activeImageIndex ? 'ring-2 ring-primary' : ''}`}
                            >
                                <Image
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 25vw, 12vw"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Information */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-2xl font-semibold">${product.price}</span>
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                                ({product.reviewCount} reviews)
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6">{product.description}</p>

                    {/* Color Selection */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Color</h3>
                        <div className="flex gap-2">
                            {product.colors.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.name)}
                                    disabled={!color.inStock}
                                    className={`w-10 h-10 rounded-full border-2 ${selectedColor === color.name ? 'border-primary' : 'border-transparent'} ${!color.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Size</h3>
                        <div className="flex gap-2">
                            {product.sizes.map((size) => (
                                <button
                                    key={size.name}
                                    onClick={() => setSelectedSize(size.name)}
                                    disabled={!size.inStock}
                                    className={`px-4 py-2 border rounded ${selectedSize === size.name ? 'border-primary bg-primary/10' : 'border-gray-200'} ${!size.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {size.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mb-8">
                        <Button
                            onClick={handleAddToCart}
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Add to Cart
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`p-3 ${isFavorite ? 'text-red-500' : ''}`}
                        >
                            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="outline" className="p-3">
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Product Details Tabs */}
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="care">Care Instructions</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details">
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.details }} />
                            <div className="mt-4 space-y-2 text-sm text-gray-600">
                                <p>Material: {product.material}</p>
                                <p>{product.modelSize}</p>
                                <p>{product.modelHeight}</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="care">
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.care }} />
                        </TabsContent>
                        <TabsContent value="reviews">
                            {/* Reviews component would go here */}
                            <p className="text-gray-600">Customer reviews coming soon...</p>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Related Products */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                <Carousel className="w-full">
                    <CarouselContent>
                        {relatedProducts.map((product) => (
                            <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
                                <Card className="overflow-hidden">
                                    <div className="relative aspect-square">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium">{product.name}</h3>
                                        <p className="text-gray-600">${product.price}</p>
                                    </div>
                                </Card>
                            </CarouselItem>
                        ))}

                    </CarouselContent>
                    
                </Carousel>
            </div>

            {/* Image Zoom Dialog */}
            <Dialog open={showZoom} onOpenChange={setShowZoom}>
                <DialogContent className="max-w-4xl">
                    <div className="relative aspect-square">
                        <Image
                            src={product.images[activeImageIndex]}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Virtual Try-On Dialog */}
            <Dialog open={showTryOn} onOpenChange={setShowTryOn}>
                <DialogContent className="max-w-4xl">
                    <VirtualTryOn
                        productId={product.id}
                        productImage={product.images[activeImageIndex]}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}