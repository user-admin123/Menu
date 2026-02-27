import { Category, MenuItem, RestaurantInfo, OrderItem } from "./types";
import supabase from './supabaseClient';  // Import Supabase client setup

const CATEGORIES_KEY = "qrmenu_categories";
const ITEMS_KEY = "qrmenu_items";
const RESTAURANT_KEY = "qrmenu_restaurant";
const AUTH_KEY = "qrmenu_auth";
const ORDER_KEY = "qrmenu_order";

// Default owner credentials (in your Supabase `admins` table)
const DEFAULT_OWNER = { email: "admin@restaurant.com", password: "admin123" };

// Dummy default restaurant info
const defaultRestaurant: RestaurantInfo = {
  name: "Default Restaurant",  // Simple name
  tagline: "Just a simple restaurant",  // Dummy tagline
  logo_url: "",  // No logo in default
};

// Dummy default categories (simplified)
const defaultCategories: Category[] = [
  { id: "cat-1", name: "Appetizers", order_index: 0, created_at: new Date().toISOString() },
  { id: "cat-2", name: "Main Course", order_index: 1, created_at: new Date().toISOString() },
];

// Dummy default menu items (simplified)
const defaultItems: MenuItem[] = [
  { id: "item-1", name: "Caesar Salad", description: "Classic Caesar Salad with fresh greens.", price: 7.5, available: true, image_url: "https://via.placeholder.com/150", category_id: "cat-1", item_type: "veg", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "item-2", name: "Grilled Chicken", description: "Juicy grilled chicken with a savory marinade.", price: 15.0, available: true, image_url: "https://via.placeholder.com/150", category_id: "cat-2", item_type: "nonveg", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

function getOrInit<T>(key: string, defaults: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}

function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Restaurant
export async function getRestaurant(): Promise<RestaurantInfo> {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .single();

  // If Supabase fetch fails, return the default restaurant
  if (error || !data) {
    return defaultRestaurant; // Return default data if error occurs
  }

  return {
    name: data.name,
    tagline: data.tagline,
    logo_url: data.logo_url || '',
  };
}

export async function saveRestaurant(info: RestaurantInfo) {
  const { error } = await supabase
    .from('shops')
    .upsert({
      name: info.name,
      tagline: info.tagline,
      logo_url: info.logo_url,
    });

  if (error) {
    console.error('Error saving restaurant info:', error.message);
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order_index', { ascending: true });

  // If Supabase fetch fails, return the default categories
  if (error || !data) {
    return defaultCategories; // Return default categories if error occurs
  }

  return data;
}

export async function saveCategories(cats: Category[]) {
  const { error } = await supabase
    .from('categories')
    .upsert(cats);

  if (error) {
    console.error('Error saving categories:', error.message);
  }
}

// Menu Items
export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*');

  // If Supabase fetch fails, return the default items
  if (error || !data) {
    return defaultItems; // Return default items if error occurs
  }

  return data;
}

export async function saveMenuItems(items: MenuItem[]) {
  const { error } = await supabase
    .from('menu_items')
    .upsert(items);

  if (error) {
    console.error('Error saving menu items:', error.message);
  }
}

// Order
export function getOrder(): OrderItem[] {
  return getOrInit(ORDER_KEY, []);
}

export function saveOrder(order: OrderItem[]) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function clearOrder() {
  localStorage.removeItem(ORDER_KEY);
}

// Auth
export async function login(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    return false;
  }

  localStorage.setItem(AUTH_KEY, "true");
  return true;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}
