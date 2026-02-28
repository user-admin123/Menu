import { OrderProvider } from "@/context/OrderContext";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useMenuData } from "@/hooks/useMenuData";
import RestaurantHeader from "@/components/RestaurantHeader";
import CategoryTabs from "@/components/CategoryTabs";
import MenuItemCard from "@/components/MenuItemCard";
import LoginModal from "@/components/LoginModal";
import AdminPanel from "@/components/AdminPanel";
import SearchBar from "@/components/SearchBar";
import { MenuItem, ItemType } from "@/lib/types";
import VegBadge from "@/components/VegBadge";
import SummaryDrawer from "@/components/SummaryDrawer";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient"; 

console.log("LOG: Index.tsx file loaded");

const Index = () => {
  console.log("LOG: Index Component Rendering Started");

  // --- Connection Status State ---
  const [dbStatus, setDbStatus] = useState<{ loading: boolean; error: string | null }>({
    loading: true,
    error: null,
  });

  // --- Menu Data Hook ---
  // We use "|| {}" to prevent crashing if useMenuData returns null/undefined
  const menuData = useMenuData();
  const {
    categories = [],
    items = [],
    restaurant = { name: "Restaurant", show_sold_out: true },
    authed = false,
    login = () => {},
    logout = () => {},
    updateCategories = () => {},
    updateItems = () => {},
    updateRestaurant = () => {},
  } = menuData || {};

  // --- UI States ---
  // FIX: Initialize with "" to prevent categories[0] undefined crash
  const [activeCat, setActiveCat] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [vegFilter, setVegFilter] = useState<ItemType | "all">("all");

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isManualScroll = useRef(false);

  // --- 1. Connection Check Effect ---
  useEffect(() => {
    const checkConnection = async () => {
      console.log("LOG: Checking Supabase Connection...");
      try {
        if (!supabase) throw new Error("Supabase client is undefined");
        
        const { error } = await supabase.from("user").select("id").limit(1);
        
        if (error) throw error;
        
        console.log("LOG: Supabase Connected Successfully");
        setDbStatus({ loading: false, error: null });
      } catch (err: any) {
        console.error("LOG: Supabase Connection Error:", err.message);
        setDbStatus({ loading: false, error: err.message || "Failed to connect" });
      }
    };
    checkConnection();
  }, []);

  // --- 2. Set Active Category when data loads ---
  useEffect(() => {
    if (categories.length > 0 && !activeCat) {
      console.log("LOG: Setting initial active category:", categories[0].id);
      setActiveCat(categories[0].id);
    }
  }, [categories, activeCat]);

  // --- Helper Functions ---
  const handleAdminTrigger = () => setShowLogin(true);
  const handleLogout = () => {
    logout();
    setShowLogin(false);
  };

  const getItemsForCategory = useCallback(
    (catId: string) =>
      items
        .filter((i) => i.category_id === catId)
        .filter((i) => vegFilter === "all" || i.item_type === vegFilter)
        .filter((i) => restaurant?.show_sold_out !== false || i.available)
        .sort((a, b) => (a.available === b.available ? 0 : a.available ? -1 : 1)),
    [items, vegFilter, restaurant?.show_sold_out]
  );

  const visibleCategories = useMemo(() => 
    categories.filter((cat) => getItemsForCategory(cat.id).length > 0),
    [categories, getItemsForCategory]
  );

  // --- Scroll Logic ---
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll.current) return;
      const offset = 140; 
      let currentId = "";

      visibleCategories.forEach((cat) => {
        const el = sectionRefs.current[cat.id];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top - offset <= 0) currentId = cat.id;
      });

      if (currentId && currentId !== activeCat) {
        setActiveCat(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCategories, activeCat]);

  const scrollToCategory = useCallback((id: string) => {
    isManualScroll.current = true;
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveCat(id);
    setTimeout(() => { isManualScroll.current = false; }, 1000);
  }, []);

  const scrollToMenuItem = useCallback((item: MenuItem) => {
    const el = cardRefs.current[item.id];
    if (!el) return;
    isManualScroll.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("border-primary", "shadow-primary");
    setTimeout(() => el.classList.remove("border-primary", "shadow-primary"), 2000);
    setActiveCat(item.category_id);
    setTimeout(() => { isManualScroll.current = false; }, 1000);
  }, []);

  const allVisibleItems = useMemo(
    () => visibleCategories.flatMap((cat) => getItemsForCategory(cat.id)),
    [visibleCategories, getItemsForCategory]
  );

  // --- RENDER LOGIC ---
  
  // 1. Show a loading screen instead of black if checking DB
  if (dbStatus.loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-sm font-mono">Connecting to Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <OrderProvider>
      {/* DB Status Banner */}
      <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
        {dbStatus.error && (
          <div className="bg-destructive text-destructive-foreground px-4 py-1 text-center text-[10px] font-bold pointer-events-auto">
            ⚠️ CONNECTION ERROR: {dbStatus.error}
          </div>
        )}
      </div>

      <div className="min-h-screen bg-background pt-4">
        <div className="relative z-10 max-w-lg mx-auto pb-12">
          {authed ? (
            <AdminPanel
              categories={categories}
              items={items}
              restaurant={restaurant}
              onUpdateCategories={updateCategories}
              onUpdateItems={updateItems}
              onUpdateRestaurant={updateRestaurant}
              onLogout={handleLogout}
            />
          ) : (
            showLogin && <LoginModal onLogin={login} />
          )}

          <RestaurantHeader restaurant={restaurant} onAdminClick={handleAdminTrigger} />

          {restaurant?.show_search && (
            <SearchBar items={allVisibleItems} onSelect={scrollToMenuItem} />
          )}

          {restaurant?.show_veg_filter && (
            <div className="flex gap-2 px-4 py-2 justify-center">
              {(["all", "veg", "nonveg"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setVegFilter(type)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all border",
                    vegFilter === type
                      ? "bg-primary text-white border-primary"
                      : "bg-transparent text-white border-border/30"
                  )}
                >
                  {type === "all" ? "All" : (
                    <>
                      <VegBadge type={type} size="sm" />
                      {type === "veg" ? "Veg" : "Non-Veg"}
                    </>
                  )}
                </button>
              ))}
            </div>
          )}

          {visibleCategories.length > 0 && (
            <CategoryTabs
              categories={visibleCategories}
              activeId={activeCat}
              onSelect={scrollToCategory}
            />
          )}

          <main className="px-4 mt-4 space-y-8">
            {visibleCategories.length === 0 && !dbStatus.loading && (
              <p className="text-center text-muted-foreground py-10">No items available.</p>
            )}
            
            {visibleCategories.map((cat) => {
              const catItems = getItemsForCategory(cat.id);
              return (
                <section 
                  key={cat.id} 
                  ref={(el) => (sectionRefs.current[cat.id] = el)} 
                  className="scroll-mt-20"
                >
                  <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                    {cat.name}
                  </h2>
                  <div className="space-y-3">
                    {catItems.map((item) => (
                      <MenuItemCard 
                        key={item.id} 
                        item={item} 
                        ref={(el) => (cardRefs.current[item.id] = el)} 
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </main>
        </div>

        <SummaryDrawer items={items} />
      </div>
    </OrderProvider>
  );
};

export default Index;
