# Authentication Setup Guide

This guide will help you set up the authentication system for your Aetheria e-commerce store.

## Prerequisites

- Node.js and npm installed
- Supabase account (free tier is sufficient)

## Setup Steps

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Note your project URL and anon key (public API key)

### 2. Set Up Environment Variables

1. Copy the `.env.local.example` file to `.env.local`:
   ```
   cp .env.local.example .env.local
   ```

2. Fill in the environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_at_least_32_chars_long
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

### 3. Set Up Database Schema

You can set up the database schema in two ways:

#### Option 1: Using the SQL Editor in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/migrations/20230701000000_create_auth_schema.sql`
4. Paste and run the SQL in the editor

#### Option 2: Using Supabase CLI (Recommended for Development)

1. Install Supabase CLI:
   ```
   npm install -g supabase
   ```

2. Login to Supabase:
   ```
   supabase login
   ```

3. Link your project:
   ```
   supabase link --project-ref your-project-ref
   ```

4. Push the migrations:
   ```
   supabase db push
   ```

### 4. Configure Authentication Settings in Supabase

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Set the Site URL to your website URL (e.g., `http://localhost:3000` for development)
4. Add any additional redirect URLs if needed
5. Enable Email auth provider and configure as needed
6. (Optional) Configure additional auth providers like Google, Apple, etc.

### 5. Install Dependencies

```
npm install @supabase/supabase-js sonner
```

### 6. Start the Development Server

```
npm run dev
```

## Authentication Flow

The authentication system uses Supabase Auth for secure user management:

1. **Sign Up**: Users can create an account with email/password or social providers
2. **Login**: Users can log in with their credentials
3. **Password Reset**: Users can request a password reset email
4. **Profile Management**: Users can view and update their profile information

## Security Considerations

- All passwords are securely hashed by Supabase Auth
- JWT tokens are used for session management
- Environment variables are used for sensitive information
- Row-Level Security (RLS) policies are implemented in the database

## Customization

You can customize the authentication UI by modifying the following files:

- `src/app/auth/page.tsx`: Main authentication page
- `src/contexts/AuthContext.tsx`: Authentication context provider
- `src/services/auth-service.ts`: Authentication service

## Troubleshooting

If you encounter any issues:

1. Check that your environment variables are correctly set
2. Ensure Supabase project is properly configured
3. Check browser console for any errors
4. Verify network requests in the browser developer tools

For more help, refer to the [Supabase documentation](https://supabase.com/docs).
