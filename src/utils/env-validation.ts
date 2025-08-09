/**
 * Environment variables validation utility
 * Ensures all required environment variables are present and valid
 */

interface RequiredEnvVars {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_API_URL: string;
}

interface OptionalEnvVars {
  SUPABASE_SERVICE_ROLE_KEY?: string;
  JWT_SECRET?: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  NEXT_PUBLIC_MIXPANEL_TOKEN?: string;
  NEXT_PUBLIC_HOTJAR_ID?: string;
  NEXT_PUBLIC_HOTJAR_VERSION?: string;
}

export function validateEnvironmentVariables(): RequiredEnvVars & OptionalEnvVars {
  const errors: string[] = [];
  
  // Check required variables
  const requiredVars: (keyof RequiredEnvVars)[] = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_API_URL'
  ];

  const envVars: any = {};

  // Validate required variables
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      errors.push(`Missing required environment variable: ${varName}`);
    } else {
      envVars[varName] = value;
    }
  });

  // Validate Supabase URL format
  if (envVars.NEXT_PUBLIC_SUPABASE_URL) {
    if (!envVars.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://') || 
        !envVars.NEXT_PUBLIC_SUPABASE_URL.includes('.supabase.co')) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase URL');
    }
  }

  // Validate API URL format
  if (envVars.NEXT_PUBLIC_API_URL) {
    try {
      new URL(envVars.NEXT_PUBLIC_API_URL);
    } catch {
      errors.push('NEXT_PUBLIC_API_URL must be a valid URL');
    }
  }

  // Add optional variables
  const optionalVars: (keyof OptionalEnvVars)[] = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_MIXPANEL_TOKEN',
    'NEXT_PUBLIC_HOTJAR_ID',
    'NEXT_PUBLIC_HOTJAR_VERSION'
  ];

  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      envVars[varName] = value;
    }
  });

  // Warn about missing optional but important variables
  const warnings: string[] = [];
  
  if (!envVars.SUPABASE_SERVICE_ROLE_KEY) {
    warnings.push('SUPABASE_SERVICE_ROLE_KEY is missing - some admin features may not work');
  }
  
  if (!envVars.JWT_SECRET) {
    warnings.push('JWT_SECRET is missing - token signing may not work properly');
  }

  if (!envVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || !envVars.STRIPE_SECRET_KEY) {
    warnings.push('Stripe keys are missing - payment processing will not work');
  }

  // Log warnings in development
  if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
    console.warn('Environment variable warnings:');
    warnings.forEach(warning => console.warn(`- ${warning}`));
  }

  // Throw error if required variables are missing
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  return envVars;
}

// Validate on import in development
if (process.env.NODE_ENV === 'development') {
  try {
    validateEnvironmentVariables();
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Environment validation failed:', error.message);
  }
}