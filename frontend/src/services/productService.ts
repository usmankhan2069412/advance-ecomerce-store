import supabase from '../lib/supabase';

/**
 * Product service for Supabase database operations
 */
export const productService = {
  /**
   * Get all products
   */
  async getProducts() {
    try {
      // First try to get products from Supabase
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Error fetching products from Supabase:', error);
          // Don't throw, just continue to localStorage fallback
        } else {
          // If we have data from Supabase, merge with localStorage data
          const localProducts = JSON.parse(localStorage.getItem('products') || '[]');

          // Create a map of existing IDs to avoid duplicates
          const existingIds = new Set(data.map(p => p.id));

          // Filter local products to only include those not in Supabase
          const uniqueLocalProducts = localProducts.filter((p: any) => !existingIds.has(p.id));

          // Combine both sources
          const allProducts = [...data, ...uniqueLocalProducts];
          console.log(`Retrieved ${allProducts.length} products (${data.length} from Supabase, ${uniqueLocalProducts.length} from localStorage)`);

          return allProducts;
        }
      } catch (supabaseError) {
        console.warn('Supabase connection error:', supabaseError);
        // Continue to localStorage fallback
      }

      // If we get here, Supabase failed, so use localStorage
      const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
      console.log('Using localStorage products:', localProducts.length);
      return localProducts;
    } catch (error: any) {
      console.error('Unexpected error in getProducts:', error);
      // Return empty array as last resort
      return [];
    }
  },

  /**
   * Get a product by ID
   */
  async getProductById(id: string) {
    try {
      // Try to get from Supabase first
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return data;
        }

        // If there was an error, log it but don't throw yet
        if (error) {
          console.warn(`Error fetching product ${id} from Supabase:`, error);
        }
      } catch (supabaseError) {
        console.warn(`Supabase connection error when fetching product ${id}:`, supabaseError);
      }

      // Check localStorage regardless of whether Supabase succeeded
      try {
        console.log(`Checking localStorage for product ${id}`);
        const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const localProduct = localProducts.find((p: any) => p.id === id);

        if (localProduct) {
          console.log(`Found product ${id} in localStorage`);
          return localProduct;
        }
      } catch (localStorageError) {
        console.warn(`Error accessing localStorage for product ${id}:`, localStorageError);
      }

      // If we got here, the product wasn't found in either place
      console.log(`Product ${id} not found in Supabase or localStorage`);
      return null; // Return null instead of throwing
    } catch (error: any) {
      console.error(`Unexpected error in getProductById:`, error);
      return null; // Return null instead of throwing
    }
  },

  /**
   * Create a new product
   */
  async createProduct(product: any) {
    try {
      console.log('Creating product in Supabase:', {
        ...product,
        image: product.image ? (typeof product.image === 'string' ? product.image.substring(0, 30) + '...' : 'Image object') : 'No image'
      });

      // Ensure we have the correct field names for Supabase
      const productData = {
        ...product,
        // Make sure we have an image field
        image: product.image || (product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600x400?text=No+Image'),
        // Convert camelCase to snake_case for Supabase
        is_new: product.isNew || product.is_new || true,
        sustainability_score: product.sustainabilityScore || product.sustainability_score || 3,
      };

      // If the image is a data URL (from file upload), store it as is
      // In a production app, you would upload this to a storage service

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      let createdProduct: any;

      if (error) {
        console.error('Error creating product in Supabase:', error);
        // Fall back to localStorage if Supabase fails
        createdProduct = {
          ...productData,
          id: `prod_${Math.random().toString(36).substring(2, 10)}`,
          created_at: new Date().toISOString(),
        };

        // Save to localStorage
        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
        localStorage.setItem('products', JSON.stringify([...existingProducts, createdProduct]));

        console.log('Product saved to localStorage as fallback');
      } else if (!data || data.length === 0) {
        throw new Error('No product data returned after creation');
      } else {
        createdProduct = data[0];
        console.log('Product created in Supabase:', createdProduct);

        // Also save to localStorage to ensure it's immediately available
        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
        // Check if product already exists in localStorage
        const existingIndex = existingProducts.findIndex((p: any) => p.id === createdProduct.id);

        if (existingIndex >= 0) {
          // Update existing product
          existingProducts[existingIndex] = createdProduct;
        } else {
          // Add new product
          existingProducts.push(createdProduct);
        }

        localStorage.setItem('products', JSON.stringify(existingProducts));
      }

      // Dispatch a custom event to notify other components that a product was created
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('product-created', { detail: createdProduct }));
      }

      return createdProduct;
    } catch (error: any) {
      console.error('Error in createProduct:', error);
      throw new Error(error.message || 'Failed to create product');
    }
  },

  /**
   * Update a product
   */
  async updateProduct(id: string, updates: any) {
    try {
      // Try to update in Supabase first
      try {
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select();

        if (!error && data && data.length > 0) {
          // Also update in localStorage to keep them in sync
          try {
            const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
            const productIndex = localProducts.findIndex((p: any) => p.id === id);

            if (productIndex >= 0) {
              localProducts[productIndex] = { ...localProducts[productIndex], ...updates };
              localStorage.setItem('products', JSON.stringify(localProducts));
            }
          } catch (localStorageError) {
            console.warn('Error updating localStorage after Supabase update:', localStorageError);
          }

          return data[0];
        }

        // If there was an error, log it but don't throw yet
        if (error) {
          console.warn(`Error updating product ${id} in Supabase:`, error);
        }
      } catch (supabaseError) {
        console.warn(`Supabase connection error when updating product ${id}:`, supabaseError);
      }

      // If Supabase update failed, try to update in localStorage
      try {
        const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const productIndex = localProducts.findIndex((p: any) => p.id === id);

        if (productIndex >= 0) {
          localProducts[productIndex] = { ...localProducts[productIndex], ...updates };
          localStorage.setItem('products', JSON.stringify(localProducts));
          return localProducts[productIndex];
        }
      } catch (localStorageError) {
        console.warn(`Error updating product ${id} in localStorage:`, localStorageError);
      }

      // If we got here, the product wasn't found in either place
      console.log(`Product ${id} not found for update in Supabase or localStorage`);
      return null;
    } catch (error: any) {
      console.error(`Unexpected error in updateProduct:`, error);
      return null;
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: string) {
    try {
      let deletedFromSupabase = false;

      // Try to delete from Supabase first
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (!error) {
          deletedFromSupabase = true;
        } else {
          console.warn(`Error deleting product ${id} from Supabase:`, error);
        }
      } catch (supabaseError) {
        console.warn(`Supabase connection error when deleting product ${id}:`, supabaseError);
      }

      // Also delete from localStorage to keep them in sync
      try {
        const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const filteredProducts = localProducts.filter((p: any) => p.id !== id);

        if (filteredProducts.length < localProducts.length) {
          localStorage.setItem('products', JSON.stringify(filteredProducts));
          console.log(`Product ${id} deleted from localStorage`);
          return true; // Successfully deleted from localStorage
        } else if (deletedFromSupabase) {
          return true; // Successfully deleted from Supabase but not in localStorage
        }
      } catch (localStorageError) {
        console.warn(`Error accessing localStorage when deleting product ${id}:`, localStorageError);
        if (deletedFromSupabase) {
          return true; // Successfully deleted from Supabase but localStorage failed
        }
      }

      // If we got here and the product was deleted from Supabase, return true
      if (deletedFromSupabase) {
        return true;
      }

      // If we got here, the product wasn't found in either place
      console.log(`Product ${id} not found for deletion in Supabase or localStorage`);
      return false;
    } catch (error: any) {
      console.error(`Unexpected error in deleteProduct:`, error);
      return false;
    }
  }
};