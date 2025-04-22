import { supabase } from '@/lib/supabase-client';

/**
 * Database service for testing Supabase connection
 */
export const databaseService = {
  /**
   * Test database connection and return detailed status
   * @returns {Promise<{ isConnected: boolean; status: string; error?: string }>} Connection status details
   */
  async testConnection() {
    try {
      // Validate Supabase configuration
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        return {
          isConnected: false,
          status: 'Configuration Error',
          error: 'Missing Supabase environment variables'
        };
      }

      // Try to fetch a single row from any table to test connection
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Database connection test failed:', error);
        return {
          isConnected: false,
          status: 'Connection Failed',
          error: `Database error: ${error.message}`
        };
      }

      console.log('Database connection test successful');
      return {
        isConnected: true,
        status: 'Connected',
        lastChecked: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Error testing database connection:', error);
      return {
        isConnected: false,
        status: 'Error',
        error: error.message || 'Unknown database connection error'
      };
    }
  }
};