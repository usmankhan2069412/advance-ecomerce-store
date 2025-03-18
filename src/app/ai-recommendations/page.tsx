import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Sparkles, Filter, ArrowLeft } from "lucide-react";

/**
 * AI Recommendations Page
 * Shows personalized product recommendations
 */
export default function AIRecommendationsPage() {
  // Mock data for recommended products
  const recommendedProducts = [
    {
      id: "1",
      name: "AI-Recommended Summer Dress",
      price: 89.99,
      image: "/products/product-1.jpg",
      matchScore: 98,
      reason: "Based on your style preferences",
    },
    {
      id: "2",
      name: "Personalized Casual Outfit",
      price: 129.99,
      image: "/products/product-2.jpg",
      matchScore: 95,
      reason: "Similar to items you've viewed",
    },
    {
      id: "3",
      name: "Style-Matched Accessories",
      price: 49.99,
      image: "/products/product-3.jpg",
      matchScore: 92,
      reason: "Complements your recent purchases",
    },
    {
      id: "4",
      name: "Trend-Predicted Collection",
      price: 159.99,
      image: "/products/product-4.jpg",
      matchScore: 90,
      reason: "Trending in your region",
    },
    {
      id: "5",
      name: "Color-Coordinated Ensemble",
      price: 199.99,
      image: "/products/product-5.jpg",
      matchScore: 89,
      reason: "Matches your color preferences",
    },
    {
      id: "6",
      name: "Occasion-Specific Outfit",
      price: 149.99,
      image: "/products/product-6.jpg",
      matchScore: 87,
      reason: "Perfect for upcoming events",
    },
    {
      id: "7",
      name: "Weather-Appropriate Selection",
      price: 79.99,
      image: "/products/product-7.jpg",
      matchScore: 85,
      reason: "Suitable for your local climate",
    },
    {
      id: "8",
      name: "Sustainable Fashion Pick",
      price: 119.99,
      image: "/products/product-8.jpg",
      matchScore: 84,
      reason: "Aligns with your eco-friendly preferences",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <Link 
          href="/" 
          className="mb-4 inline-flex items-center text-primary-800 hover:text-primary-700 dark:text-accent-600 dark:hover:text-accent-500"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="flex flex-col justify-between sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-accent-600" />
              <h1 className="text-3xl font-bold text-primary-800 dark:text-white">
                AI-Curated Recommendations
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Personalized product suggestions based on your preferences and browsing history
            </p>
          </div>
          
          <div className="mt-4 flex items-center rounded-lg bg-white p-2 shadow-sm dark:bg-gray-800 sm:mt-0">
            <Filter className="mr-2 h-4 w-4 text-gray-500" />
            <select className="bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300">
              <option>All Recommendations</option>
              <option>Style Matches</option>
              <option>Trending Items</option>
              <option>Based on History</option>
            </select>
          </div>
        </div>
        
        {/* Recommendation explanation */}
        <div className="mb-8 mt-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-2 text-xl font-semibold text-primary-800 dark:text-white">
            How We Create Your Recommendations
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Our AI analyzes your browsing history, past purchases, style preferences, and current trends to suggest 
            products that match your unique taste. Each recommendation includes a match score indicating how well it 
            aligns with your preferences.
          </p>
        </div>
        
        {/* Product grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedProducts.map((product) => (
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
                  <p className="mb-2 font-semibold text-primary-800 dark:text-accent-600">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {product.reason}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
} 