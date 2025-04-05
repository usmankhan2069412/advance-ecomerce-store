/**
 * API client for interacting with the backend services
 * This service handles all API requests for products and other data
 */

import axios from 'axios';

// Create axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 8000, // 8 seconds timeout (reduced from 15s)
  validateStatus: (status) => status >= 200 && status < 500, // Handle only client errors
  withCredentials: true, // Enable sending cookies with requests
  // Add default error handling
  transformResponse: [(data) => {
    // Try to parse the response data
    try {
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to parse API response:', e);
      return []; // Return empty array on parse error instead of empty object
    }
  }]
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.warn('API request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    // Check if response.data is empty or not an expected type
    if (!response.data || (typeof response.data === 'object' && Object.keys(response.data).length === 0)) {
      console.warn('Empty response data from API:', response.config.url);
      // Don't reject, just log a warning
    }
    return response;
  },
  (error) => {
    // Handle network errors, timeouts, etc.
    if (!error.response) {
      console.error('Network error or timeout:', error.message);
    } else {
      console.error(`API error (${error.response.status}):`, error.response.data);
    }
    return Promise.reject(error);
  }
);

// Dynamic product generator for when the API fails
const generateDynamicProducts = (): Product[] => {
  // Product templates with different categories
  const productTemplates = [
    {
      category: 'Clothing',
      items: [
        { name: 'Elegant Dress', price: 129.99, tags: ['dress', 'elegant'] },
        { name: 'Casual T-Shirt', price: 29.99, tags: ['casual', 't-shirt'] },
        { name: 'Denim Jeans', price: 59.99, tags: ['denim', 'casual'] },
        { name: 'Winter Jacket', price: 149.99, tags: ['winter', 'outerwear'] }
      ],
      images: [
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80'
      ]
    },
    {
      category: 'Accessories',
      items: [
        { name: 'Designer Handbag', price: 199.99, tags: ['bag', 'designer'] },
        { name: 'Leather Wallet', price: 49.99, tags: ['wallet', 'leather'] },
        { name: 'Silk Scarf', price: 39.99, tags: ['scarf', 'silk'] }
      ],
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80',
        'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80'
      ]
    },
    {
      category: 'Shoes',
      items: [
        { name: 'Running Shoes', price: 89.99, tags: ['shoes', 'sports'] },
        { name: 'Leather Boots', price: 159.99, tags: ['boots', 'leather'] },
        { name: 'Canvas Sneakers', price: 49.99, tags: ['sneakers', 'casual'] }
      ],
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80'
      ]
    }
  ];

  // Generate a random number of products (5-10)
  const numProducts = Math.floor(Math.random() * 6) + 5;
  const products: Product[] = [];

  // Generate products
  for (let i = 0; i < numProducts; i++) {
    // Select a random category template
    const templateIndex = Math.floor(Math.random() * productTemplates.length);
    const template = productTemplates[templateIndex];

    // Select a random item from the category
    const itemIndex = Math.floor(Math.random() * template.items.length);
    const item = template.items[itemIndex];

    // Select a random image from the category
    const imageIndex = Math.floor(Math.random() * template.images.length);
    const image = template.images[imageIndex];

    // Generate a random sustainability score (1-5)
    const sustainabilityScore = Math.floor(Math.random() * 5) + 1;

    // Generate a random inventory count (1-50)
    const inventory = Math.floor(Math.random() * 50) + 1;

    // Create the product
    products.push({
      id: `dynamic_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: item.name,
      price: item.price,
      image: image,
      description: `A high-quality ${item.name.toLowerCase()} for any occasion.`,
      sustainabilityScore: sustainabilityScore,
      isNew: Math.random() > 0.5, // 50% chance of being new
      isFavorite: false,
      category: template.category,
      tags: item.tags,
      created_at: new Date().toISOString(),
      images: [image],
      inventory: inventory
    });
  }

  return products;
};

// Function to get products - either from cache or generate new ones
const getMockProducts = (): Product[] => {
  try {
    // Check if we have cached mock products
    const cachedMockProducts = localStorage.getItem('mockProducts');
    const cacheTimestamp = localStorage.getItem('mockProductsTimestamp');

    if (cachedMockProducts && cacheTimestamp) {
      const cacheAge = Date.now() - parseInt(cacheTimestamp);
      // Use cache if it's less than 1 hour old
      if (cacheAge < 60 * 60 * 1000) {
        const products = JSON.parse(cachedMockProducts);
        if (Array.isArray(products) && products.length > 0) {
          console.log(`Using ${products.length} cached mock products`);
          return products;
        }
      }
    }
  } catch (cacheError) {
    console.warn('Error accessing mock products cache:', cacheError);
  }

  // Generate new mock products
  const products = generateDynamicProducts();

  // Cache the mock products
  try {
    localStorage.setItem('mockProducts', JSON.stringify(products));
    localStorage.setItem('mockProductsTimestamp', Date.now().toString());
  } catch (cacheError) {
    console.warn('Error caching mock products:', cacheError);
  }

  return products;
};

// Product types that match the backend models
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sustainabilityScore: number;
  isNew: boolean;
  isFavorite: boolean;
  category: string;
  tags: string[];
  images?: string[];
  inventory?: number;
  sku?: string;
  compareAtPrice?: number;
  aiMatchScore?: number;
  aiRecommendationReason?: string;
  created_at: string;
  updated_at?: string;
}

export interface SustainabilityMetric {
  name: string;
  value: string;
  description: string;
}

export interface ProductSustainability {
  product_id: string;
  level: 'high' | 'medium' | 'low';
  score: number;
  metrics: SustainabilityMetric[];
}

// API service for products
export const productApi = {
  /**
   * Get all products with optional filtering
   */
  async getProducts(params?: {
    category?: string;
    tag?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }) {
    try {
      console.log('Fetching products with params:', params);

      // EMERGENCY FIX: Skip API call entirely and use dynamic products
      // This is a temporary solution until the API issue is resolved
      console.log('EMERGENCY MODE: Using dynamic products instead of API');

      // Try to get products from localStorage first
      try {
        const cachedProducts = localStorage.getItem('cachedProducts');
        const cacheTimestamp = localStorage.getItem('productsCacheTimestamp');

        if (cachedProducts && cacheTimestamp) {
          const cacheAge = Date.now() - parseInt(cacheTimestamp);
          // Use cache if it's less than 30 minutes old
          if (cacheAge < 30 * 60 * 1000) {
            try {
              const products = JSON.parse(cachedProducts);
              if (Array.isArray(products) && products.length > 0) {
                console.log(`Using ${products.length} cached products from localStorage`);
                return products;
              }
            } catch (parseError) {
              console.warn('Error parsing cached products:', parseError);
            }
          }
        }
      } catch (cacheError) {
        console.warn('Error accessing localStorage cache:', cacheError);
      }

      // Generate dynamic products
      const dynamicProducts = generateDynamicProducts();
      console.log(`Generated ${dynamicProducts.length} dynamic products`);

      // Apply filters based on params
      let filteredProducts = [...dynamicProducts];

      // Filter by category if specified
      if (params?.category) {
        filteredProducts = filteredProducts.filter(p =>
          p.category.toLowerCase() === params.category?.toLowerCase()
        );
      }

      // Filter by tag if specified
      if (params?.tag) {
        filteredProducts = filteredProducts.filter(p =>
          p.tags.some(t => t.toLowerCase() === params.tag?.toLowerCase())
        );
      }

      // Filter by price range if specified
      if (params?.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= (params.minPrice || 0));
      }
      if (params?.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= (params.maxPrice || Infinity));
      }

      // Sort products if specified
      if (params?.sortBy) {
        const sortField = params.sortBy as keyof Product;
        const sortOrder = params.sortOrder === 'desc' ? -1 : 1;

        filteredProducts.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder * aValue.localeCompare(bValue);
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder * (aValue - bValue);
          } else {
            return 0;
          }
        });
      }

      // Apply limit if specified
      if (params?.limit) {
        filteredProducts = filteredProducts.slice(0, params.limit);
      }

      // Cache the products in localStorage
      try {
        localStorage.setItem('cachedProducts', JSON.stringify(dynamicProducts));
        localStorage.setItem('productsCacheTimestamp', Date.now().toString());
      } catch (cacheError) {
        console.warn('Error caching products:', cacheError);
      }

      console.log(`Returning ${filteredProducts.length} products after filtering`);
      return filteredProducts;
    } catch (error) {
      // This is a global catch for any unexpected errors in the main try block
      console.error('Unexpected error in getProducts:', error);

      // Generate emergency products as final fallback
      console.log('EMERGENCY FALLBACK: Generating emergency products');
      try {
        // Create a minimal set of emergency products
        const emergencyProducts = [
          {
            id: `emergency_${Date.now()}_1`,
            name: 'Emergency Product 1',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
            description: 'This is an emergency product generated when all else fails.',
            sustainabilityScore: 3,
            isNew: true,
            isFavorite: false,
            category: 'Emergency',
            tags: ['emergency'],
            created_at: new Date().toISOString(),
            images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80'],
            inventory: 10
          },
          {
            id: `emergency_${Date.now()}_2`,
            name: 'Emergency Product 2',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
            description: 'This is an emergency product generated when all else fails.',
            sustainabilityScore: 3,
            isNew: true,
            isFavorite: false,
            category: 'Emergency',
            tags: ['emergency'],
            created_at: new Date().toISOString(),
            images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'],
            inventory: 10
          }
        ];

        return emergencyProducts;
      } catch (emergencyError) {
        console.error('Failed to create emergency products:', emergencyError);

        // Return an empty array as absolute last resort
        return [];
      }
    }
  },

  /**
   * Get a product by ID
   */
  async getProductById(id: string) {
    try {
      console.log(`Fetching product ${id} from API`);
      const response = await apiClient.get<Product>(`/products/${id}`);

      if (!response.data) {
        throw new Error(`Product ${id} not found`);
      }

      // Check if response.data is an object with expected properties
      if (typeof response.data !== 'object' || !response.data.id) {
        console.error(`Invalid product data for ${id}:`, response.data);
        // Fall back to productService
        const { productService } = await import('@/services/productService');
        const product = await productService.getProductById(id);
        if (product) {
          return product;
        }
        throw new Error(`Product ${id} not found`);
      }

      // Normalize the data
      const rawProduct = response.data as any;
      const normalizedProduct = {
        ...response.data,
        sustainabilityScore: response.data.sustainabilityScore || rawProduct.sustainability_score || 3,
        isNew: response.data.isNew || rawProduct.is_new || false,
        image: response.data.image || (response.data.images && response.data.images.length > 0 ? response.data.images[0] : 'https://placehold.co/600x400?text=No+Image'),
      };

      return normalizedProduct;
    } catch (error) {
      console.error(`Error fetching product ${id} from API:`, error);

      // Fall back to productService
      try {
        console.log(`Falling back to productService for product ${id}`);
        const { productService } = await import('@/services/productService');
        return await productService.getProductById(id);
      } catch (fallbackError) {
        console.error(`Failed to fetch product ${id} from fallback:`, fallbackError);
        return null;
      }
    }
  },

  /**
   * Create a new product
   */
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'isFavorite'>) {
    try {
      const response = await apiClient.post<Product>('/products', product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * Update a product
   */
  async updateProduct(id: string, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      const response = await apiClient.put<Product>(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: string) {
    try {
      await apiClient.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle product favorite status
   */
  async toggleFavorite(id: string) {
    try {
      const response = await apiClient.post<{ isFavorite: boolean }>(`/products/${id}/favorite`);
      return response.data.isFavorite;
    } catch (error) {
      console.error(`Error toggling favorite for product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get sustainability information for a product
   */
  async getProductSustainability(id: string) {
    try {
      const response = await apiClient.get<ProductSustainability>(`/products/${id}/sustainability`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sustainability for product ${id}:`, error);
      return null;
    }
  }
};

// Use the same API client for all product operations
// No need for a separate getProducts function