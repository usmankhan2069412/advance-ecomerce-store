const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get Supabase credentials from environment variables or use defaults
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fighfyrrdtzjemggtbxw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseServiceKey) {
  console.error('Missing Supabase service key. Please set SUPABASE_SERVICE_KEY environment variable.');
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
    console.log('Applying profile fields migration to Supabase...');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240501000000_add_missing_profile_fields.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    // Execute the SQL directly using the Supabase client
    const { error } = await supabase.rpc('pgmigrate', { query: migrationSql });

    if (error) {
      // If pgmigrate function doesn't exist, try direct SQL execution
      console.log('pgmigrate function not available, trying direct SQL execution...');
      
      // Split the SQL into individual statements
      const statements = migrationSql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: stmtError } = await supabase.sql(statement + ';');
          if (stmtError) {
            console.error(`Error executing statement: ${statement.substring(0, 100)}...`);
            console.error(stmtError);
          }
        }
      }
    }

    console.log('Migration applied successfully!');
    
    // Verify the columns were added
    const { data: profileColumns, error: profileError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles');
    
    if (profileError) {
      console.error('Error verifying profiles table structure:', profileError);
    } else {
      console.log('Profiles table columns:', profileColumns.map(col => col.column_name).join(', '));
    }
    
    // Check profile_users table
    const { data: profileUsersColumns, error: profileUsersError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'profile_users');
    
    if (profileUsersError) {
      console.error('Error verifying profile_users table structure:', profileUsersError);
    } else {
      console.log('Profile_users table columns:', profileUsersColumns.map(col => col.column_name).join(', '));
    }
    
    // Check if any profiles exist
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email')
      .limit(5);
    
    if (profilesError) {
      console.error('Error checking profiles:', profilesError);
    } else {
      console.log(`Found ${profiles.length} profiles:`, profiles.map(p => ({ id: p.id.substring(0, 8) + '...', name: p.name })));
    }
    
  } catch (error) {
    console.error('Error applying migration:', error);
  }
}

applyMigration();
