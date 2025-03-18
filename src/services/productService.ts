import supabase from '@/lib/supabase';

/**
 * Product service for Supabase database operations
 */
export const productService = {
  /**
   * Get all products
   */
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data || [];
  },
  
  /**
   * Get a product by ID
   */
  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Create a new product
   */
  async createProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  /**
   * Update a product
   */
  async updateProduct(id: string, updates: any) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
    
    return data?.[0];
  },
  
  /**
   * Delete a product
   */
  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
    
    return true;
  }
}; 