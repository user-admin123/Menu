import { createClient } from '@supabase/supabase-js';

// DO NOT LEAVE THIS IN PRODUCTION
const supabaseUrl = "https://kktfairmpogwlitxqeag.supabase.co"; 
const supabaseKey = "sb_publishable_tx28nZZRv5r9gtzbFa0jeQ_aWyQQijr";

// ADD THIS LOG:
console.log("LOG 1: Supabase Client initializing with:", { 
  url: supabaseUrl ? "Found" : "MISSING", 
  key: supabaseKey ? "Found" : "MISSING" 
});

export const supabase = createClient(supabaseUrl, supabaseKey);
