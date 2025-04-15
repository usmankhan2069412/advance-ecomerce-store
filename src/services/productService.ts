import supabase from "@/lib/supabase";
import localStorageDB from "@/lib/localStorageDB";

// Validate Supabase connection
let supabaseInitialized = false;

// Check if Supabase client is properly initialized
if (supabase && typeof supabase.from === "function") {
  supabaseInitialized = true;
  console.log("Supabase client validated in productService");
} else {
  console.warn("Supabase client not properly initialized in productService");
}

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
        // Verify Supabase client is properly initialized
        if (!supabase || typeof supabase.from !== "function") {
          console.warn(
            "Supabase client not properly initialized in getProducts",
          );
          throw new Error("Supabase client not properly initialized");
        }

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Error fetching products from Supabase:", error);
          // Don't throw, just continue to localStorage fallback
        } else {
          // If we have data from Supabase, merge with localStorage data
          const localProducts = JSON.parse(
            localStorage.getItem("products") || "[]",
          );

          // Create a map of existing IDs to avoid duplicates
          const existingIds = new Set(data.map((p: { id: string }) => p.id));

          // Filter local products to only include those not in Supabase
          const uniqueLocalProducts = localProducts.filter(
            (p: any) => !existingIds.has(p.id),
          );

          // Combine both sources
          const allProducts = [...data, ...uniqueLocalProducts];
          console.log(
            `Retrieved ${allProducts.length} products (${data.length} from Supabase, ${uniqueLocalProducts.length} from localStorage)`,
          );

          return allProducts;
        }
      } catch (supabaseError) {
        console.warn("Supabase connection error:", supabaseError);
        // Continue to localStorage fallback
      }

      // If we get here, Supabase failed, so use localStorage
      const localProducts = JSON.parse(
        localStorage.getItem("products") || "[]",
      );
      console.log("Using localStorage products:", localProducts.length);
      return localProducts;
    } catch (error: any) {
      console.error("Unexpected error in getProducts:", error);
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
        // Verify Supabase client is properly initialized
        if (!supabase || typeof supabase.from !== "function") {
          console.warn(
            `Supabase client not properly initialized when fetching product ${id}`,
          );
          throw new Error("Supabase client not properly initialized");
        }

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          return data;
        }

        // If there was an error, log it but don't throw yet
        if (error) {
          console.warn(`Error fetching product ${id} from Supabase:`, error);
        }
      } catch (supabaseError) {
        console.warn(
          `Supabase connection error when fetching product ${id}:`,
          supabaseError,
        );
      }

      // Check localStorage regardless of whether Supabase succeeded
      try {
        console.log(`Checking localStorage for product ${id}`);
        const localProducts = JSON.parse(
          localStorage.getItem("products") || "[]",
        );
        const localProduct = localProducts.find((p: any) => p.id === id);

        if (localProduct) {
          console.log(`Found product ${id} in localStorage`);
          return localProduct;
        }
      } catch (localStorageError) {
        console.warn(
          `Error accessing localStorage for product ${id}:`,
          localStorageError,
        );
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
      console.log("Creating product in Supabase:", {
        ...product,
        image: product.image
          ? typeof product.image === "string"
            ? product.image.substring(0, 30) + "..."
            : "Image object"
          : "No image",
      });
      const productData = {
        ...product,
        image:
          product.image ||
          (product.images && product.images.length > 0
            ? product.images[0]
            : "https://placehold.co/600x400?text=No+Image"),
        is_new: product.isNew || product.is_new || true,
        sustainability_score:
          product.sustainabilityScore || product.sustainability_score || 3,
      };

      if (!productData.name || !productData.price || !productData.category) {
        throw new Error("Product name, price and category are required fields");
      }

      if (isNaN(productData.price) || productData.price <= 0) {
        throw new Error("Price must be a positive number");
      }

      const cleanProductData = { ...productData };
      Object.keys(cleanProductData).forEach((key) => {
        if (cleanProductData[key] === undefined) {
          delete cleanProductData[key];
        }
      });

      // Skip strict validation and just try to insert the product
      // Log that we're attempting to create the product
      console.log("Attempting to create product in Supabase");

      // Insert product with proper typing
      try {
        // Generate proper UUID for product
        if (!cleanProductData.id) {
          cleanProductData.id = crypto.randomUUID(); // Ensure browser supports crypto
        }

        // Try to insert into Supabase, but don't throw if it fails
        try {
          const { data, error } = await supabase
            .from("products")
            .insert([cleanProductData])
            .select("*");

          if (!error && data && data.length > 0) {
            const createdProduct = data[0];
            console.log("Product created in Supabase:", createdProduct);

            // Sync with localStorage
            const localProducts = JSON.parse(
              localStorage.getItem("products") || "[]",
            );
            localStorage.setItem(
              "products",
              JSON.stringify([...localProducts, createdProduct]),
            );

            return createdProduct;
          } else if (error) {
            console.warn(
              "Supabase insert error, falling back to localStorage:",
              error,
            );
          }
        } catch (supabaseError) {
          console.warn(
            "Supabase operation failed, using localStorage instead:",
            supabaseError,
          );
        }

        // If we get here, Supabase failed, so use localStorage
        console.log("Using localStorage for product creation");
        const localProduct = {
          ...cleanProductData,
          created_at: new Date().toISOString(),
        };

        // Store in localStorage
        const localProducts = JSON.parse(
          localStorage.getItem("products") || "[]",
        );
        localStorage.setItem(
          "products",
          JSON.stringify([...localProducts, localProduct]),
        );

        return localProduct;
      } catch (insertError) {
        console.error("Supabase insert failed:", insertError);

        // Handle specific error codes
        if ((insertError as { code?: string }).code === "23505") {
          throw new Error("Product with this ID already exists");
        }

        // Fallback to localStorage
        console.log("Falling back to localStorage...");
        const { data } = localStorageDB.insert("products", cleanProductData);
        return data;
      }
    } catch (error: any) {
      console.error("Error in createProduct:", error);

      // Instead of throwing, create a product in localStorage as a last resort
      try {
        console.log("Final fallback: Creating product in localStorage only");
        const fallbackProduct = {
          ...product,
          id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
        };

        const localProducts = JSON.parse(
          localStorage.getItem("products") || "[]",
        );
        localProducts.push(fallbackProduct);
        localStorage.setItem("products", JSON.stringify(localProducts));

        return fallbackProduct;
      } catch (fallbackError) {
        console.error("Even localStorage fallback failed:", fallbackError);
        throw new Error(`Could not create product: ${error.message}`);
      }
    }
  },

  /**
   * Update a product
   */
  async updateProduct(id: string, updates: any) {
    try {
      // Try to update in Supabase first
      try {
        // Verify Supabase client is properly initialized
        if (!supabase || typeof supabase.from !== "function") {
          console.warn(
            `Supabase client not properly initialized when updating product ${id}`,
          );
          throw new Error("Supabase client not properly initialized");
        }

        const { data, error } = await supabase
          .from("products")
          .update(updates)
          .eq("id", id)
          .select();

        if (!error && data && data.length > 0) {
          // Also update in localStorage to keep them in sync
          try {
            const localProducts = JSON.parse(
              localStorage.getItem("products") || "[]",
            );
            const productIndex = localProducts.findIndex(
              (p: any) => p.id === id,
            );

            if (productIndex >= 0) {
              localProducts[productIndex] = {
                ...localProducts[productIndex],
                ...updates,
              };
              localStorage.setItem("products", JSON.stringify(localProducts));
            }
          } catch (localStorageError) {
            console.warn(
              "Error updating localStorage after Supabase update:",
              localStorageError,
            );
          }

          return data[0];
        }

        // If there was an error, log it but don't throw yet
        if (error) {
          console.warn(`Error updating product ${id} in Supabase:`, error);
        }
      } catch (supabaseError) {
        console.warn(
          `Supabase connection error when updating product ${id}:`,
          supabaseError,
        );
      }

      // If Supabase update failed, try to update in localStorage
      try {
        const localProducts = JSON.parse(
          localStorage.getItem("products") || "[]",
        );
        const productIndex = localProducts.findIndex((p: any) => p.id === id);

        if (productIndex >= 0) {
          localProducts[productIndex] = {
            ...localProducts[productIndex],
            ...updates,
          };
          localStorage.setItem("products", JSON.stringify(localProducts));
          return localProducts[productIndex];
        }
      } catch (localStorageError) {
        console.warn(
          `Error updating product ${id} in localStorage:`,
          localStorageError,
        );
      }

      // If we got here, the product wasn't found in either place
      console.log(
        `Product ${id} not found for update in Supabase or localStorage`,
      );
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
        // Verify Supabase client is properly initialized
        if (!supabase || typeof supabase.from !== "function") {
          console.warn(
            `Supabase client not properly initialized when deleting product ${id}`,
          );
          throw new Error("Supabase client not properly initialized");
        }

        const { error } = await supabase.from("products").delete().eq("id", id);

        if (!error) {
          deletedFromSupabase = true;
        } else {
          console.warn(`Error deleting product ${id} from Supabase:`, error);
        }
      } catch (supabaseError) {
        console.warn(
          `Supabase connection error when deleting product ${id}:`,
          supabaseError,
        );
      }

      // Also delete from localStorage to keep them in sync
      try {
        const localProducts = JSON.parse(
          localStorage.getItem("products") || "[]",
        );
        const filteredProducts = localProducts.filter((p: any) => p.id !== id);

        if (filteredProducts.length < localProducts.length) {
          localStorage.setItem("products", JSON.stringify(filteredProducts));
          console.log(`Product ${id} deleted from localStorage`);
          return true; // Successfully deleted from localStorage
        } else if (deletedFromSupabase) {
          return true; // Successfully deleted from Supabase but not in localStorage
        }
      } catch (localStorageError) {
        console.warn(
          `Error accessing localStorage when deleting product ${id}:`,
          localStorageError,
        );
        if (deletedFromSupabase) {
          return true; // Successfully deleted from Supabase but localStorage failed
        }
      }

      // If we got here and the product was deleted from Supabase, return true
      if (deletedFromSupabase) {
        return true;
      }

      // If we got here, the product wasn't found in either place
      console.log(
        `Product ${id} not found for deletion in Supabase or localStorage`,
      );
      return false;
    } catch (error: any) {
      console.error(`Unexpected error in deleteProduct:`, error);
      return false;
    }
  },
};
