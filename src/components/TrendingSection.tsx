"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import ProductCard from "./ProductCard";
import { Button } from "./ui/Button"; // Adjusted to reflect the correct relative path
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
// Emergency product generator function
const createEmergencyProducts = () => {
  return [
    {
      id: `emergency_${Date.now()}_1`,
      name: 'Stylish Dress',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80',
      description: 'A beautiful dress for any occasion.',
      sustainabilityScore: 4,
      isNew: true,
      isFavorite: false,
      category: 'Clothing',
      tags: ['dress', 'elegant'],
      created_at: new Date().toISOString(),
      images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80'],
      inventory: 10
    },
    {
      id: `emergency_${Date.now()}_2`,
      name: 'Casual Shirt',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
      description: 'Comfortable everyday shirt.',
      sustainabilityScore: 5,
      isNew: true,
      isFavorite: false,
      category: 'Clothing',
      tags: ['casual', 'shirt'],
      created_at: new Date().toISOString(),
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
      inventory: 15
    },
    {
      id: `emergency_${Date.now()}_3`,
      name: 'Designer Bag',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80',
      description: 'Elegant bag for any occasion.',
      sustainabilityScore: 3,
      isNew: true,
      isFavorite: false,
      category: 'Accessories',
      tags: ['bag', 'designer'],
      created_at: new Date().toISOString(),
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80'],
      inventory: 5
    }
  ];
};
import { Separator } from "@/components/ui/separator";
import { productApi, Product } from "@/services/api";

interface TrendingSectionProps {
  title?: string;
  subtitle?: string;
  products?: Product[];
}

const TrendingSection = ({
  title = "Trending Now",
  subtitle = "Curated for your unique style preferences",
  products,
}: TrendingSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 3;

  // Fetch products from API if not provided as props
  useEffect(() => {
    const fetchProducts = async () => {
      if (products) {
        setProductData(products);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Clear any previous errors
        setError(null);

        console.log('TrendingSection: Fetching products...');

        // EMERGENCY WRAPPER: Wrap the entire API call in a try-catch with a timeout
        let data;
        try {
          // Create a promise that rejects after 3 seconds
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Emergency timeout')), 3000);
          });

          // Race between the actual request and the timeout
          data = await Promise.race([
            productApi.getProducts({
              sortBy: 'created_at',
              sortOrder: 'desc',
              limit: 10
            }),
            timeoutPromise
          ]);
        } catch (emergencyError) {
          console.warn('TrendingSection: Emergency fallback activated due to:', emergencyError);
          // Generate emergency products directly in the component
          data = [
            {
              id: `component_emergency_${Date.now()}_1`,
              name: 'Featured Product',
              price: 129.99,
              image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
              description: 'A high-quality product for any occasion.',
              sustainabilityScore: 4,
              isNew: true,
              isFavorite: false,
              category: 'Featured',
              tags: ['featured'],
              created_at: new Date().toISOString(),
              images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80'],
              inventory: 10
            },
            {
              id: `component_emergency_${Date.now()}_2`,
              name: 'Trending Item',
              price: 79.99,
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
              description: 'One of our most popular items.',
              sustainabilityScore: 5,
              isNew: true,
              isFavorite: false,
              category: 'Trending',
              tags: ['trending'],
              created_at: new Date().toISOString(),
              images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'],
              inventory: 8
            }
          ];
        }

        console.log('TrendingSection: Received data:', data ? `${Array.isArray(data) ? data.length : 'not array'} items` : 'no data');

        // Validate the data with triple-layer protection
        if (!data) {
          console.warn('TrendingSection: No data returned');
          // Create emergency products
          setProductData(createEmergencyProducts());
          setError('Using demo products while we connect to our database.');
        } else if (!Array.isArray(data)) {
          console.warn('TrendingSection: Data is not an array:', data);
          // Create emergency products
          setProductData(createEmergencyProducts());
          setError('Using demo products while we connect to our database.');
        } else if (data.length === 0) {
          console.warn('TrendingSection: Empty array returned');
          // Create emergency products
          setProductData(createEmergencyProducts());
          setError('Using demo products while we connect to our database.');
        } else {
          console.log('TrendingSection: Successfully loaded', data.length, 'products');
          setProductData(data);
          setError(null);
        }
      } catch (err) {
        console.error('TrendingSection: Unexpected error:', err);
        setProductData([]);
        setError('An unexpected error occurred. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [products]);

  // Get unique categories from products
  const categories = React.useMemo(() => {
    if (!productData.length) return ["all"];

    return [
      "all",
      ...Array.from(new Set(productData.map((product) => product.category)))
    ];
  }, [productData]);

  // Filter products based on active tab and price range
  useEffect(() => {
    if (!productData.length) {
      setFilteredProducts([]);
      return;
    }

    // Use a function to avoid recreating the filtered array on each render
    const getFilteredProducts = () => {
      let filtered = [...productData];

      // Filter by category
      if (activeTab !== "all") {
        filtered = filtered.filter((product) => product.category === activeTab);
      }

      // Filter by price range
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1],
      );

      return filtered;
    };

    setFilteredProducts(getFilteredProducts());
    setCurrentPage(0); // Reset to first page when filters change
  }, [activeTab, priceRange, productData]);

  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage,
  );

  const nextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddToBag = (id: string) => {
    console.log(`Added product ${id} to bag`);
    // Here you would add the product to the cart/bag state
  };

  const handleQuickView = (id: string) => {
    console.log(`Quick view for product ${id}`);
    // Here you would handle the quick view logic
  };

  const handleFavoriteToggle = (id: string, isFavorite: boolean) => {
    console.log(`Product ${id} favorite status: ${isFavorite}`);
    // Here you would update the favorite status in your state/database
  };

  if (loading) {
    return (
      <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-64 bg-gray-200 animate-pulse rounded mt-2"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="h-64 bg-gray-200 animate-pulse rounded-md mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">{title}</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h2>
            <motion.p
              className="text-gray-600 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <motion.div
            className="mb-8 p-6 bg-white rounded-lg shadow-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Price Range</h3>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={3000}
                  step={100}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Sustainability</h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Badge
                      key={score}
                      variant="outline"
                      className="cursor-pointer"
                    >
                      {score}+ Eco Score
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-white">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.image}
                        description={product.description}
                        sustainabilityScore={product.sustainabilityScore}
                        isNew={product.isNew}
                        isFavorite={product.isFavorite}
                        onAddToBag={handleAddToBag}
                        onQuickView={handleQuickView}
                        onFavoriteToggle={handleFavoriteToggle}
                      />
                    </motion.div>
                  ))}
                </div>

                {pageCount > 1 && (
                  <div className="flex justify-center items-center mt-12 space-x-4">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={prevPage}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="text-sm">
                      Page {currentPage + 1} of {pageCount}
                    </div>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={nextPage}
                      disabled={currentPage === pageCount - 1}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">
                  No products match your current filters.
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setActiveTab("all");
                    setPriceRange([0, 3000]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Separator className="my-16" />

        <div className="text-center">
          <h3 className="text-xl font-medium mb-4">Discover More</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="cursor-pointer">
              New Arrivals
            </Badge>
            <Badge variant="secondary" className="cursor-pointer">
              Sustainable Choices
            </Badge>
            <Badge variant="secondary" className="cursor-pointer">
              Limited Editions
            </Badge>
            <Badge variant="secondary" className="cursor-pointer">
              Seasonal Essentials
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
