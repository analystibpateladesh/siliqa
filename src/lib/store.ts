import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  qty: number;
  tierLabel: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId ? { ...i, qty: i.qty + item.qty, unitPrice: item.unitPrice, tierLabel: item.tierLabel } : i,
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      removeItem: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.unitPrice * i.qty, 0),
    }),
    { name: "siliqa-cart" },
  ),
);

export type SavedOrder = {
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  status: "confirmed" | "packed" | "shipped" | "delivered";
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    pincode: string;
  };
};

type OrdersState = {
  orders: Record<string, SavedOrder>;
  save: (o: SavedOrder) => void;
  get: (id: string) => SavedOrder | undefined;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: {},
      save: (o) => set((s) => ({ orders: { ...s.orders, [o.orderId]: o } })),
      get: (id) => get().orders[id],
    }),
    { name: "siliqa-orders" },
  ),
);

type ThemeState = {
  theme: "light" | "dark";
  toggle: () => void;
  apply: () => void;
};

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggle: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
        }
      },
      apply: () => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", get().theme === "dark");
        }
      },
    }),
    { name: "siliqa-theme" },
  ),
);
