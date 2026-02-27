import { Category, MenuItem, RestaurantInfo } from "./types";
import supabase from './supabaseClient';

const CATEGORIES_KEY = "qrmenu_categories";
const ITEMS_KEY = "qrmenu_items";
const RESTAURANT_KEY = "qrmenu_restaurant";
const AUTH_KEY = "qrmenu_auth";
const ORDER_KEY = "qrmenu_order";

// Default owner credentials (from Supabase)
const DEFAULT_OWNER = { email: "admin@restaurant.com", password: "admin123" };

const defaultRestaurant: RestaurantInfo = {
  name: "La Maison",
  tagline: "Fine dining, reimagined",
  logo_url: "",
};

const defaultCategories: Category[] = [
  { id: "cat-1", name: "Starters", order_index: 0, created_at: new Date().toISOString() },
  { id: "cat-2", name: "Main Course", order_index: 1, created_at: new Date().toISOString() },
  { id: "cat-3", name: "Desserts", order_index: 2, created_at: new Date().toISOString() },
  { id: "cat-4", name: "Drinks", order_index: 3, created_at: new Date().toISOString() },
];

// Function to retrieve data from Supabase and store in variables
async function getFromSupabase<T>(key: string, table: string, defaults: T): Promise<T> {
  const { data, error } = await supabase.from(table).select('*');

  if (error || !data) {
    console.error(`Error fetching data from Supabase for ${table}:`, error);
    return defaults;  // Return defaults if error occurs
  }

  // Storing the fetched data in localStorage for persistence
  localStorage.setItem(key, JSON.stringify(data));

  return data as T;  // Return fetched data
}

// Restaurant
export async function getRestaurant(): Promise<RestaurantInfo> {
  return getFromSupabase(RESTAURANT_KEY, 'shops', defaultRestaurant);
}

export async function saveRestaurant(info: RestaurantInfo): Promise<void> {
  // For now we save it to localStorage but can extend to Supabase as needed.
  localStorage.setItem(RESTAURANT_KEY, JSON.stringify(info));
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const categories = await getFromSupabase(CATEGORIES_KEY, 'categories', defaultCategories);
  return categories.sort((a, b) => a.order_index - b.order_index);
}

export async function saveCategories(cats: Category[]): Promise<void> {
  // Save locally for now (can be extended to Supabase if needed)
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
}

// Menu Items
export async function getMenuItems(): Promise<MenuItem[]> {
  return getFromSupabase(ITEMS_KEY, 'menu_items', []);
}

export async function saveMenuItems(items: MenuItem[]): Promise<void> {
  // Save locally for now (can be extended to Supabase if needed)
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export type OrderItem = {
  item_id: string;
  quantity: number;
};

// Get current order from localStorage
export function getOrder(): OrderItem[] {
  return JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
}

// Save order to localStorage
export function saveOrder(order: OrderItem[]): void {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

// Clear order (optional)
export function clearOrder(): void {
  localStorage.removeItem(ORDER_KEY);
}

// Auth
export async function login(email: string, password: string): Promise<boolean> {
  // Query Supabase for user validation
  const { data, error } = await supabase
    .from('admins')  // Query the admins table in Supabase
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user from Supabase:', error);
    return false;  // Return false if an error occurs (e.g., user not found)
  }

  // Check if the password matches
  if (data && data.password === password) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;  // Successful login
  }

  return false;  // Return false if email or password doesn't match
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}
