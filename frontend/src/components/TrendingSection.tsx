"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { productApi } from "@/services/api";

interface TrendingSectionProps {
  title?: string;
  subtitle?: string;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
  title = "Trending Now",
  subtitle = "Curated for your unique style preferences",
}) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('TrendingSection: Fetching products...');
        
        // Fetch products from the API
        const data = await productApi.getProducts({
          sortBy: 'created_at',
          sortOrder: 'desc',
          limit: 10
        });
        
        console.log('TrendingSection: Received data:', data ? `${Array.isArray(data) ? data.length : 'not array'} items` : 'no data');
        
        // Process the data
        if (Array.isArray(data) && data.length > 0) {
          // Transform the data to match our ProductCard component props
          const processedData = data.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || (product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600x400?text=No+Image'),
            images: product.images || [product.image],
            description: product.description || '',
            sustainabilityScore: product.sustainabilityScore || 3,
            isNew: product.isNew || false,
            isFavorite: product.isFavorite || false,
            category: product.category || 'Uncategorized',
            tags: product.tags || [],
            inventory: product.inventory || 0,
            compareAtPrice: product.compareAtPrice || product.compare_at_price,
            // Add default sizes if not provided
            sizes: product.sizes || ['S', 'M', 'L', 'XL'],
            // Add default colors if not provided
            colors: product.colors || []
          }));
          
          setProducts(processedData);
          setError(null);
        } else {
          console.warn('TrendingSection: No valid products returned');
          setProducts([]);
          setError('No products found. Please check back later.');
        }
      } catch (err) {
        console.error('TrendingSection: Error fetching products:', err);
        setProducts([]);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Function to handle adding products to bag
  const handleAddToBag = (id: string, size?: string, color?: string) => {
    console.log(`Added product ${id} to bag (size: ${size}, color: ${color})`);
    // Here you would add the product to the cart/bag
  };
  
  // Function to handle quick view
  const handleQuickView = (id: string) => {
    console.log(`Quick view for product ${id}`);
    // Here you would handle the quick view logic
  };
  
  // Function to handle favorite toggle
  const handleFavoriteToggle = (id: string, isFavorite: boolean) => {
    console.log(`Product ${id} favorite status: ${isFavorite}`);
    // Here you would update the favorite status
  };
  
  // Render loading state
  if (loading) {
    return (
      <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  // Render products
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                images={product.images}
                description={product.description}
                sustainabilityScore={product.sustainabilityScore}
                isNew={product.isNew}
                isFavorite={product.isFavorite}
                category={product.category}
                tags={product.tags}
                inventory={product.inventory}
                compareAtPrice={product.compareAtPrice}
                sizes={product.sizes}
                colors={product.colors}
                onAddToBag={handleAddToBag}
                onQuickView={handleQuickView}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingSection;
