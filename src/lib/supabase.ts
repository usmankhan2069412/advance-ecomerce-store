import { createClient } from '@supabase/supabase-js';

// Hardcoded fallback values for development - replace with your actual Supabase project values
const FALLBACK_URL = 'https://fighfyrrdtzjemggtbxw.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZ2hmeXJyZHR6amVtZ2d0Ynh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTc2MzIsImV4cCI6MjA1OTc5MzYzMn0.CnGk7YbzGqLhwqPaFaHLY13Af1mRXX87tEWW54OkEJ4';

// Get environment variables or use fallbacks
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

// Validate URL format
if (!supabaseUrl.startsWith('https://')) {
  console.error('Invalid Supabase URL format. URL must start with https://');
  // Try to extract a valid URL if it's a JWT token (common mistake)
  try {
    const tokenParts = supabaseUrl.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload.ref) {
        supabaseUrl = `https://${payload.ref}.supabase.co`;
      }
    }
  } catch (e) {
    console.error('Failed to extract URL from token:', e);
  }
}

class SupabaseClient {
  private static instance: any;
  private static initializationPromise: Promise<any>;
  private static maxRetries = 3;
  private static retryDelay = 1000; // 1 second

  private constructor() {}

  public static async getInstance() {
    if (this.instance) {
      return this.instance;
    }

    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeClientWithRetry();
    }

    try {
      this.instance = await this.initializationPromise;
      return this.instance;
    } catch (error) {
      console.error('Failed to initialize Supabase client after retries:', error);
      throw new Error('Failed to initialize Supabase client. Please check your connection and credentials.');
    }
  }

  private static async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async initializeClientWithRetry(retryCount = 0): Promise<any> {
    try {
      const client = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: true },
        db: { schema: 'public' }
      });

      // Test connection with better error handling
      const { data, error } = await client
        .from('products')
        .select('id')
        .limit(1);

      if (error) {
        throw error;
      }

      console.log('Supabase connected successfully!');
      return client;
    } catch (error: any) {
      if (retryCount < this.maxRetries) {
        console.log(`Connection attempt ${retryCount + 1} failed. Retrying in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
        return this.initializeClientWithRetry(retryCount + 1);
      }

      console.error('Supabase initialization failed after max retries:', error?.message || error);
      throw error;
    }
  }
}

// Export an async function that returns the Supabase client
export default await SupabaseClient.getInstance();