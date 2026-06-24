import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderStatus = "pending" | "cooking" | "ready";
export type Category = "Starters" | "Mains" | "Desserts";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // EUR
  category: Category;
  course: string;
  origin: string;
  pairing?: string;
  emoji: string;
}

export interface OrderItem {
  id: string; // item-instance id
  menuItemId: string;
  name: string;
  price: number;
  qty: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: number;
  guestName?: string;
}

export interface WaiterCall {
  id: string;
  tableId: string;
  reason: "service" | "bill";
  timestamp: number;
}

interface RestaurantState {
  menuItems: MenuItem[];
  stopList: Record<string, boolean>;
  orders: Order[];
  waiterCalls: WaiterCall[];
  revenue: number;

  // actions
  addOrder: (
    tableId: string,
    items: Omit<OrderItem, "id">[],
    guestName?: string
  ) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleStopList: (itemId: string) => void;
  callWaiter: (tableId: string, reason: "service" | "bill") => void;
  clearWaiterCall: (callId: string) => void;
  settleBill: (tableId: string) => number;
  visibleMenu: () => MenuItem[];
  tableOrder: (tableId: string) => Order | undefined;
}

export const TABLES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export const SEED_MENU: MenuItem[] = [
  {
    id: "st-01",
    name: "Osetra Caviar",
    description:
      "Imperial Oscietra · blini brioche · crème fraîche · chive oil · quail egg yolk",
    price: 95,
    category: "Starters",
    course: "Amuse",
    origin: "Caspian Sea",
    pairing: "Champagne · Salon '13",
    emoji: "🫧",
  },
  {
    id: "st-02",
    name: "Hokkaido Uni Tostada",
    description:
      "Bafun uni · yuzu kosho · Santa Barbara uni · tosazu gel · gold leaf",
    price: 120,
    category: "Starters",
    course: "Cold",
    origin: "Hokkaido, Japan",
    pairing: "Junmai Daiginjō · Dassai '39",
    emoji: "🌊",
  },
  {
    id: "mn-01",
    name: "A5 Wagyu, Miyazaki",
    description:
      "60 g striploin MB9+ · smoked bone marrow · Périgord black truffle · jus corsé",
    price: 245,
    category: "Mains",
    course: "Main",
    origin: "Kyushu, Japan",
    pairing: "Bordeaux · Lynch-Bages '15",
    emoji: "🥩",
  },
  {
    id: "mn-02",
    name: "Turbot Royal",
    description:
      "Wild turbot · champagne beurre blanc · Ossetra caviar · chervil · lemon confit",
    price: 195,
    category: "Mains",
    course: "Main",
    origin: "Brittany, France",
    pairing: "Chablis Grand Cru · Les Clos",
    emoji: "🐟",
  },
  {
    id: "ds-01",
    name: "Sphère Chocolat",
    description:
      "Single-origin Madagascar 75 % · smoked sea salt · tonka · hazelnut praline",
    price: 42,
    category: "Desserts",
    course: "Dessert",
    origin: "Madagascar",
    pairing: "Tokaji Late Harvest",
    emoji: "🍫",
  },
  {
    id: "ds-02",
    name: "Soufflé au Yuzu",
    description:
      "Warm yuzu soufflé · matcha ice cream · yuzu curd · gold dust",
    price: 38,
    category: "Desserts",
    course: "Dessert",
    origin: "Kōchi, Japan",
    pairing: "Sauternes · Château d'Yquem",
    emoji: "🍮",
  },
];

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      menuItems: SEED_MENU,
      stopList: {},
      orders: [],
      waiterCalls: [],
      revenue: 0,

      addOrder: (tableId, items, guestName) => {
        const id = `O-${Date.now().toString(36).toUpperCase()}`;
        const order: Order = {
          id,
          tableId,
          items: items.map((it) => ({ ...it, id: `${id}-${it.menuItemId}-${Math.random().toString(36).slice(2, 6)}` })),
          status: "cooking", // auto-send to kitchen
          timestamp: Date.now(),
          guestName,
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return id;
      },

      updateOrderStatus: (orderId, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),

      toggleStopList: (itemId) =>
        set((s) => ({
          stopList: { ...s.stopList, [itemId]: !s.stopList[itemId] },
        })),

      callWaiter: (tableId, reason) =>
        set((s) => ({
          waiterCalls: [
            { id: `W-${Date.now()}`, tableId, reason, timestamp: Date.now() },
            ...s.waiterCalls,
          ].slice(0, 30),
        })),

      clearWaiterCall: (callId) =>
        set((s) => ({ waiterCalls: s.waiterCalls.filter((c) => c.id !== callId) })),

      settleBill: (tableId) => {
        const tableOrders = get().orders.filter(
          (o) => o.tableId === tableId && o.status === "ready"
        );
        const total = tableOrders.reduce(
          (sum, o) => sum + o.items.reduce((s, it) => s + it.price * it.qty, 0),
          0
        );
        if (total > 0) {
          set((s) => ({
            orders: s.orders.filter(
              (o) => !(o.tableId === tableId && o.status === "ready")
            ),
            revenue: s.revenue + total,
          }));
        }
        return total;
      },

      visibleMenu: () => {
        const { menuItems, stopList } = get();
        return menuItems.filter((m) => !stopList[m.id]);
      },

      tableOrder: (tableId) => {
        return get().orders
          .filter((o) => o.tableId === tableId)
          .sort((a, b) => b.timestamp - a.timestamp)[0];
      },
    }),
    {
      name: "etoile-restaurant-os",
      version: 1,
    }
  )
);
