import { createClient } from '@supabase/supabase-js';

// DO NOT LEAVE THIS IN PRODUCTION
const supabaseUrl = "https://yvfttuolxenvbsztdkwh.supabase.co"; 
const supabaseKey = "sb_publishable_o93bbwsBvnHfdzqWPQHAtw_V6J5JShb";

// ADD THIS LOG:
console.log("LOG 1: Supabase Client initializing with:", { 
  url: supabaseUrl ? "Found" : "MISSING", 
  key: supabaseKey ? "Found" : "MISSING" 
});

export const supabase = createClient(supabaseUrl, supabaseKey);
