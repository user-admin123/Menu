import { supabase } from "./supabaseClient";
import { Category, MenuItem, RestaurantInfo } from "./types";

const AUTH_KEY = "qrmenu_auth";
const ORDER_KEY = "qrmenu_order";

// --- ORDER LOGIC (STAYS LOCAL STORAGE) ---
export const getOrder = () => JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
export const saveOrder = (order: any[]) => localStorage.setItem(ORDER_KEY, JSON.stringify(order));
export const clearOrder = () => localStorage.removeItem(ORDER_KEY);

// --- SUPABASE LOGIC (ASYNC) ---

export const getRestaurant = async (): Promise<RestaurantInfo> => {
  const { data } = await supabase.from("restaurant_info").select("*").single();
  return data || { name: "La Maison", tagline: "Fine dining", logo_url: "" };
};

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await supabase.from("categories").select("*").order("order_index");
  return data || [];
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const { data } = await supabase.from("menu_items").select("*");
  return data || [];
};

export const syncAllData = async (
  res: RestaurantInfo,
  cats: Category[],
  its: MenuItem[],
  deletions: { cats: string[], items: string[] }
) => {
  if (deletions.items.length) await supabase.from("menu_items").delete().in("id", deletions.items);
  if (deletions.cats.length) await supabase.from("categories").delete().in("id", deletions.cats);

  await Promise.all([
    supabase.from("restaurant_info").upsert([{ id: 1, ...res }]),
    supabase.from("categories").upsert(cats),
    supabase.from("menu_items").upsert(its)
  ]);
};

export const login = async (email: string, pass: string): Promise<boolean> => {
  const { data } = await supabase.from("admin_users").select("*").eq("email", email).eq("password", pass).single();
  if (data) localStorage.setItem(AUTH_KEY, "true");
  return !!data;
};

export const logout = () => localStorage.removeItem(AUTH_KEY);
export const isAuthenticated = () => localStorage.getItem(AUTH_KEY) === "true";
