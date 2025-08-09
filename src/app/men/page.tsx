'use client';

import { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { productService } from '@/services/productService';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';

export default function MenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Define Product type to avoid using any
  type Product = {
    id: string;
    name: string;
    price: number;
    image?: string;
    images?: string[];
    type?: string;
    category_name?: string;
    description?: string;
    sustainability_score?: number;
    sizes?: string[];
    colors?: string[];
    created_at?: string;
  };
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
  const defaultCategories = ['All', 'Shirts', 'Pants', 'Suits', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Blue', 'Gray', 'Brown', 'Green'];
  const sortOptions = [
    { value: 'created_at', label: 'Newest Arrivals' },
    { value: 'price', label: 'Price' },
    { value: 'name', label: 'Name' },
    { value: 'sustainabilityScore', label: 'Sustainability' },
  ];

  // Listen for product-created events
  useEffect(() => {
    const handleProductCreated = (event: any) => {
      console.log('Product created event received:', event.detail);
      // Refresh the products list
      fetchProducts();
    };

    // Add event listener
    window.addEventListener('product-created', handleProductCreated);

    // Clean up
    return () => {
      window.removeEventListener('product-created', handleProductCreated);
    };
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await productService.getProducts();

      // Filter for men's products - only using type filter
      const mensProducts = allProducts.filter(product =>
        product.type === 'Man'
      );

      // Extract unique categories from men's products
      const categorySet = new Set<string>();
      mensProducts
        .filter(product => product.category_name)
        .forEach(product => {
          if (product.category_name) {
            categorySet.add(product.category_name);
          }
        });
      const uniqueCategories = ['All', ...Array.from(categorySet)];
      setCategories(uniqueCategories);

      // Apply category filter
      let filteredProducts = mensProducts;
      if (selectedCategory && selectedCategory !== 'All') {
        filteredProducts = filteredProducts.filter(
          product => product.category_name?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      // Apply price range filter
      filteredProducts = filteredProducts.filter(
        product => product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // Apply size filter
      if (selectedSizes.length > 0) {
        filteredProducts = filteredProducts.filter(
          product => product.sizes?.some(size => selectedSizes.includes(size))
        );
      }

      // Apply color filter
      if (selectedColors.length > 0) {
        filteredProducts = filteredProducts.filter(
          product => product.colors?.some(color => selectedColors.includes(color))
        );
      }

      // Sort products
      filteredProducts.sort((a, b) => {
        if (sortBy === 'price') {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        }
        if (sortBy === 'name') {
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortBy === 'sustainabilityScore') {
          return sortOrder === 'asc'
            ? (a.sustainability_score || 0) - (b.sustainability_score || 0)
            : (b.sustainability_score || 0) - (a.sustainability_score || 0);
        }
        // Default sort by created_at
        return sortOrder === 'asc'
          ? new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
          : new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

      // Convert to the correct type before setting state
      setProducts(paginatedProducts.map(p => ({
        id: p.id || '',
        name: p.name,
        price: p.price,
        image: p.image,
        images: p.images,
        type: p.type,
        category_name: p.category_name,
        description: p.description,
        sustainability_score: p.sustainability_score,
        sizes: p.sizes,
        colors: p.colors,
        created_at: p.created_at
      })));
      setTotalProducts(filteredProducts.length);
    } catch (error) {
      console.error('Failed to fetch men\'s products:', error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
  const FiltersComponent = ({ isMobile = false }) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {(categories.length > 0 ? categories : defaultCategories).map(category => (
            <button
              key={category}
              className={`block w-full text-left px-3 py-2 rounded transition-colors ${selectedCategory === category.toLowerCase() ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              onClick={() => {
                handleCategoryChange(category);
                if (isMobile) setIsMobileFilterOpen(false);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Size</h3>
        <div className="flex flex-wrap gap-3">
          {sizes.map(size => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? 'primary' : 'outline'}
              className={`h-10 w-10 p-0 rounded-full transition-all ${selectedSizes.includes(size) ? 'shadow-md' : ''} ${isMobile ? 'touch-manipulation' : ''}`}
              onClick={() => handleSizeToggle(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Color</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {colors.map(color => (
            <div key={color} className="flex items-center space-x-3">
              <Checkbox
                id={`color-${color}${isMobile ? '-mobile' : ''}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => handleColorToggle(color)}
                className="h-5 w-5 rounded-sm"
              />
              <label
                htmlFor={`color-${color}${isMobile ? '-mobile' : ''}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
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
          <div className="flex justify-between items-center mt-2">
            <div className="bg-muted px-3 py-1 rounded-md">
              <span className="font-medium">${priceRange[0]}</span>
            </div>
            <div className="h-[1px] flex-1 bg-muted mx-2"></div>
            <div className="bg-muted px-3 py-1 rounded-md">
              <span className="font-medium">${priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {isMobile && (
        <div className="pt-4 mt-4 border-t">
          <Button
            className="w-full"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <HeaderWrapper />
      <div className="container mx-auto px-4 py-6 sm:py-8 mt-16 sm:mt-20">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Men's Collection</h1>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:w-1/4 xl:w-1/5 sticky top-24 self-start">
            <Card className="p-5 shadow-sm rounded-lg">
              <FiltersComponent />
            </Card>
          </div>

          {/* Mobile Filter Button and Sort Controls */}
          <div className="lg:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto shadow-sm hover:shadow-md transition-all"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {selectedSizes.length > 0 || selectedColors.length > 0 || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000 ?
                      <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                        {[selectedCategory ? 1 : 0, selectedSizes.length, selectedColors.length, (priceRange[0] > 0 || priceRange[1] < 1000) ? 1 : 0].reduce((a, b) => a + b, 0)}
                      </span> : ''}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-[400px] overflow-y-auto">
                  <SheetTitle>Filters</SheetTitle>
                  <div className="flex items-center justify-between mb-6">
                    <SheetClose asChild>
                      <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 ml-auto">
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>
                  <FiltersComponent isMobile={true} />
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[180px] shadow-sm">
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
              <Button
                variant="outline"
                onClick={toggleSortOrder}
                className="px-3 flex-shrink-0 shadow-sm hover:shadow-md transition-all"
                size="sm"
              >
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {/* Product Grid and Sorting */}
          <div className="lg:w-3/4 xl:w-4/5">
            <div className="hidden lg:flex justify-end mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] shadow-sm">
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
                <Button
                  variant="outline"
                  onClick={toggleSortOrder}
                  className="px-3 shadow-sm hover:shadow-md transition-all"
                  size="sm"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-1" />
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000) && (
              <div className="mb-6 p-3 bg-muted/30 rounded-lg border border-muted">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium mr-1">Active filters:</span>
                  {selectedCategory && (
                    <Button variant="secondary" size="sm" className="h-7 text-xs rounded-full shadow-sm" onClick={() => setSelectedCategory('')}>
                      Category: {selectedCategory} <X className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  {selectedSizes.length > 0 && (
                    <Button variant="secondary" size="sm" className="h-7 text-xs rounded-full shadow-sm" onClick={() => setSelectedSizes([])}>
                      Size: {selectedSizes.join(', ')} <X className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  {selectedColors.length > 0 && (
                    <Button variant="secondary" size="sm" className="h-7 text-xs rounded-full shadow-sm" onClick={() => setSelectedColors([])}>
                      Color: {selectedColors.join(', ')} <X className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <Button variant="secondary" size="sm" className="h-7 text-xs rounded-full shadow-sm" onClick={() => setPriceRange([0, 1000])}>
                      Price: ${priceRange[0]}-${priceRange[1]} <X className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs ml-auto"
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedSizes([]);
                      setSelectedColors([]);
                      setPriceRange([0, 1000]);
                    }}
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}

            {products.length > 0 ? (
              <ProductGrid
                products={products.map(p => ({
                  id: p.id || '',
                  name: p.name,
                  price: p.price,
                  image: p.image || '',
                  description: p.description || '',
                  category_name: p.category_name || '',
                  sustainabilityScore: p.sustainability_score,
                  isNew: false,
                  isFavorite: false
                }))}
                isLoading={loading}
                className="min-h-[300px] gap-6 md:gap-8"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center min-h-[300px]">
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
            {products.length > 0 && totalProducts > limit && (
              <div className="mt-10 flex justify-center">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="h-9 px-4 sm:h-10 sm:px-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <span className="mr-1">←</span> Previous
                  </Button>

                  <div className="flex items-center bg-muted/30 px-4 py-2 rounded-md border border-muted">
                    <span className="text-sm font-medium">
                      Page {page} of {Math.ceil(totalProducts / limit)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page * limit >= totalProducts}
                    className="h-9 px-4 sm:h-10 sm:px-5 shadow-sm hover:shadow-md transition-all"
                  >
                    Next <span className="ml-1">→</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
