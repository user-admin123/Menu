import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// ADD THIS LOG:
console.log("LOG 1: Supabase Client initializing with:", { 
  url: supabaseUrl ? "Found" : "MISSING", 
  key: supabaseKey ? "Found" : "MISSING" 
});

export const supabase = createClient(supabaseUrl, supabaseKey);
