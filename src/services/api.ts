/**
 * API client for interacting with the backend services
 * This service handles all API requests for products and other data
 */

import axios from 'axios';

// Create axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000, // 15 seconds timeout
  validateStatus: (status) => status >= 200 && status < 500, // Handle only client errors
  withCredentials: true // Enable sending cookies with requests
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
  (error) => Promise.reject(error)
);

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
      const response = await apiClient.get<Product[]>('/products', {
        params,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check if the error is due to network connectivity
        if (!error.response) {
          console.error('Network Error: Unable to connect to the server. Please check if the backend server is running.');
          throw new Error('Unable to connect to the server. Please check if the backend server is running.');
        }

        // Log detailed error information
        console.error('API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method
        });

        // Handle specific HTTP error codes
        if (error.response.status === 404) {
          throw new Error('Products endpoint not found. Please check the API configuration.');
        }

        const errorMessage = error.response?.data?.message || error.response?.statusText || error.message;
        throw new Error(`Failed to fetch products: ${errorMessage}`);
      }
      
      // Handle non-Axios errors
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred while fetching products.');
    }
  },
  
  /**
   * Get a product by ID
   */
  async getProductById(id: string) {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
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