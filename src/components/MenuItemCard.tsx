import { useState, forwardRef } from "react";
import { MenuItem } from "@/lib/types";
import { useOrder } from "@/context/OrderContext";
import { motion } from "framer-motion";
import VegBadge from "@/components/VegBadge";
import { cn } from "@/lib/utils";
import ItemDetailDrawer from "@/components/ItemDetailDrawer";

interface Props {
  item: MenuItem;
}

const MenuItemCard = forwardRef<HTMLDivElement, Props>(
  ({ item }, ref) => {
    const { order, updateQuantity } = useOrder();
    const existing = order.find(o => o.item_id === item.id);
    const quantity = existing?.quantity || 0;

    const [showDetails, setShowDetails] = useState(false);

    return (
      <>
        <motion.div
          ref={ref}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowDetails(true)}
          className={cn(
            "flex gap-4 p-4 rounded-xl border bg-background shadow-sm hover:shadow-md transition-all cursor-pointer",
            !item.available && "opacity-70"
          )}
        >
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs bg-muted text-muted-foreground">
                No Image
              </div>
            )}

            {!item.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <span className="text-white text-xs font-semibold uppercase tracking-wide">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between min-w-0">
            <div className="flex items-baseline gap-2">
              <VegBadge type={item.item_type || "veg"} />
              <h3 className="text-base font-semibold line-clamp-2">
                {item.name}
              </h3>
            </div>

            {item.available && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between mt-3"
              >
                <span className="text-sm font-medium text-primary">
                  ${item.price.toFixed(2)}
                </span>

                {quantity === 0 ? (
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-3 py-1 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition"
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center gap-2 border rounded-full px-2 py-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(0, quantity - 1))
                      }
                      className="text-lg"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-5 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, quantity + 1)
                      }
                      className="text-lg text-primary"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {showDetails && (
          <ItemDetailDrawer
            item={item}
            onClose={() => setShowDetails(false)}
          />
        )}
      </>
    );
  }
);

MenuItemCard.displayName = "MenuItemCard";
export default MenuItemCard;
