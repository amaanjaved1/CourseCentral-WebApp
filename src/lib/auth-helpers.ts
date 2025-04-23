import { supabase } from './supabase';
import { cookies } from 'next/headers';

// This is an adapter to replace the functionality from @supabase/auth-helpers-nextjs
// without requiring the additional package

export const createRouteHandlerClient = ({ cookies: getCookies }: { cookies: () => any }) => {
  // We already have our supabase client initialized in lib/supabase.ts
  // So we'll just return that
  return supabase;
}; 