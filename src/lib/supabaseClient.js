// lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Replace these with your own Supabase project details
const supabaseUrl = 'https://kktfairmpogwlitxqeag.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdGZhaXJtcG9nd2xpdHhxZWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDU0NjgsImV4cCI6MjA4Nzc4MTQ2OH0.6QRvusPQnyRA913WL9FftVQJ_2UY8xh0UWLZmI2CQSE'; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
