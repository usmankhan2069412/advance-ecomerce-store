# PowerShell script to test product creation

Write-Host "Installing required dependencies..." -ForegroundColor Cyan
npm install @supabase/supabase-js dotenv

Write-Host "`nTesting product creation..." -ForegroundColor Cyan
node test-product-creation.js

Write-Host "`nTest complete. If you see errors, check your .env.local file and Supabase settings." -ForegroundColor Yellow
