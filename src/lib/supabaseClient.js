import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mzcghpawrcudgakhhnpp.supabase.co"; 
const supabaseKey = "sb_publishable_BpSLXTYOsYH4gFCcF9slfg_OnSwx8jzwIjoyMDg3NzgxODU0fQ.-K8XOYd8N7yWeHo1zoi8sZ8QqVldKyR-71sfoFP47zo";

console.log("LOG 1: Supabase Config Check", { 
  urlPrefix: supabaseUrl?.slice(0, 10), 
  keyLength: supabaseKey?.length 
});

if (!supabaseUrl || !supabaseKey) {
  console.error("LOG: Supabase credentials missing!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Log the actual client object to see internal headers
console.log("LOG 2: Supabase Client Instance Created", {
  authUrl: supabase.authUrl,
  headers: supabase.rest.headers
});
