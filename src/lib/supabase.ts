import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check for environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window === 'undefined') {
    // This is server-side, so we need to throw an error that will be caught during build
    console.error('Missing Supabase environment variables. Please check your environment configuration.');
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
  } else {
    // Client-side, we can just log the error
    console.error('Missing Supabase environment variables in the browser.');
  }
}

// Create and export the properly typed Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log only in development to avoid leaking in production
if (process.env.NODE_ENV !== 'production') {
  console.log('Supabase client initialized successfully');
} 