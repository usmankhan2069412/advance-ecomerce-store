import supabase from '@/lib/supabase';

/**
 * Attribute type definition
 */
export interface AttributeValue {
  id: string;
  attribute_id: string;
  value: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Attribute {
  id: string;
  name: string;
  description?: string;
  values: AttributeValue[] | string[];
  display_order?: number;
  is_active?: boolean;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Attribute service for Supabase database operations
 */
class AttributeService {
  private static instance: AttributeService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AttributeService {
    if (!AttributeService.instance) {
      AttributeService.instance = new AttributeService();
    }
    return AttributeService.instance;
  }

  /**
   * Get all attributes
   */
  async getAttributes(): Promise<Attribute[]> {
    try {
      // Try to get attributes from Supabase
      const { data, error } = await supabase
        .from('attributes')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.warn('Error fetching attributes from Supabase:', error);
        // Fall back to localStorage
        return this.getAttributesFromLocalStorage();
      }

      // If we got data from Supabase, fetch the values for each attribute
      if (data && data.length > 0) {
        const attributesWithValues = await Promise.all(
          data.map(async (attribute) => {
            const { data: values, error: valuesError } = await supabase
              .from('attribute_values')
              .select('*')
              .eq('attribute_id', attribute.id)
              .order('display_order', { ascending: true });

            if (valuesError) {
              console.warn(`Error fetching values for attribute ${attribute.id}:`, valuesError);
              return {
                ...attribute,
                values: []
              };
            }

            return {
              ...attribute,
              values: values || []
            };
          })
        );

        return attributesWithValues;
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error in getAttributes:', error);
      // Fall back to localStorage
      return this.getAttributesFromLocalStorage();
    }
  }

  /**
   * Get attributes from localStorage
   */
  private getAttributesFromLocalStorage(): Attribute[] {
    try {
      const storedAttributes = localStorage.getItem('attributes');
      if (!storedAttributes) return [];
      
      return JSON.parse(storedAttributes);
    } catch (error) {
      console.error('Error reading attributes from localStorage:', error);
      return [];
    }
  }

  /**
   * Get attribute by ID
   */
  async getAttributeById(id: string): Promise<Attribute | null> {
    try {
      // Try to get attribute from Supabase
      const { data, error } = await supabase
        .from('attributes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn(`Error fetching attribute ${id} from Supabase:`, error);
        // Fall back to localStorage
        return this.getAttributeByIdFromLocalStorage(id);
      }

      if (!data) return null;

      // Fetch values for this attribute
      const { data: values, error: valuesError } = await supabase
        .from('attribute_values')
        .select('*')
        .eq('attribute_id', id)
        .order('display_order', { ascending: true });

      if (valuesError) {
        console.warn(`Error fetching values for attribute ${id}:`, valuesError);
        return {
          ...data,
          values: []
        };
      }

      return {
        ...data,
        values: values || []
      };
    } catch (error) {
      console.error(`Unexpected error in getAttributeById:`, error);
      // Fall back to localStorage
      return this.getAttributeByIdFromLocalStorage(id);
    }
  }

  /**
   * Get attribute by ID from localStorage
   */
  private getAttributeByIdFromLocalStorage(id: string): Attribute | null {
    try {
      const storedAttributes = localStorage.getItem('attributes');
      if (!storedAttributes) return null;
      
      const attributes = JSON.parse(storedAttributes) as Attribute[];
      return attributes.find(attr => attr.id === id) || null;
    } catch (error) {
      console.error(`Error reading attribute ${id} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Create a new attribute
   */
  async createAttribute(attribute: Omit<Attribute, 'id' | 'created_at' | 'updated_at'>): Promise<Attribute> {
    try {
      // Validate input
      if (!attribute.name) {
        throw new Error('Attribute name is required');
      }

      // Generate a unique ID
      const attributeId = `attr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Prepare attribute data
      const attributeData = {
        id: attributeId,
        name: attribute.name.trim(),
        description: attribute.description?.trim() || '',
        display_order: attribute.display_order || 0,
        is_active: attribute.is_active !== false, // Default to true
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Extract values to insert separately
      const values = attribute.values || [];
      
      // Try to insert into Supabase
      const { data, error } = await supabase
        .from('attributes')
        .insert([attributeData])
        .select()
        .single();

      if (error) {
        console.warn('Error creating attribute in Supabase:', error);
        // Fall back to localStorage
        return this.createAttributeInLocalStorage(attributeData, values);
      }

      // If we successfully created the attribute, insert the values
      if (data && values.length > 0) {
        const valueObjects = Array.isArray(values) 
          ? values.map((value, index) => {
              if (typeof value === 'string') {
                return {
                  id: `val_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 9)}`,
                  attribute_id: attributeId,
                  value: value.trim(),
                  display_order: index,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
              } else {
                return {
                  ...value,
                  attribute_id: attributeId,
                  display_order: index,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
              }
            })
          : [];

        const { error: valuesError } = await supabase
          .from('attribute_values')
          .insert(valueObjects);

        if (valuesError) {
          console.warn(`Error creating values for attribute ${attributeId}:`, valuesError);
        }

        return {
          ...data,
          values: valueObjects
        };
      }

      return {
        ...data,
        values: []
      };
    } catch (error) {
      console.error('Unexpected error in createAttribute:', error);
      throw error;
    }
  }

  /**
   * Create attribute in localStorage
   */
  private createAttributeInLocalStorage(
    attributeData: Partial<Attribute>, 
    values: (string | AttributeValue)[]
  ): Attribute {
    try {
      // Get existing attributes
      const storedAttributes = localStorage.getItem('attributes');
      const attributes = storedAttributes ? JSON.parse(storedAttributes) : [];
      
      // Process values
      const processedValues = values.map((value, index) => {
        if (typeof value === 'string') {
          return {
            id: `val_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 9)}`,
            attribute_id: attributeData.id,
            value: value.trim(),
            display_order: index
          };
        }
        return value;
      });
      
      // Create new attribute with values
      const newAttribute = {
        ...attributeData,
        values: processedValues,
        product_count: 0
      };
      
      // Add to array and save
      attributes.push(newAttribute);
      localStorage.setItem('attributes', JSON.stringify(attributes));
      
      return newAttribute as Attribute;
    } catch (error) {
      console.error('Error creating attribute in localStorage:', error);
      throw new Error('Failed to create attribute in localStorage');
    }
  }

  /**
   * Update an attribute
   */
  async updateAttribute(id: string, updates: Partial<Attribute>): Promise<Attribute | null> {
    try {
      // Get the current attribute to merge with updates
      const currentAttribute = await this.getAttributeById(id);
      if (!currentAttribute) {
        throw new Error(`Attribute with ID ${id} not found`);
      }

      // Prepare attribute data for update
      const attributeData = {
        name: updates.name?.trim() || currentAttribute.name,
        description: updates.description?.trim() || currentAttribute.description,
        display_order: updates.display_order || currentAttribute.display_order,
        is_active: updates.is_active !== undefined ? updates.is_active : currentAttribute.is_active,
        updated_at: new Date().toISOString()
      };

      // Try to update in Supabase
      const { data, error } = await supabase
        .from('attributes')
        .update(attributeData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn(`Error updating attribute ${id} in Supabase:`, error);
        // Fall back to localStorage
        return this.updateAttributeInLocalStorage(id, attributeData, updates.values);
      }

      // If values were provided, update them
      if (updates.values && updates.values.length > 0) {
        // First, delete existing values
        const { error: deleteError } = await supabase
          .from('attribute_values')
          .delete()
          .eq('attribute_id', id);

        if (deleteError) {
          console.warn(`Error deleting values for attribute ${id}:`, deleteError);
        }

        // Then insert new values
        const valueObjects = Array.isArray(updates.values) 
          ? updates.values.map((value, index) => {
              if (typeof value === 'string') {
                return {
                  id: `val_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 9)}`,
                  attribute_id: id,
                  value: value.trim(),
                  display_order: index,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
              } else {
                return {
                  ...value,
                  attribute_id: id,
                  display_order: index,
                  updated_at: new Date().toISOString()
                };
              }
            })
          : [];

        const { error: valuesError } = await supabase
          .from('attribute_values')
          .insert(valueObjects);

        if (valuesError) {
          console.warn(`Error creating values for attribute ${id}:`, valuesError);
        }

        return {
          ...data,
          values: valueObjects
        };
      }

      // If we didn't update values, fetch the current values
      const { data: values, error: valuesError } = await supabase
        .from('attribute_values')
        .select('*')
        .eq('attribute_id', id)
        .order('display_order', { ascending: true });

      if (valuesError) {
        console.warn(`Error fetching values for attribute ${id}:`, valuesError);
        return {
          ...data,
          values: []
        };
      }

      return {
        ...data,
        values: values || []
      };
    } catch (error) {
      console.error(`Unexpected error in updateAttribute:`, error);
      return null;
    }
  }

  /**
   * Update attribute in localStorage
   */
  private updateAttributeInLocalStorage(
    id: string, 
    attributeData: Partial<Attribute>,
    values?: (string | AttributeValue)[]
  ): Attribute | null {
    try {
      // Get existing attributes
      const storedAttributes = localStorage.getItem('attributes');
      if (!storedAttributes) return null;
      
      const attributes = JSON.parse(storedAttributes) as Attribute[];
      const attributeIndex = attributes.findIndex(attr => attr.id === id);
      
      if (attributeIndex === -1) return null;
      
      // Process values if provided
      let processedValues = attributes[attributeIndex].values;
      if (values && values.length > 0) {
        processedValues = values.map((value, index) => {
          if (typeof value === 'string') {
            return {
              id: `val_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 9)}`,
              attribute_id: id,
              value: value.trim(),
              display_order: index
            };
          }
          return value;
        });
      }
      
      // Update attribute
      const updatedAttribute = {
        ...attributes[attributeIndex],
        ...attributeData,
        values: processedValues,
        updated_at: new Date().toISOString()
      };
      
      attributes[attributeIndex] = updatedAttribute;
      localStorage.setItem('attributes', JSON.stringify(attributes));
      
      return updatedAttribute as Attribute;
    } catch (error) {
      console.error(`Error updating attribute ${id} in localStorage:`, error);
      return null;
    }
  }

  /**
   * Delete an attribute
   */
  async deleteAttribute(id: string): Promise<boolean> {
    try {
      // First, delete values in Supabase
      const { error: valuesError } = await supabase
        .from('attribute_values')
        .delete()
        .eq('attribute_id', id);

      if (valuesError) {
        console.warn(`Error deleting values for attribute ${id}:`, valuesError);
      }

      // Then delete the attribute
      const { error } = await supabase
        .from('attributes')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn(`Error deleting attribute ${id} from Supabase:`, error);
        // Fall back to localStorage
        return this.deleteAttributeFromLocalStorage(id);
      }

      return true;
    } catch (error) {
      console.error(`Unexpected error in deleteAttribute:`, error);
      // Fall back to localStorage
      return this.deleteAttributeFromLocalStorage(id);
    }
  }

  /**
   * Delete attribute from localStorage
   */
  private deleteAttributeFromLocalStorage(id: string): boolean {
    try {
      // Get existing attributes
      const storedAttributes = localStorage.getItem('attributes');
      if (!storedAttributes) return false;
      
      const attributes = JSON.parse(storedAttributes) as Attribute[];
      const filteredAttributes = attributes.filter(attr => attr.id !== id);
      
      if (filteredAttributes.length === attributes.length) {
        // No attribute was removed
        return false;
      }
      
      localStorage.setItem('attributes', JSON.stringify(filteredAttributes));
      return true;
    } catch (error) {
      console.error(`Error deleting attribute ${id} from localStorage:`, error);
      return false;
    }
  }

  /**
   * Get product count for an attribute
   * This would typically query the database to count products using this attribute
   */
  async getProductCountForAttribute(id: string): Promise<number> {
    try {
      // In a real implementation, this would query the database
      // For now, we'll return a random number or check localStorage
      const attribute = await this.getAttributeById(id);
      return attribute?.product_count || 0;
    } catch (error) {
      console.error(`Error getting product count for attribute ${id}:`, error);
      return 0;
    }
  }
}

export default AttributeService;
