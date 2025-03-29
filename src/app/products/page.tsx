'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  size: string;
  color: string;
}

const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 200) + 50,
  image: `/images/products/product-${i + 1}.jpg`,
  category: ['Dresses', 'Tops', 'Bottoms'][Math.floor(Math.random() * 3)],
  size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
  color: ['Black', 'White', 'Blue', 'Red'][Math.floor(Math.random() * 4)],
}));

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);

  const categories = ['All', 'Dresses', 'Tops', 'Bottoms'];
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Black', 'White', 'Blue', 'Red'];
  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest Arrivals' },
  ];

  const filteredProducts = products
    .filter(product =>
      selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    .filter(product =>
      selectedSizes.length === 0 || selectedSizes.includes(product.size)
    )
    .filter(product =>
      selectedColors.length === 0 || selectedColors.includes(product.color)
    )
    .filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`block w-full text-left px-3 py-2 rounded ${selectedCategory === category.toLowerCase() ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Size</h3>
            <div className="space-y-2">
              {sizes.map(size => (
                <div key={size} className="flex items-center">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSizes([...selectedSizes, size]);
                      } else {
                        setSelectedSizes(selectedSizes.filter(s => s !== size));
                      }
                    }}
                  />
                  <label htmlFor={`size-${size}`} className="ml-2">{size}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Color</h3>
            <div className="space-y-2">
              {colors.map(color => (
                <div key={color} className="flex items-center">
                  <Checkbox
                    id={`color-${color}`}
                    checked={selectedColors.includes(color)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedColors([...selectedColors, color]);
                      } else {
                        setSelectedColors(selectedColors.filter(c => c !== color));
                      }
                    }}
                  />
                  <label htmlFor={`color-${color}`} className="ml-2">{color}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Price Range</h3>
            <Slider
              defaultValue={[0, 500]}
              max={500}
              step={10}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mt-2"
            />
            <div className="flex justify-between mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Products</h2>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card
                key={product.id}
                className="group relative overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                  <Button
                    variant="secondary"
                    className="w-full mt-2"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    Quick View
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick View Modal */}
          <Dialog
            open={!!quickViewProduct}
            onOpenChange={() => setQuickViewProduct(null)}
          >
            {quickViewProduct && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{quickViewProduct.name}</h2>
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-96 object-cover mb-4"
                />
                <p className="text-xl font-semibold mb-2">${quickViewProduct.price}</p>
                <div className="space-y-2">
                  <p><span className="font-semibold">Category:</span> {quickViewProduct.category}</p>
                  <p><span className="font-semibold">Size:</span> {quickViewProduct.size}</p>
                  <p><span className="font-semibold">Color:</span> {quickViewProduct.color}</p>
                </div>
                <Button className="w-full mt-4">Add to Cart</Button>
              </div>
            )}
          </Dialog>

          {/* Load More Button */}
          <Button
            variant="outline"
            className="w-full mt-8"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
}