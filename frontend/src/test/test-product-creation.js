// Simple script to test product creation
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testProductCreation() {
  console.log('Testing product creation...');
  
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
    
    // Create a test product
    const testProduct = {
      name: `Test Product ${Date.now()}`,
      description: 'This is a test product created by the test script',
      price: 99.99,
      category: 'Test',
      inventory: 100,
      client_id: `test_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    console.log('Attempting to create test product:', testProduct);
    
    // Insert the product
    const { data, error } = await supabase
      .from('products')
      .insert([testProduct])
      .select();
      
    if (error) {
      console.error('Error creating test product:');
      console.error(error);
      
      // Try alternative approach without .select()
      console.log('Trying alternative approach without .select()...');
      const { error: insertError } = await supabase
        .from('products')
        .insert([testProduct]);
        
      if (insertError) {
        console.error('Alternative approach also failed:');
        console.error(insertError);
        return;
      }
      
      console.log('Product inserted successfully without .select()');
      return;
    }
    
    console.log('Test product created successfully!');
    console.log(data);
    
  } catch (error) {
    console.error('Unexpected error:');
    console.error(error);
  }
}

testProductCreation();
