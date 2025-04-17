import supabase from '@/lib/supabase';

class CategoryService {
  private static instance: CategoryService;
  private static initializationPromise: Promise<CategoryService>;

  private constructor() {}

  public static async getInstance(): Promise<CategoryService> {
    if (this.instance) return this.instance;
    if (!this.initializationPromise) this.initializationPromise = this.initialize();
    this.instance = await this.initializationPromise;
    return this.instance;
  }

  private static async initialize(): Promise<CategoryService> {
    await supabase;
    return new CategoryService();
  }

  public = {
    async getCategories() {
      try {
        const deletedCategories = JSON.parse(localStorage.getItem('deletedCategories') || '[]');

        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.warn(`Supabase error: ${error.message}`);
          const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');
          return localCategories.filter((cat: any) => !deletedCategories.includes(cat.id));
        }

        const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');
        const updatedCategories = JSON.parse(localStorage.getItem('updatedCategories') || '{}');

        const filteredData = data.filter((cat: { id: string }) => !deletedCategories.includes(cat.id));
        const updatedSupabaseData = filteredData.map((cat: { id: string }) =>
          updatedCategories[cat.id] ? { ...cat, ...updatedCategories[cat.id] } : cat
        );

        const combinedCategories = [...updatedSupabaseData];

        localCategories.forEach((localCat: any) => {
          if (!deletedCategories.includes(localCat.id) && !combinedCategories.some(
            cat => cat.name.toLowerCase() === localCat.name.toLowerCase()
          )) {
            combinedCategories.push(localCat);
          }
        });

        return combinedCategories;
      } catch (error) {
        console.error('Error in getCategories:', error);
        const deletedCategories = JSON.parse(localStorage.getItem('deletedCategories') || '[]');
        const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');
        return localCategories.filter((cat: any) => !deletedCategories.includes(cat.id));
      }
    },

    getDefaultCategories() {
      return [];
    },

    async createCategory(category: { name: string; description: string; type?: string }) {
      try {
        if (!category.name?.trim()) throw new Error('Category name is required');

        const categoryId = `cat_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
        const newCategory = {
          id: categoryId,
          name: category.name.trim(),
          description: category.description?.trim() || '',
          type: category.type?.trim() || ''
        };

        const { data, error } = await supabase
          .from('categories')
          .insert([{
            name: newCategory.name,
            description: newCategory.description,
            type: newCategory.type
          }])
          .select();

        if (!error && data && data.length > 0) {
          console.log('Category created in Supabase:', data[0]);
          return data[0];
        }

        console.warn('Supabase insert failed:', error?.message);

        // Fallback to localStorage
        const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');
        if (localCategories.some((cat: any) => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
          throw new Error('A category with this name already exists');
        }

        localCategories.push(newCategory);
        localStorage.setItem('localCategories', JSON.stringify(localCategories));

        console.log('Category created in localStorage:', newCategory);
        return newCategory;
      } catch (error) {
        console.error('Error in createCategory:', error);
        throw error instanceof Error ? error : new Error('Unexpected error during category creation');
      }
    },

    async updateCategory(id: string, updates: { name?: string; description?: string; type?: string }) {
      try {
        if (updates.name !== undefined && !updates.name.trim()) {
          throw new Error('Category name cannot be empty');
        }

        const cleanUpdates = {
          name: updates.name?.trim(),
          description: updates.description?.trim() || '',
          type: updates.type?.trim() || ''
        };

        const localCategories = JSON.parse(localStorage.getItem('localCategories') || '[]');
        const localCategoryIndex = localCategories.findIndex((cat: any) => cat.id === id);

        if (localCategoryIndex >= 0) {
          localCategories[localCategoryIndex] = {
            ...localCategories[localCategoryIndex],
            ...cleanUpdates
          };
          localStorage.setItem('localCategories', JSON.stringify(localCategories));
          return localCategories[localCategoryIndex];
        }

        const { data, error } = await supabase
          .from('categories')
          .update(cleanUpdates)
          .eq('id', id)
          .select();

        if (!error && data && data.length > 0) return data[0];

        const updatedCategories = JSON.parse(localStorage.getItem('updatedCategories') || '{}');
        updatedCategories[id] = cleanUpdates;
        localStorage.setItem('updatedCategories', JSON.stringify(updatedCategories));

        return { id, ...cleanUpdates };
      } catch (error) {
        console.error(`Error updating category ${id}:`, error);
        throw error instanceof Error ? error : new Error('Update failed');
      }
    },

    async deleteCategory(id: string) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn(`Supabase delete error for ${id}:`, error);
        }

        const deletedCategories = JSON.parse(localStorage.getItem('deletedCategories') || '[]');
        if (!deletedCategories.includes(id)) {
          deletedCategories.push(id);
          localStorage.setItem('deletedCategories', JSON.stringify(deletedCategories));
        }

        return true;
      } catch (error) {
        console.error(`Error deleting category ${id}:`, error);
        const deletedCategories = JSON.parse(localStorage.getItem('deletedCategories') || '[]');
        if (!deletedCategories.includes(id)) {
          deletedCategories.push(id);
          localStorage.setItem('deletedCategories', JSON.stringify(deletedCategories));
        }
        return true;
      }
    }
  }
}

export default CategoryService;
