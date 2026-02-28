import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://bvavdhratcsflzsrclpe.supabase.co"; 
const supabaseKey = "sb_publishable_hUU9O-2Vc3I4eAsW9S3eNA_TinhiG5j";

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
