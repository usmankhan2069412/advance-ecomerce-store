import supabase from '@/lib/supabase';

/**
 * Product type definition
 */
interface Product {
  colors: never[];
  sizes: string[];
  isFavorite: boolean;
  id?: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  image?: string;
  images?: string[];
  category_id: string; // ✅ changed from category to category_id
  category_name?: string; // ✅ added category_name field
  type: 'Man' | 'Woman' | 'Accessories';
  tags?: string[];
  inventory?: number;
  sku?: string;
  is_new?: boolean;
  sustainability_score?: number;
  client_id?: string ;
  created_at?: string;
  updated_at?: string;
}


/**
 * Product service for Supabase database operations
 */
export const productService = {
  /**
   * Get all products
   * @returns Promise<Product[]>
   */
  async getProducts(): Promise<Product[]> {
    try {
      this.validateSupabaseConnection();

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching products from Supabase:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error in getProducts:', error);
      return [];
    }
  },

  /**
   * Get a product by ID
   * @param id - Product ID
   * @returns Promise<Product | null>
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      this.validateSupabaseConnection();

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.warn(`Error fetching product ${id} from Supabase:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Unexpected error in getProductById:`, error);
      return null;
    }
  },

  /**
   * Create a new product
   * @param product - Partial product data
   * @returns Promise<Product>
   */
  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      // Input validation
      if (!product) {
        throw new Error('Product data is required');
      }

      // Validate required fields
      this.validateRequiredFields(product);

      // Prepare product data
      const productData = this.prepareProductData(product);

      // Validate Supabase connection
      this.validateSupabaseConnection();

      // Insert product
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from Supabase after insert');
      }

      return data;
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error instanceof Error ? error : new Error('Failed to create product');
    }
  },

  /**
   * Update a product
   * @param id - Product ID
   * @param updates - Partial product data
   * @returns Promise<Product | null>
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      this.validateSupabaseConnection();

      // Clean and validate updates
      const cleanUpdates = this.cleanProductData(updates);

      const { data, error } = await supabase
        .from('products')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn(`Error updating product ${id} in Supabase:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Unexpected error in updateProduct:`, error);
      return null;
    }
  },

  /**
   * Delete a product
   * @param id - Product ID
   * @returns Promise<boolean>
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      this.validateSupabaseConnection();

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn(`Error deleting product ${id} from Supabase:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Unexpected error in deleteProduct:`, error);
      return false;
    }
  },

  /**
   * Validate Supabase connection
   * @internal
   */
  validateSupabaseConnection(): void {
    if (!supabase || typeof supabase.from !== 'function') {
      throw new Error('Supabase client not properly initialized');
    }
  },

  /**
   * Validate required product fields
   * @internal
   * @param product - Partial product data
   */
  validateRequiredFields(product: Partial<Product>): void {
    const requiredFields = ['name', 'price', 'category_id', 'type'] as const;
    type RequiredField = typeof requiredFields[number];

    const missingFields = requiredFields.filter(field => {
      const value = product[field as keyof Pick<Product, RequiredField>];
      return !value ||
             (typeof value === 'string' && value.trim() === '') ||
             (field === 'price' && (typeof value !== 'number' || isNaN(value) || value <= 0));
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing or invalid required fields: ${missingFields.join(', ')}`);
    }

    // Validate type field
    const validTypes = ['Man', 'Woman', 'Accessories'] as const;
    if (product.type && !validTypes.includes(product.type as typeof validTypes[number])) {
      throw new Error(`Invalid product type. Must be one of: ${validTypes.join(', ')}`);
    }
  },

  /**
   * Prepare product data for creation/update
   * @internal
   * @param product - Partial product data
   * @returns Product data
   */
  prepareProductData(product: Partial<Product>): Product {
    return {
      name: product.name!.trim(),
      description: product.description?.trim() || '',
      price: product.price!,
      compare_at_price: product.compare_at_price,
      category_id: product.category_id!.trim(), //  instead of category
      type: product.type!.trim() as Product['type'],
      // Always set the main image from the first image in the images array if available
      image: (product.images && product.images.length > 0)
        ? product.images[0]
        : (product.image || 'https://placehold.co/600x400?text=No+Image'),
      images: product.images,
      tags: product.tags,
      inventory: product.inventory,
      sku: product.sku,
      is_new: true,
      client_id: product.client_id || `temp_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Product;
  },

  /**
   * Clean product data by removing undefined values
   * @internal
   * @param data - Partial product data
   * @returns Cleaned product data
   */
  cleanProductData<T extends Partial<Product>>(data: T): Partial<Product> {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && key in data) {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as Partial<Product>);
  }
};



