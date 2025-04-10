/**
 * Simple localStorage-based database for fallback when Supabase is unavailable
 */

// Define table types
type Table = 'products' | 'categories' | 'users' | 'orders';

// Get all items from a table
export function getAll(table: Table): any[] {
  try {
    const items = localStorage.getItem(table);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error(`Error getting items from ${table}:`, error);
    return [];
  }
}

// Get a single item by ID
export function getById(table: Table, id: string): any | null {
  try {
    const items = getAll(table);
    return items.find(item => item.id === id) || null;
  } catch (error) {
    console.error(`Error getting item from ${table}:`, error);
    return null;
  }
}

// Insert an item
export function insert(table: Table, item: any): { data: any, error: Error | null } {
  try {
    // Ensure item has an ID
    if (!item.id) {
      item.id = `${table.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    
    // Ensure item has created_at timestamp
    if (!item.created_at) {
      item.created_at = new Date().toISOString();
    }
    
    const items = getAll(table);
    
    // Check for duplicates
    const existingIndex = items.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      items[existingIndex] = { ...items[existingIndex], ...item };
    } else {
      items.push(item);
    }
    
    localStorage.setItem(table, JSON.stringify(items));
    return { data: item, error: null };
  } catch (error) {
    console.error(`Error inserting item into ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(`Failed to insert into ${table}`) 
    };
  }
}

// Update an item
export function update(table: Table, id: string, updates: any): { data: any, error: Error | null } {
  try {
    const items = getAll(table);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return { 
        data: null, 
        error: new Error(`Item with ID ${id} not found in ${table}`) 
      };
    }
    
    // Update the item
    items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(table, JSON.stringify(items));
    
    return { data: items[index], error: null };
  } catch (error) {
    console.error(`Error updating item in ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(`Failed to update in ${table}`) 
    };
  }
}

// Delete an item
export function remove(table: Table, id: string): { error: Error | null } {
  try {
    const items = getAll(table);
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) {
      return { error: new Error(`Item with ID ${id} not found in ${table}`) };
    }
    
    localStorage.setItem(table, JSON.stringify(filteredItems));
    return { error: null };
  } catch (error) {
    console.error(`Error deleting item from ${table}:`, error);
    return { 
      error: error instanceof Error ? error : new Error(`Failed to delete from ${table}`) 
    };
  }
}

// Clear a table
export function clear(table: Table): { error: Error | null } {
  try {
    localStorage.removeItem(table);
    return { error: null };
  } catch (error) {
    console.error(`Error clearing ${table}:`, error);
    return { 
      error: error instanceof Error ? error : new Error(`Failed to clear ${table}`) 
    };
  }
}

// LocalStorageDB object for easier imports
const localStorageDB = {
  getAll,
  getById,
  insert,
  update,
  remove,
  clear
};

export default localStorageDB;
