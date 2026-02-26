import { supabase } from './supabaseClient';

export const uploadImage = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('restaurant-assets')
    .upload(fileName, file);

  if (error) throw error;

  const { publicURL } = supabase.storage
    .from('restaurant-assets')
    .getPublicUrl(fileName);

  return publicURL;
};
