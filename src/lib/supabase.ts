import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create a dummy client for development to prevent the app from crashing
  supabase = {
    auth: {
      signUp: async () => ({ error: { message: 'Supabase client not properly initialized' } }),
      signInWithPassword: async () => ({ error: { message: 'Supabase client not properly initialized' } }),
      signOut: async () => ({}),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    }
  } as any;
}

export { supabase }; 