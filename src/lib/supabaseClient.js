import { createClient } from "@supabase/supabase-js";

// Your Supabase URL and Key (get them from your Supabase dashboard)
const supabaseUrl = "https://szacwcwggrsjipmmwqbt.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "sb_publishable_HbsR3S5x3Vap9oSesSWk_w_32N0VxYO"; // Replace with your Supabase public key
export const supabase = createClient(supabaseUrl, supabaseKey);
