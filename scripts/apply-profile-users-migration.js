/**
 * This script applies the profile_users migration to your Supabase database
 * Run this script with: node scripts/apply-profile-users-migration.js
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

async function applyMigration() {
  try {
    console.log('Applying profile_users migration to Supabase...');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240420000000_create_profile_users_table.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    // Split the migration into separate statements
    const statements = migrationSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement separately
    for (const statement of statements) {
      console.log(`Executing SQL statement: ${statement.substring(0, 100)}...`);
      
      try {
        // Try to execute the SQL directly
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.warn(`Warning: ${error.message}`);
          console.log('Continuing with next statement...');
        } else {
          console.log('Statement executed successfully');
        }
      } catch (statementError) {
        console.warn(`Error executing statement: ${statementError.message}`);
        console.log('Continuing with next statement...');
      }
    }

    console.log('Migration completed!');
    
    // Verify the profile_users table was created
    try {
      const { data, error } = await supabase
        .from('profile_users')
        .select('count(*)')
        .single();
      
      if (error) {
        console.error('Error verifying profile_users table:', error.message);
      } else {
        console.log(`profile_users table exists with ${data.count} rows`);
      }
    } catch (verifyError) {
      console.error('Error verifying migration:', verifyError.message);
    }
    
    // Check for existing profiles
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .limit(5);
      
      if (profilesError) {
        console.error('Error checking profiles:', profilesError.message);
      } else {
        console.log(`Found ${profiles.length} profiles`);
        
        // For each profile, ensure there's a corresponding profile_users entry
        for (const profile of profiles) {
          console.log(`Checking profile_users for profile ${profile.id}`);
          
          const { data: existingProfileUser, error: checkError } = await supabase
            .from('profile_users')
            .select('id')
            .eq('profile_id', profile.id)
            .maybeSingle();
          
          if (checkError) {
            console.error(`Error checking profile_users for ${profile.id}:`, checkError.message);
            continue;
          }
          
          if (!existingProfileUser) {
            console.log(`Creating profile_users entry for ${profile.id}`);
            
            const { error: insertError } = await supabase
              .from('profile_users')
              .insert([
                {
                  profile_id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  phone: '',
                  address: '',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);
            
            if (insertError) {
              console.error(`Error creating profile_users for ${profile.id}:`, insertError.message);
            } else {
              console.log(`Created profile_users entry for ${profile.id}`);
            }
          } else {
            console.log(`profile_users entry already exists for ${profile.id}`);
          }
        }
      }
    } catch (profilesError) {
      console.error('Error checking profiles:', profilesError.message);
    }
  } catch (error) {
    console.error('Error applying migration:', error);
  }
}

applyMigration();
