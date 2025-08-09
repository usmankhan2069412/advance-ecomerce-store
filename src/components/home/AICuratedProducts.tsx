"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/SkeletonLoader";
import { ArrowRight, Sparkles } from "lucide-react";

// Mock data for AI-curated products
const curatedProducts = [
  {
    id: "1",
    name: "AI-Recommended Summer Dress",
    price: 89.99,
    image: "/products/product-1.jpg",
    matchScore: 98,
  },
  {
    id: "2",
    name: "Personalized Casual Outfit",
    price: 129.99,
    image: "/products/product-2.jpg",
    matchScore: 95,
  },
  {
    id: "3",
    name: "Style-Matched Accessories",
    price: 49.99,
    image: "/products/product-3.jpg",
    matchScore: 92,
  },
  {
    id: "4",
    name: "Trend-Predicted Collection",
    price: 159.99,
    image: "/products/product-4.jpg",
    matchScore: 90,
  },
];

const AICuratedProducts = () => {
  const [loading, setLoading] = React.useState(false);

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col justify-between sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-accent-600" />
              <h2 className="text-2xl font-bold text-primary-800 dark:text-white sm:text-3xl">
                AI-Curated For You
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Personalized recommendations based on your style preferences
            </p>
          </div>
          
          <Link 
            href="/ai-recommendations" 
            className="mt-4 inline-flex items-center text-primary-800 hover:text-primary-700 dark:text-accent-600 dark:hover:text-accent-500 sm:mt-0"
          >
            View all recommendations
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            // Skeleton loaders for loading state
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
                  <Skeleton variant="rectangular" className="absolute inset-0" />
                </div>
                <CardContent className="p-4">
                  <Skeleton variant="text" className="mb-2 h-6 w-3/4" />
                  <Skeleton variant="text" className="h-5 w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual product cards
            curatedProducts.map((product) => (
              <Card key={product.id} interactive>
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute right-2 top-2 rounded-full bg-accent-600 px-2 py-1 text-xs font-medium text-primary-800">
                      {product.matchScore}% Match
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="font-semibold text-primary-800 dark:text-accent-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Button 
            variant="secondary" 
            size="lg"
            as={Link}
            href="/ai-recommendations"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Explore All AI Recommendations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AICuratedProducts; 