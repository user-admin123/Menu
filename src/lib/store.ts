import { supabase } from "./supabaseClient";
import { Category, MenuItem, RestaurantInfo, User } from "./types";

const AUTH_KEY = "qrmenu_auth";

/* =========================
   AUTH (Simple Email/Password)
========================= */

export async function login(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) return false;

  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  return true;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

/* =========================
   RESTAURANT
========================= */

export async function getRestaurant(): Promise<RestaurantInfo | null> {
  const user = getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("restaurant")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (error) return null;
  return data;
}

export async function saveRestaurant(info: Partial<RestaurantInfo>) {
  const user = getCurrentUser();
  if (!user) return;

  const existing = await getRestaurant();

  if (existing) {
    await supabase
      .from("restaurant")
      .update(info)
      .eq("id", existing.id);
  } else {
    await supabase.from("restaurant").insert({
      ...info,
      owner_id: user.id,
    });
  }
}

/* =========================
   CATEGORIES
========================= */

export async function getCategories(): Promise<Category[]> {
  const restaurant = await getRestaurant();
  if (!restaurant) return [];

  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("position", { ascending: true });

  return data || [];
}

export async function saveCategories(categories: Category[]) {
  for (const cat of categories) {
    if (cat.id) {
      await supabase
        .from("categories")
        .update(cat)
        .eq("id", cat.id);
    } else {
      await supabase.from("categories").insert(cat);
    }
  }
}

export async function deleteCategory(id: number) {
  await supabase.from("categories").delete().eq("id", id);
}

/* =========================
   MENU ITEMS
========================= */

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data } = await supabase
    .from("items")
    .select("*")
    .order("position", { ascending: true });

  return data || [];
}

export async function saveMenuItems(items: MenuItem[]) {
  for (const item of items) {
    if (item.id) {
      await supabase
        .from("items")
        .update(item)
        .eq("id", item.id);
    } else {
      await supabase.from("items").insert(item);
    }
  }
}

export async function deleteMenuItem(id: number) {
  await supabase.from("items").delete().eq("id", id);
}
