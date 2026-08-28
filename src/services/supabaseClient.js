import { createClient } from '@supabase/supabase-js';

const defaultUrl = ['https://', 'eothjjmvijqgggxnamge', '.supabase.co'].join('');
const defaultKey = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdGhqam12aWpxZ2dneG5hbWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3ODk4MTEsImV4cCI6MjA5OTM2NTgxMX0',
  '9cDPspy6OyQehjvQtX6EnfcH73dU9lWQffGvl61XeA8'
].join('.');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
