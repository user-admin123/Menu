import { supabase } from './supabaseClient';

// Login
export const loginUser = async (email, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('id,email,password')
    .eq('email', email)
    .single();

  if (error || !data) throw new Error('Invalid email or password');
  if (data.password !== password) throw new Error('Invalid email or password');

  return { id: data.id, email: data.email };
};

// Register
export const registerUser = async (email, password) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password }]);
  if (error) throw error;
  return data;
};
