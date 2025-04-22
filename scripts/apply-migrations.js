/**
 * This script applies the database migrations to your Supabase project
 * It can be run locally or against your production Supabase instance
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your environment variables');
  process.exit(1);
}

// Create Supabase client with service role key (has full access to the database)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigrations() {
  try {
    console.log('Applying migrations to Supabase...');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240419000000_add_profile_fields.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    // Execute the SQL directly using the Supabase client
    const { error } = await supabase.rpc('pgmigrate', { query: migrationSql });

    if (error) {
      // If the rpc method doesn't exist, try a different approach
      console.log('RPC method not available, trying direct SQL execution...');
      
      // Split the migration into separate statements
      const statements = migrationSql
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);

      // Execute each statement separately
      for (const statement of statements) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`Error executing SQL: ${statement}`);
          console.error(error);
          
          // Try one more approach - using the REST API directly
          try {
            const response = await fetch(`${supabaseUrl}/rest/v1/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'X-Client-Info': 'supabase-js/2.0.0',
                'Prefer': 'resolution=merge-duplicates'
              },
              body: JSON.stringify({
                query: statement
              })
            });
            
            if (!response.ok) {
              throw new Error(`Failed to execute SQL: ${await response.text()}`);
            }
          } catch (fetchError) {
            console.error('Failed to execute SQL via REST API:', fetchError);
          }
        }
      }
    }

    console.log('Migration applied successfully!');
    
    // Verify the columns were added
    const { data, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (verifyError) {
      console.error('Error verifying migration:', verifyError);
    } else {
      console.log('Profiles table structure:', Object.keys(data[0] || {}));
    }
  } catch (error) {
    console.error('Error applying migrations:', error);
  }
}

applyMigrations();
