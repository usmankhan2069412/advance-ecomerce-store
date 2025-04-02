"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import ProductCard from "./ProductCard";
import { Button } from "./ui/Button"; // Adjusted to reflect the correct relative path
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
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
        const data = await productApi.getProducts({
          sortBy: 'created_at',
          sortOrder: 'desc',
          limit: 10
        });
        setProductData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
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
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
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
