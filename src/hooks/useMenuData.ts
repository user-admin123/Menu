import { useState, useCallback } from "react";
import { Category, MenuItem, RestaurantInfo } from "@/lib/types";
import {
  getCategories, saveCategories,
  getMenuItems, saveMenuItems,
  getRestaurant, saveRestaurant,
  isAuthenticated, login as doLogin, logout as doLogout,
} from "@/lib/store";

export function useMenuData() {
  const [categories, setCategories] = useState<Category[]>(getCategories);
  const [items, setItems] = useState<MenuItem[]>(getMenuItems);
  const [restaurant, setRestaurant] = useState<RestaurantInfo>(getRestaurant);
  const [authed, setAuthed] = useState(isAuthenticated);

  const refresh = useCallback(() => {
    setCategories(getCategories());
    setItems(getMenuItems());
    setRestaurant(getRestaurant());
  }, []);

  const updateCategories = useCallback((cats: Category[]) => {
    saveCategories(cats);
    setCategories([...cats].sort((a, b) => a.order_index - b.order_index));
  }, []);

  const updateItems = useCallback((newItems: MenuItem[]) => {
    saveMenuItems(newItems);
    setItems(newItems);
  }, []);

  const updateRestaurant = useCallback((info: RestaurantInfo) => {
    saveRestaurant(info);
    setRestaurant(info);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const ok = doLogin(email, password);
    if (ok) setAuthed(true);
    return ok;
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setAuthed(false);
  }, []);

  return { categories, items, restaurant, authed, login, logout, updateCategories, updateItems, updateRestaurant, refresh };
}
