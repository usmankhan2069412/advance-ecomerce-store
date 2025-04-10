// Simple script to test Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables!');
    console.error('Make sure you have .env.local file with:');
    console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key');
    return;
  }
  
  console.log('Environment variables found:');
  console.log(`- URL: ${supabaseUrl.substring(0, 15)}...`);
  console.log(`- Key length: ${supabaseKey.length} characters`);
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by trying to fetch a single row
    console.log('Attempting to connect to Supabase...');
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Error connecting to Supabase:');
      console.error(error);
      return;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log(`Found ${data.length} products in the database.`);
    
    // Test products table structure
    console.log('\nChecking products table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'products' });
      
    if (tableError) {
      console.error('Error getting table structure:');
      console.error(tableError);
    } else {
      console.log('Products table columns:');
      tableInfo.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type})`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:');
    console.error(error);
  }
}

testSupabaseConnection();
