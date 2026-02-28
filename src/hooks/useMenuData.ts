import { useState, useCallback, useEffect } from "react";
import { Category, MenuItem, RestaurantInfo } from "@/lib/types";
import * as store from "@/lib/store";

export function useMenuData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [authed, setAuthed] = useState(store.isAuthenticated());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [cats, its, res] = await Promise.all([
      store.getCategories(),
      store.getMenuItems(),
      store.getRestaurant()
    ]);
    setCategories(cats);
    setItems(its);
    setRestaurant(res);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const onUpdateAll = useCallback(async (res, cats, its, deletions) => {
    setLoading(true);
    await store.syncAllData(res, cats, its, deletions);
    await refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const ok = await store.login(email, password);
    if (ok) setAuthed(true);
    return ok;
  }, []);

  const logout = useCallback(() => {
    store.logout();
    setAuthed(false);
  }, []);

  return { categories, items, restaurant, authed, loading, login, logout, onUpdateAll, refresh };
}
