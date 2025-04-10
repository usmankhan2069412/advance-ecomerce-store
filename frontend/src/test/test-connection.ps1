# PowerShell script to test Supabase connection

Write-Host "Installing required dependencies..." -ForegroundColor Cyan
npm install @supabase/supabase-js dotenv

Write-Host "`nTesting Supabase connection..." -ForegroundColor Cyan
node .\test-supabase.js  # Updated to use relative path

Write-Host "`nTest complete. If you see errors, check your .env.local file and Supabase settings." -ForegroundColor Yellow
