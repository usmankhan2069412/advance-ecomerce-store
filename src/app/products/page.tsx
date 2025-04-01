'use client';

import { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { productApi, Product } from '@/services/api';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const limit = 12;
  const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow'];
  const sortOptions = [
    { value: 'created_at', label: 'Newest Arrivals' },
    { value: 'price', label: 'Price' },
    { value: 'name', label: 'Name' },
    { value: 'sustainabilityScore', label: 'Sustainability' },
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          limit,
          offset: (page - 1) * limit,
          sortBy,
          sortOrder,
        };

        // Add filters if selected
        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }

        if (priceRange[0] > 0) {
          params.minPrice = priceRange[0];
        }

        if (priceRange[1] < 1000) {
          params.maxPrice = priceRange[1];
        }

        // Add size filter if selected
        if (selectedSizes.length > 0) {
          params.sizes = selectedSizes.join(',');
        }

        // Add color filter if selected
        if (selectedColors.length > 0) {
          params.colors = selectedColors.join(',');
        }

        const data = await productApi.getProducts(params);
        
        if (data && data.length > 0) {
          setProducts(data);
          // In a real app, we would get the total count from the API response
          // For now, estimate based on the data we have
          setTotalProducts(Math.max(data.length * 3, 100)); // Estimate total count
        } else {
          // No products found or empty response
          setProducts([]);
          setTotalProducts(0);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Use mock data if API fails
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Silk Evening Gown',
            price: 1299.99,
            image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80',
            description: 'Exquisite hand-crafted silk evening gown with delicate embroidery.',
            sustainabilityScore: 4,
            isNew: true,
            isFavorite: false,
            category: 'Dresses',
            tags: ['silk', 'evening', 'formal'],
            created_at: '2023-01-01',
            images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80'],
            inventory: 10
          },
          {
            id: '2',
            name: 'Cotton Summer Dress',
            price: 499.99,
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80',
            description: 'Lightweight cotton dress perfect for summer days.',
            sustainabilityScore: 5,
            isNew: true,
            isFavorite: false,
            category: 'Dresses',
            tags: ['cotton', 'summer', 'casual'],
            created_at: '2023-02-01',
            images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80'],
            inventory: 25
          },
          {
            id: '3',
            name: 'Linen Blouse',
            price: 299.99,
            image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80',
            description: 'Breathable linen blouse for a sophisticated look.',
            sustainabilityScore: 4,
            isNew: false,
            isFavorite: false,
            category: 'Tops',
            tags: ['linen', 'blouse', 'formal'],
            created_at: '2023-03-01',
            images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80'],
            inventory: 15
          }
        ];
        
        // Filter mock data based on current filters
        let filteredMockProducts = [...mockProducts];
        
        // Apply category filter
        if (selectedCategory && selectedCategory !== 'all') {
          filteredMockProducts = filteredMockProducts.filter(
            product => product.category.toLowerCase() === selectedCategory
          );
        }
        
        // Apply price range filter
        filteredMockProducts = filteredMockProducts.filter(
          product => product.price >= priceRange[0] && product.price <= priceRange[1]
        );
        
        setProducts(filteredMockProducts);
        setTotalProducts(mockProducts.length);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategory, selectedSizes, selectedColors, priceRange, sortBy, sortOrder]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category.toLowerCase());
    setPage(1); // Reset to first page when changing filters
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setPage(1);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    // If sorting by price, we might want to change the order
    if (value === 'price') {
      setSortOrder('asc'); // Lower price first by default
    } else {
      setSortOrder('desc'); // Newest first for other sorts
    }
    setSortBy(value);
    setPage(1);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Filter component for both desktop and mobile
  const FiltersComponent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category}
              className={`block w-full text-left px-3 py-2 rounded ${selectedCategory === category.toLowerCase() ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? 'default' : 'outline'}
              className="h-10 w-10 p-0"
              onClick={() => handleSizeToggle(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => handleColorToggle(color)}
              />
              <label
                htmlFor={`color-${color}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 1000]}
            max={1000}
            step={10}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceRangeChange}
            className="my-6"
          />
          <div className="flex justify-between">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:w-1/4">
          <Card className="p-4">
            <FiltersComponent />
          </Card>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <h2 className="text-xl font-bold mb-6">Filters</h2>
              <FiltersComponent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={toggleSortOrder} className="px-2">
              <SlidersHorizontal className="h-4 w-4" />
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        {/* Product Grid and Sorting */}
        <div className="lg:w-3/4">
          <div className="hidden lg:flex justify-end mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" onClick={toggleSortOrder} className="px-2">
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} isLoading={loading} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <Filter className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No products found</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Try adjusting your filters or search criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSizes([]);
                  setSelectedColors([]);
                  setPriceRange([0, 1000]);
                  setSortBy('created_at');
                  setSortOrder('desc');
                  setPage(1);
                }}
              >
                Reset all filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page * limit >= totalProducts}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}