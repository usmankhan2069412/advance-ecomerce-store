"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TrendingSectionProps {
  title?: string;
  subtitle?: string;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    sustainabilityScore: number;
    isNew: boolean;
    isFavorite: boolean;
    category: string;
  }>;
}

const TrendingSection = ({
  title = "Trending Now",
  subtitle = "Curated for your unique style preferences",
  products = [
    {
      id: "1",
      name: "Silk Couture Evening Gown",
      price: 1299.99,
      image:
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80",
      description:
        "Exquisite hand-crafted silk evening gown with delicate embroidery and a modern silhouette.",
      sustainabilityScore: 4,
      isNew: true,
      isFavorite: false,
      category: "dresses",
    },
    {
      id: "2",
      name: "Cashmere Oversized Coat",
      price: 2499.99,
      image:
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&q=80",
      description:
        "Luxurious oversized cashmere coat with minimalist design and exceptional warmth.",
      sustainabilityScore: 3,
      isNew: true,
      isFavorite: false,
      category: "outerwear",
    },
    {
      id: "3",
      name: "Leather Platform Boots",
      price: 899.99,
      image:
        "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=400&q=80",
      description:
        "Statement platform boots crafted from premium leather with architectural heel design.",
      sustainabilityScore: 2,
      isNew: false,
      isFavorite: true,
      category: "footwear",
    },
    {
      id: "4",
      name: "Structured Wool Blazer",
      price: 1199.99,
      image:
        "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80",
      description:
        "Precision-tailored wool blazer with strong shoulders and contemporary proportions.",
      sustainabilityScore: 5,
      isNew: false,
      isFavorite: false,
      category: "outerwear",
    },
    {
      id: "5",
      name: "Embellished Clutch Bag",
      price: 799.99,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
      description:
        "Artisanal clutch bag with hand-applied crystal embellishments and satin finish.",
      sustainabilityScore: 3,
      isNew: true,
      isFavorite: false,
      category: "accessories",
    },
    {
      id: "6",
      name: "Silk Printed Scarf",
      price: 349.99,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
      description:
        "Limited edition silk scarf featuring original artwork from our artist collaboration series.",
      sustainabilityScore: 4,
      isNew: false,
      isFavorite: true,
      category: "accessories",
    },
  ],
}: TrendingSectionProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 3;

  const categories = [
    "all",
    ...new Set(products.map((product) => product.category)),
  ];

  useEffect(() => {
    // Use a function to avoid recreating the filtered array on each render
    const getFilteredProducts = () => {
      let filtered = [...products];

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
  }, [activeTab, priceRange, products]);

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
                      size="icon"
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
                      size="icon"
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
