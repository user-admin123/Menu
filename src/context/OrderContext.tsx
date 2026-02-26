import { createContext, useContext, useState, ReactNode } from "react";

export interface OrderItem {
  item_id: string;
  quantity: number;
}

interface OrderContextType {
  order: OrderItem[];
  updateQuantity: (item_id: string, quantity: number) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<OrderItem[]>([]);

  const updateQuantity = (item_id: string, quantity: number) => {
    setOrder(prev => {
      const existing = prev.find(o => o.item_id === item_id);

      if (existing) {
        if (quantity === 0) {
          return prev.filter(o => o.item_id !== item_id);
        }
        return prev.map(o =>
          o.item_id === item_id ? { ...o, quantity } : o
        );
      }

      if (quantity > 0) {
        return [...prev, { item_id, quantity }];
      }

      return prev;
    });
  };

  const clearOrder = () => setOrder([]);

  return (
    <OrderContext.Provider value={{ order, updateQuantity, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used inside OrderProvider");
  }
  return context;
}
