import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase is not configured. Copy .env.example to .env, add your project URL and anon key, then restart the dev server or rebuild for production.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
