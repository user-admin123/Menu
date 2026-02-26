import { supabase } from './supabaseClient';

// Restaurant
export const getRestaurant = async (ownerId) =>
  supabase.from('restaurant').select('*').eq('owner_id', ownerId).single();

// Categories
export const getCategories = async (restaurantId) =>
  supabase.from('categories').select('*').eq('restaurant_id', restaurantId).order('position');

// Items
export const getItems = async (categoryId) =>
  supabase.from('items').select('*').eq('category_id', categoryId).order('position');
