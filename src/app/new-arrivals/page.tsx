"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import {Skeleton} from "@/components/ui/skeleton"
// Correcting the error by removing the non-existent export 'SkeletonLoader'
import { 
  Filter, 
  ChevronDown, 
  ShoppingBag, 
  Heart, 
  Star, 
  ArrowLeft, 
  ArrowRight,
  Sparkles
} from "lucide-react";

/**
 * New Arrivals Page
 * Displays the latest products added to the store
 */
export default function NewArrivalsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Fetch products
  useEffect(() => {
    const fetchNewArrivals = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for new arrivals
      const mockProducts = [
        {
          id: "1",
          name: "Premium Cotton T-Shirt",
          price: 29.99,
          rating: 4.5,
          reviewCount: 24,
          isNew: true,
          dateAdded: "2023-05-15",
          category: "clothing"
        },
        {
          id: "2",
          name: "Slim Fit Jeans",
          price: 59.99,
          rating: 4.2,
          reviewCount: 18,
          isNew: true,
          dateAdded: "2023-05-14",
          category: "clothing"
        },
        {
          id: "3",
          name: "Casual Hoodie",
          price: 49.99,
          rating: 4.7,
          reviewCount: 32,
          isNew: true,
          dateAdded: "2023-05-12",
          category: "clothing"
        },
        {
          id: "4",
          name: "Summer Dress",
          price: 79.99,
          rating: 4.8,
          reviewCount: 41,
          isNew: true,
          dateAdded: "2023-05-10",
          category: "clothing"
        },
        {
          id: "5",
          name: "Leather Jacket",
          price: 129.99,
          rating: 4.6,
          reviewCount: 15,
          isNew: true,
          dateAdded: "2023-05-08",
          category: "clothing"
        },
        {
          id: "6",
          name: "Running Shoes",
          price: 89.99,
          rating: 4.4,
          reviewCount: 29,
          isNew: true,
          dateAdded: "2023-05-05",
          category: "footwear"
        }
      ];
      
      setProducts(mockProducts);
      setIsLoading(false);
    };
    
    fetchNewArrivals();
  }, []);
  
  // Filter products by category
  const filteredProducts = products.filter(product => {
    if (activeCategory === "all") return true;
    return product.category === activeCategory;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    } else if (sortOption === "price-low-high") {
      return a.price - b.price;
    } else if (sortOption === "price-high-low") {
      return b.price - a.price;
    } else if (sortOption === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });
  
  // Pagination
  const productsPerPage = 6;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">New Arrivals</h1>
          <p className="text-gray-600">Discover our latest products and collections</p>
        </div>
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeCategory === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All
            </Button>
            <Button 
              variant={activeCategory === 'clothing' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveCategory('clothing')}
            >
              Clothing
            </Button>
            <Button 
              variant={activeCategory === 'footwear' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveCategory('footwear')}
            >
              Footwear
            </Button>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center">
            <span className="text-sm mr-2">Sort by:</span>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
        
        {/* Filter Button (Mobile) */}
        <div className="md:hidden mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full flex items-center justify-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* Filter Panel (Mobile) */}
        {filterOpen && (
          <div className="md:hidden mb-6 p-4 border rounded-md">
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2 mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" checked={activeCategory === 'all'} onChange={() => setActiveCategory('all')} />
                <span>All</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" checked={activeCategory === 'clothing'} onChange={() => setActiveCategory('clothing')} />
                <span>Clothing</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" checked={activeCategory === 'footwear'} onChange={() => setActiveCategory('footwear')} />
                <span>Footwear</span>
              </label>
            </div>
            
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="space-y-2 mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Under $50</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>$50 - $100</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>$100 - $200</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>$200 & Above</span>
              </label>
            </div>
            
            <h3 className="font-medium mb-3">Rating</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1">only</span>
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1">& Up</span>
                </span>
              </label>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" className="mr-2">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </div>
        )}
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loaders while loading
            Array(6).fill(0).map((_, index) => (
              <Card key={index}>
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                  <div className="h-64 w-full bg-gray-300 animate-pulse"></div>
                </div>
                <CardContent className="p-4">
                  <div className="h-6 w-3/4 mb-2 bg-gray-300 animate-pulse"></div>
                  <div className="h-5 w-1/4 mb-4 bg-gray-300 animate-pulse"></div>
                  <div className="h-10 w-full rounded-md bg-gray-300 animate-pulse"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual products
            currentProducts.map((product) => (
              <Card key={product.id} className="group">
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
                    <div className="h-64 bg-gray-200 relative">
                      {/* This would be an actual image in production */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        [Product Image]
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-[#1a1a1a] text-white text-xs px-2 py-1 rounded">New</span>
                    </div>
                    {product.id === "3" && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Recommended
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg group-hover:text-[#e5d7bd] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center mt-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          aria-label="Add to wishlist"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 rounded-full bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          )}
        </div>
        
        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="mx-4 flex space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentPage === i + 1 
                      ? 'bg-[#1a1a1a] text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  aria-label={`Page ${i + 1}`}
                  aria-current={currentPage === i + 1 ? 'page' : undefined}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or check back later for new arrivals.
            </p>
            <Link href="/products">
              <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Browse All Products
              </a>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 