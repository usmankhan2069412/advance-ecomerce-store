import supabase from '@/lib/supabase';

/**
 * Category service for Supabase database operations
 */
export const categoryService = {
  /**
   * Get all categories
   */
  async getCategories() {
    try {
      // Get deleted categories from localStorage
      const deletedCategories = JSON.parse(localStorage.getItem('deletedCategories') || '[]');

      // Validate Supabase client initialization
      if (!supabase) {
        console.warn('Database client is not initialized, returning empty categories array');
        // Return empty array since we don't have default categories anymore
        return [];
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        // Handle specific Supabase errors
        console.warn(`Supabase error (${error.code}): ${error.message}`);
        // Return local categories if available, otherwise empty array
        const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');
        return localCategories.filter((cat: any) => !deletedCategories.includes(cat.id));
      }

      // If we got data but it's empty, return local categories if available
      if (!data || data.length === 0) {
        console.warn('No categories found in database');
        // Return local categories if available, otherwise empty array
        const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');
        return localCategories.filter((cat: any) => !deletedCategories.includes(cat.id));
      }

      // Get any locally created categories
      const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');

      // Get any updated categories (for Supabase categories that couldn't be updated directly)
      const updatedCategories = JSON.parse(localStorage.getItem('updatedCategories') || '{}');

      // Filter out deleted categories from Supabase data
      const filteredData = data.filter(cat => !deletedCategories.includes(cat.id));

      // Apply any updates to Supabase categories
      const updatedSupabaseData = filteredData.map(cat => {
        if (updatedCategories[cat.id]) {
          return { ...cat, ...updatedCategories[cat.id] };
        }
        return cat;
      });

      // Combine Supabase data with local categories
      let combinedCategories = [...updatedSupabaseData];

      // Add local categories that don't exist in Supabase
      localCategories.forEach((localCat: any) => {
        // Skip if already deleted
        if (deletedCategories.includes(localCat.id)) return;

        // Skip if a category with the same name already exists in the combined list
        if (!combinedCategories.some(cat =>
          cat.name.toLowerCase() === localCat.name.toLowerCase()
        )) {
          combinedCategories.push(localCat);
        }
      });

      // Return the combined categories, even if empty
      return combinedCategories;
    } catch (error) {
      console.error('Error in getCategories:', error);
      // Return local categories if available, otherwise empty array
      try {
        const deletedCategories = JSON.parse(localStorage.getItem('deletedCategories') || '[]');
        const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');
        return localCategories.filter((cat: any) => !deletedCategories.includes(cat.id));
      } catch (e) {
        console.error('Error accessing localStorage:', e);
        return [];
      }
    }
  },

  /**
   * Get default categories when database is unavailable
   * Now returns an empty array since we want categories to be created dynamically only
   */
  getDefaultCategories() {
    // Return an empty array instead of default categories
    return [];
  },

  /**
   * Create a new category
   */
  async createCategory(category: { name: string; description: string }) {
    try {
      // Validate category data
      if (!category.name?.trim()) {
        throw new Error('Category name is required');
      }

      // Generate a unique ID for the category
      const categoryId = `cat_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

      // Create the category object
      const newCategory = {
        id: categoryId,
        name: category.name.trim(),
        description: category.description?.trim() || ''
      };

      try {
        // Try to create in Supabase first
        const { data: sessionData } = await supabase.auth.getSession();

        // Only try Supabase if we have a session
        if (sessionData?.session) {
          const { data, error } = await supabase
            .from('categories')
            .insert([{
              name: category.name.trim(),
              description: category.description?.trim() || ''
            }])
            .select();

          if (!error && data && data.length > 0) {
            console.log('Category created in Supabase:', data[0]);
            return data[0];
          }

          // If there was an error, log it but continue to localStorage fallback
          if (error) {
            console.warn(`Supabase error creating category: ${error.message}`);
          }
        }
      } catch (supabaseError) {
        console.warn('Error with Supabase, falling back to localStorage:', supabaseError);
      }

      // Fallback to localStorage
      try {
        // Store in localStorage
        const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');

        // Check for duplicate names
        if (localCategories.some((cat: any) => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
          throw new Error('A category with this name already exists');
        }

        localCategories.push(newCategory);
        localStorage.setItem('localCategories', JSON.stringify(localCategories));

        console.log('Category created in localStorage:', newCategory);
        return newCategory;
      } catch (localStorageError) {
        console.error('Error saving to localStorage:', localStorageError);
        throw new Error('Failed to save category. Please try again.');
      }
    } catch (error) {
      console.error('Error in createCategory:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while creating the category');
      }
    }
  },

  /**
   * Update a category
   */
  async updateCategory(id: string, updates: { name?: string; description?: string }) {
    try {
      // Validate updates
      if (updates.name !== undefined && !updates.name.trim()) {
        throw new Error('Category name cannot be empty');
      }

      // Clean up the updates
      const cleanUpdates = {
        name: updates.name?.trim(),
        description: updates.description?.trim() || ''
      };

      // Check if it's a local category
      const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');
      const localCategoryIndex = localCategories.findIndex((cat: any) => cat.id === id);

      if (localCategoryIndex >= 0) {
        // Update local category
        localCategories[localCategoryIndex] = {
          ...localCategories[localCategoryIndex],
          ...cleanUpdates
        };
        localStorage.setItem('localCategories', JSON.stringify(localCategories));

        return localCategories[localCategoryIndex];
      }

      // If not a default or local category, try Supabase
      try {
        const { data, error } = await supabase
          .from('categories')
          .update(cleanUpdates)
          .eq('id', id)
          .select();

        if (!error && data && data.length > 0) {
          return data[0];
        }

        // If there was an error or no data returned, fall back to localStorage
        if (error) {
          console.warn(`Supabase error updating category ${id}:`, error);
        }
      } catch (supabaseError) {
        console.warn(`Error with Supabase update for category ${id}:`, supabaseError);
      }

      // If we get here, we couldn't update in Supabase, so store in localStorage
      const updatedCategories = JSON.parse(localStorage.getItem('updatedCategories') || '{}');
      updatedCategories[id] = cleanUpdates;
      localStorage.setItem('updatedCategories', JSON.stringify(updatedCategories));

      // Return the updated category
      return {
        id,
        ...cleanUpdates
      };
    } catch (error) {
      console.error(`Error in updateCategory for ${id}:`, error);
      throw error instanceof Error ? error : new Error('Failed to update category');
    }
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: string) {
    try {
      // Since we've removed default categories, we only need to handle local and Supabase categories

      // For non-default categories, try to delete from Supabase
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        // If Supabase fails, fall back to localStorage
        console.warn(`Supabase error deleting category ${id}:`, error);
        const deletedCategories = JSON.parse(localStorage.getItem('deletedCategories') || '[]');
        if (!deletedCategories.includes(id)) {
          deletedCategories.push(id);
          localStorage.setItem('deletedCategories', JSON.stringify(deletedCategories));
        }
      }

      return true;
    } catch (error) {
      console.error(`Error in deleteCategory for ${id}:`, error);
      // Even if there's an error, we'll still mark it as deleted in localStorage
      try {
        const deletedCategories = JSON.parse(localStorage.getItem('deletedCategories') || '[]');
        if (!deletedCategories.includes(id)) {
          deletedCategories.push(id);
          localStorage.setItem('deletedCategories', JSON.stringify(deletedCategories));
        }
        return true;
      } catch (localStorageError) {
        console.error('Failed to update localStorage:', localStorageError);
        throw new Error(`Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
};