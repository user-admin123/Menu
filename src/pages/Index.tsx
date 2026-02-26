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

const Index = () => {
  const {
    categories,
    items,
    restaurant,
    authed,
    login,
    logout,
    updateCategories,
    updateItems,
    updateRestaurant,
  } = useMenuData();

  const [activeCat, setActiveCat] = useState(categories[0]?.id || "");
  const [showLogin, setShowLogin] = useState(false);
  const [vegFilter, setVegFilter] = useState<ItemType | "all">("all");

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isManualScroll = useRef(false);

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
        .filter((i) => restaurant.show_sold_out !== false || i.available)
        .sort((a, b) =>
          a.available === b.available ? 0 : a.available ? -1 : 1
        ),
    [items, vegFilter, restaurant.show_sold_out]
  );

  const visibleCategories = categories.filter(
    (cat) => getItemsForCategory(cat.id).length > 0
  );

  useEffect(() => {
    if (
      visibleCategories.length > 0 &&
      !visibleCategories.find((c) => c.id === activeCat)
    ) {
      setActiveCat(visibleCategories[0].id);
    }
  }, [visibleCategories, activeCat]);

  // Scroll logic for category highlight
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll.current) return;

      const offset = 140; // header + tabs
      let currentId = "";

      visibleCategories.forEach((cat) => {
        const el = sectionRefs.current[cat.id];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (rect.top - offset <= 0) currentId = cat.id;
        if (rect.bottom <= window.innerHeight) currentId = cat.id;
      });

      if (currentId && currentId !== activeCat) {
        setActiveCat(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCategories, activeCat]);

  const scrollToCategory = useCallback((id: string) => {
    isManualScroll.current = true;
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveCat(id);
    setTimeout(() => {
      isManualScroll.current = false;
    }, 1000);
  }, []);

  const scrollToMenuItem = useCallback((item: MenuItem) => {
  const el = cardRefs.current[item.id];
  if (!el) return;

  isManualScroll.current = true;

  // Scroll to the menu item
  el.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  // Highlight the card temporarily
  el.classList.add("border-primary", "shadow-primary");
  setTimeout(() => el.classList.remove("border-primary", "shadow-primary"), 2000);

  // 🔹 Update active category immediately
  setActiveCat(item.category_id);

  // Reset manual scroll flag after animation
  setTimeout(() => {
    isManualScroll.current = false;
  }, 1000);
}, []);

  const allVisibleItems = useMemo(
    () => visibleCategories.flatMap((cat) => getItemsForCategory(cat.id)),
    [visibleCategories, getItemsForCategory]
  );

  return (
    <OrderProvider>
      <div className="min-h-screen bg-background">
        <div className="relative z-10 max-w-lg mx-auto pb-12">
          {/* Admin/Login */}
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

          {/* Header */}
          <RestaurantHeader restaurant={restaurant} onAdminClick={handleAdminTrigger} />

          {/* Search */}
          {restaurant.show_search && <SearchBar items={allVisibleItems} onSelect={scrollToMenuItem} />}

          {/* Veg Filter (white text + background for active) */}
          {restaurant.show_veg_filter && (
            <div className="flex gap-2 px-4 py-2 justify-center">
              {(["all", "veg", "nonveg"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setVegFilter(type)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all border",
                    vegFilter === type
                      ? "bg-primary text-white border-primary"
                      : "bg-transparent text-white border-border/30 hover:text-white"
                  )}
                >
                  {type === "all" ? "All" : <>
                    <VegBadge type={type} size="sm" />
                    {type === "veg" ? "Veg" : "Non-Veg"}
                  </>}
                </button>
              ))}
            </div>
          )}

          {/* Category Tabs */}
          {visibleCategories.length > 0 && (
            <CategoryTabs
              categories={visibleCategories}
              activeId={activeCat}
              onSelect={scrollToCategory}
            />
          )}

          {/* Menu Sections */}
          <main className="px-4 mt-4 space-y-8">
            {visibleCategories.map((cat) => {
              const catItems = getItemsForCategory(cat.id);
              return (
                <section key={cat.id} ref={(el) => (sectionRefs.current[cat.id] = el)} className="scroll-mt-20">
                  <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">{cat.name}</h2>
                  <div className="space-y-3">
                    {catItems.map((item) => (
                      <MenuItemCard key={item.id} item={item} ref={(el) => (cardRefs.current[item.id] = el)} />
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
