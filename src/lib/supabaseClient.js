// lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Replace these with your own Supabase project details
const supabaseUrl = 'https://szacwcwggrsjipmmwqbt.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_HbsR3S5x3Vap9oSesSWk_w_32N0VxYO'; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
