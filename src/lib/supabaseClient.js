// lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Replace these with your own Supabase project details
const supabaseUrl = 'https://szacwcwggrsjipmmwqbt.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6YWN3Y3dnZ3JzamlwbW13cWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjE2NTcsImV4cCI6MjA4NzY5NzY1N30.StzDoZgHlqIC3y3-bZ532i547iU2n54WhatHl8XYadA'; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
