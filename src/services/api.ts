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
  },
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
      const response = await apiClient.get<Product[]>('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
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