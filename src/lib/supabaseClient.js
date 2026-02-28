import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yvfttuolxenvbsztdkwh.supabase.co"; 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZnR0dW9seGVudmJzenRka3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjIwNTg1NCwiZXhwIjoyMDg3NzgxODU0fQ.-K8XOYd8N7yWeHo1zoi8sZ8QqVldKyR-71sfoFP47zo";

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
