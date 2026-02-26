import { useState, useEffect } from "react";
import { useOrder } from "@/context/OrderContext";
import { MenuItem } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface Props {
  items: MenuItem[];
}

const SummaryDrawer = ({ items }: Props) => {
  const { order, updateQuantity } = useOrder();
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = order.reduce((sum, o) => sum + o.quantity, 0);

  const totalPrice = order.reduce((sum, o) => {
    const item = items.find(i => i.id === o.item_id);
    return sum + (item ? item.price * o.quantity : 0);
  }, 0);

  // 🔒 Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ✅ Auto close drawer when cart becomes empty
  useEffect(() => {
    if (totalItems === 0) {
      setIsOpen(false);
    }
  }, [totalItems]);

  if (totalItems === 0) return null;

  return (
    <>
      {!isOpen && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-5 right-5 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-xl z-20 font-medium text-sm"
          onClick={() => setIsOpen(true)}
        >
          View Order
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(event, info) => {
                if (info.offset.x > 120) {
                  setIsOpen(false);
                }
              }}
              initial={{ x: 380 }}
              animate={{ x: 0 }}
              exit={{ x: 380 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed right-0 top-0 h-full w-[360px] bg-background shadow-2xl z-40 flex"
            >
              <div
                onClick={() => setIsOpen(false)}
                className="w-8 border-l border-r border-border bg-muted/30 flex items-center justify-center cursor-pointer"
              >
                <ChevronRight size={18} className="text-muted-foreground" />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="px-5 py-4 border-b">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Order Details
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {totalItems}{" "}
                    {totalItems > 1 ? "items selected" : "item selected"}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {order.map(o => {
                    const item = items.find(i => i.id === o.item_id);
                    if (!item) return null;

                    return (
                      <div
                        key={o.item_id}
                        className="bg-muted/40 rounded-xl px-3 py-3 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>

                          <p className="text-sm font-semibold text-primary">
                            ${(item.price * o.quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(0, o.quantity - 1)
                              )
                            }
                            className="w-7 h-7 rounded-full border flex items-center justify-center text-sm"
                          >
                            -
                          </button>

                          <span className="text-sm font-medium">
                            {o.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, o.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full border flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t px-5 py-4 bg-muted/30">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="text-primary">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SummaryDrawer;
