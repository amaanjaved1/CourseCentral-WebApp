import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create and export the properly typed Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client initialized successfully'); 