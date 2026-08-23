"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  CartItem,
  CafeOrder,
  MenuItem,
  OrderStatus,
  SelectedCustomOption,
  TableItem,
  TableReservation,
  TableStatus,
} from "@/types/cafe";
import { MOCK_MENU } from "@/data/mockMenu";
import { MOCK_TABLES } from "@/data/mockTables";
import { MOCK_ORDERS } from "@/data/mockOrders";
import { CAFE_CONFIG } from "@/data/cafeConfig";
import { firebaseSync } from "@/lib/firebase";

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: "success" | "info" | "warning" | "error";
  duration?: number;
}

interface CafeContextType {
  // Mode & Currency
  userRole: "customer" | "staff" | "owner";
  setUserRole: (role: "customer" | "staff" | "owner") => void;
  currencyMode: "NPR" | "USD";
  setCurrencyMode: (currency: "NPR" | "USD") => void;
  formatPrice: (priceInNpr: number) => string;

  // Selected Table (from QR scan)
  selectedTableNumber: number | null;
  setSelectedTableNumber: (tableNumber: number | null) => void;

  // Menu State & CRUD
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id" | "rating" | "reviewsCount">) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity?: number,
    selectedOptions?: SelectedCustomOption[],
    notes?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartServiceCharge: number;
  cartVat: number;
  cartGrandTotal: number;

  // Cart Drawer open/close
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Tables State & CRUD
  tables: TableItem[];
  addTable: (table: Omit<TableItem, "id">) => void;
  updateTableConfig: (tableId: number, updates: Partial<TableItem>) => void;
  deleteTable: (tableId: number) => void;
  updateTableStatus: (tableId: number, status: TableStatus, details?: Partial<TableItem>) => void;
  assignGuestToTable: (tableId: number, guestName: string, guestCount: number) => void;
  freeTable: (tableId: number) => void;
  reserveTable: (
    tableNumber: number,
    reservationData: Omit<TableReservation, "id" | "createdAt" | "status">
  ) => boolean;
  getTableByNumber: (tableNumber: number) => TableItem | undefined;

  // Orders State
  orders: CafeOrder[];
  placeOrder: (
    tableNumber: number,
    paymentMethod: CafeOrder["paymentMethod"],
    notes?: string,
    guestName?: string
  ) => CafeOrder;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getActiveOrderByTable: (tableNumber: number) => CafeOrder | undefined;

  // Analytics
  totalRevenue: number;
  totalOrdersCount: number;
  averageOrderValue: number;

  // Toasts & Audio
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  playAudioCue: (type: "bell" | "pop" | "success") => void;
  resetToDefaults: () => void;
}

const CafeContext = createContext<CafeContextType | null>(null);

const STORAGE_KEYS = {
  MENU: "aura_cafe_menu_v2",
  TABLES: "aura_cafe_tables_v2",
  ORDERS: "aura_cafe_orders_v2",
  CART: "aura_cafe_cart_v2",
  ROLE: "aura_cafe_role_v2",
  TABLE_NUM: "aura_cafe_selected_table_v2",
};

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Roles & Currency
  const [userRole, setUserRoleState] = useState<"customer" | "staff" | "owner">("customer");
  const [currencyMode, setCurrencyMode] = useState<"NPR" | "USD">("NPR");
  const [selectedTableNumber, setSelectedTableNumberState] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Core Data
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU);
  const [tables, setTables] = useState<TableItem[]>(MOCK_TABLES);
  const [orders, setOrders] = useState<CafeOrder[]>(MOCK_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Cross-tab broadcast channel
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel | null>(null);

  // Audio tone generator
  const playAudioCue = useCallback((type: "bell" | "pop" | "success") => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "pop") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "bell") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.7);
      }
    } catch {
      // AudioContext could be blocked by browser autoplay policy
    }
  }, []);

  // Toasts
  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
    const duration = toast.duration || 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Price formatting
  const formatPrice = useCallback(
    (priceInNpr: number): string => {
      if (currencyMode === "USD") {
        const inUsd = priceInNpr * CAFE_CONFIG.currency.usdRate;
        return `$${inUsd.toFixed(2)}`;
      }
      return `Rs. ${priceInNpr.toLocaleString("en-NP")}`;
    },
    [currencyMode]
  );

  // Initialize data from LocalStorage & Firebase listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
      if (savedMenu) setMenuItems(JSON.parse(savedMenu));

      const savedTables = localStorage.getItem(STORAGE_KEYS.TABLES);
      if (savedTables) setTables(JSON.parse(savedTables));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (savedRole === "customer" || savedRole === "staff" || savedRole === "owner") {
        setUserRoleState(savedRole as "customer" | "staff" | "owner");
      }

      const savedTableNum = localStorage.getItem(STORAGE_KEYS.TABLE_NUM);
      if (savedTableNum) setSelectedTableNumberState(Number(savedTableNum));
    } catch (err) {
      console.warn("Could not load localStorage state:", err);
    }

    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel("aura_cafe_realtime_sync");
      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === "SYNC_MENU") setMenuItems(payload);
        if (type === "SYNC_TABLES") setTables(payload);
        if (type === "SYNC_ORDERS") setOrders(payload);
      };
      setBroadcastChannel(channel);

      return () => {
        channel.close();
      };
    }
  }, []);

  // Sync helpers
  const saveMenuState = useCallback(
    (newMenu: MenuItem[]) => {
      setMenuItems(newMenu);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(newMenu));
      }
      broadcastChannel?.postMessage({ type: "SYNC_MENU", payload: newMenu });
    },
    [broadcastChannel]
  );

  const saveTablesState = useCallback(
    (newTables: TableItem[]) => {
      setTables(newTables);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(newTables));
      }
      broadcastChannel?.postMessage({ type: "SYNC_TABLES", payload: newTables });
      firebaseSync.syncTables(newTables);
    },
    [broadcastChannel]
  );

  const saveOrdersState = useCallback(
    (newOrders: CafeOrder[]) => {
      setOrders(newOrders);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));
      }
      broadcastChannel?.postMessage({ type: "SYNC_ORDERS", payload: newOrders });
      firebaseSync.syncOrder(newOrders);
    },
    [broadcastChannel]
  );

  // User Role & Table Select
  const setUserRole = useCallback((role: "customer" | "staff" | "owner") => {
    setUserRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    }
  }, []);

  const setSelectedTableNumber = useCallback((tableNumber: number | null) => {
    setSelectedTableNumberState(tableNumber);
    if (typeof window !== "undefined") {
      if (tableNumber) {
        localStorage.setItem(STORAGE_KEYS.TABLE_NUM, String(tableNumber));
      } else {
        localStorage.removeItem(STORAGE_KEYS.TABLE_NUM);
      }
    }
  }, []);

  // =================== MENU CRUD ===================
  const addMenuItem = useCallback(
    (newItem: Omit<MenuItem, "id" | "rating" | "reviewsCount">) => {
      const id = "dish-" + Date.now();
      const completeItem: MenuItem = {
        ...newItem,
        id,
        rating: 5.0,
        reviewsCount: 1,
      };
      const updated = [completeItem, ...menuItems];
      saveMenuState(updated);
      playAudioCue("success");
      addToast({
        title: "Menu Item Created",
        message: `${newItem.name} has been added to the live digital menu.`,
        type: "success",
      });
    },
    [menuItems, saveMenuState, playAudioCue, addToast]
  );

  const updateMenuItem = useCallback(
    (id: string, updates: Partial<MenuItem>) => {
      const updated = menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item));
      saveMenuState(updated);
      playAudioCue("pop");
      addToast({
        title: "Menu Item Updated",
        message: `Changes saved to live menu.`,
        type: "info",
      });
    },
    [menuItems, saveMenuState, playAudioCue, addToast]
  );

  const deleteMenuItem = useCallback(
    (id: string) => {
      const target = menuItems.find((i) => i.id === id);
      const updated = menuItems.filter((item) => item.id !== id);
      saveMenuState(updated);
      playAudioCue("pop");
      addToast({
        title: "Menu Item Removed",
        message: `${target?.name || "Item"} has been deleted from the menu.`,
        type: "warning",
      });
    },
    [menuItems, saveMenuState, playAudioCue, addToast]
  );

  const toggleItemAvailability = useCallback(
    (id: string) => {
      const updated = menuItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      );
      saveMenuState(updated);
      playAudioCue("pop");
    },
    [menuItems, saveMenuState, playAudioCue]
  );

  // =================== TABLE CRUD ===================
  const addTable = useCallback(
    (tableData: Omit<TableItem, "id">) => {
      const id = Date.now();
      const newTable: TableItem = {
        ...tableData,
        id,
        status: "available",
        position: tableData.position || { x: 50, y: 50, width: 75, height: 75 },
      };
      const updated = [...tables, newTable];
      saveTablesState(updated);
      playAudioCue("success");
      addToast({
        title: "Table Added",
        message: `Table ${tableData.tableNumber} added to floor plan with auto-generated QR code.`,
        type: "success",
      });
    },
    [tables, saveTablesState, playAudioCue, addToast]
  );

  const updateTableConfig = useCallback(
    (tableId: number, updates: Partial<TableItem>) => {
      const updated = tables.map((t) => (t.id === tableId ? { ...t, ...updates } : t));
      saveTablesState(updated);
      playAudioCue("pop");
      addToast({
        title: "Table Updated",
        message: `Configuration for Table updated.`,
        type: "info",
      });
    },
    [tables, saveTablesState, playAudioCue, addToast]
  );

  const deleteTable = useCallback(
    (tableId: number) => {
      const target = tables.find((t) => t.id === tableId);
      const updated = tables.filter((t) => t.id !== tableId);
      saveTablesState(updated);
      playAudioCue("pop");
      addToast({
        title: "Table Removed",
        message: `Table ${target?.tableNumber || ""} deleted from the floor plan.`,
        type: "warning",
      });
    },
    [tables, saveTablesState, playAudioCue, addToast]
  );

  const updateTableStatus = useCallback(
    (tableId: number, status: TableStatus, details?: Partial<TableItem>) => {
      const updated = tables.map((t) => {
        if (t.id === tableId || t.tableNumber === tableId) {
          return {
            ...t,
            status,
            ...details,
            ...(status === "available"
              ? {
                  currentGuestName: undefined,
                  guestCount: undefined,
                  reservedTime: undefined,
                  reservedBy: undefined,
                  reservedPhone: undefined,
                  activeOrderId: undefined,
                  occupiedSince: undefined,
                }
              : {}),
          };
        }
        return t;
      });
      saveTablesState(updated);
      playAudioCue("pop");
    },
    [tables, saveTablesState, playAudioCue]
  );

  const assignGuestToTable = useCallback(
    (tableId: number, guestName: string, guestCount: number) => {
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      updateTableStatus(tableId, "occupied", {
        currentGuestName: guestName,
        guestCount,
        occupiedSince: now,
      });
      addToast({
        title: `Table Assigned`,
        message: `Table seated for ${guestName} (${guestCount} guests)`,
        type: "success",
      });
    },
    [updateTableStatus, addToast]
  );

  const freeTable = useCallback(
    (tableId: number) => {
      updateTableStatus(tableId, "available");
      addToast({
        title: "Table Freed",
        message: "Table is now marked clean and available for new guests.",
        type: "info",
      });
    },
    [updateTableStatus, addToast]
  );

  const reserveTable = useCallback(
    (
      tableNumber: number,
      reservationData: Omit<TableReservation, "id" | "createdAt" | "status">
    ): boolean => {
      const target = tables.find((t) => t.tableNumber === tableNumber);
      if (!target || target.status === "occupied") {
        addToast({
          title: "Reservation Failed",
          message: "Selected table is currently occupied.",
          type: "error",
        });
        return false;
      }

      updateTableStatus(target.id, "reserved", {
        reservedBy: reservationData.guestName,
        reservedPhone: reservationData.guestPhone,
        reservedTime: `${reservationData.date} @ ${reservationData.time}`,
        guestCount: reservationData.guestCount,
      });

      playAudioCue("success");
      addToast({
        title: "Reservation Confirmed! 🎉",
        message: `Table ${tableNumber} has been reserved for ${reservationData.guestName} at ${reservationData.time}.`,
        type: "success",
      });
      return true;
    },
    [tables, updateTableStatus, addToast, playAudioCue]
  );

  const getTableByNumber = useCallback(
    (num: number) => tables.find((t) => t.tableNumber === num),
    [tables]
  );

  // =================== CART ===================
  const addToCart = useCallback(
    (
      item: MenuItem,
      quantity = 1,
      selectedOptions: SelectedCustomOption[] = [],
      notes = ""
    ) => {
      const optionsExtra = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
      const unitPrice = item.price + optionsExtra;
      const optionsKey = selectedOptions
        .map((o) => `${o.groupId}:${o.optionId}`)
        .sort()
        .join("|");
      const cartItemId = `${item.id}_${optionsKey}_${notes.trim()}`;

      setCart((prev) => {
        const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            totalPrice: newQty * unitPrice,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              cartItemId,
              item,
              quantity,
              selectedOptions,
              notes,
              unitPrice,
              totalPrice: unitPrice * quantity,
            },
          ];
        }
      });

      playAudioCue("pop");
      addToast({
        title: `Added to Cart`,
        message: `${quantity}x ${item.name}`,
        type: "success",
      });
    },
    [addToast, playAudioCue]
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
      playAudioCue("pop");
    },
    [playAudioCue]
  );

  const updateCartQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(cartItemId);
        return;
      }
      setCart((prev) =>
        prev.map((item) => {
          if (item.cartItemId === cartItemId) {
            return {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
            };
          }
          return item;
        })
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );
  const cartSubtotal = useMemo(
    () => cart.reduce((total, item) => total + item.totalPrice, 0),
    [cart]
  );
  const cartServiceCharge = useMemo(() => Math.round(cartSubtotal * 0.1), [cartSubtotal]);
  const cartVat = useMemo(
    () => Math.round((cartSubtotal + cartServiceCharge) * 0.13),
    [cartSubtotal, cartServiceCharge]
  );
  const cartGrandTotal = useMemo(
    () => cartSubtotal + cartServiceCharge + cartVat,
    [cartSubtotal, cartServiceCharge, cartVat]
  );

  // =================== ORDERS ===================
  const placeOrder = useCallback(
    (
      tableNumber: number,
      paymentMethod: CafeOrder["paymentMethod"],
      notes = "",
      guestName = "Guest"
    ): CafeOrder => {
      const orderNum = `#${Math.floor(1000 + Math.random() * 9000)}`;
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowIso = new Date().toISOString();

      const newOrder: CafeOrder = {
        id: orderId,
        orderNumber: orderNum,
        tableNumber,
        guestName,
        items: [...cart],
        subtotal: cartSubtotal,
        serviceCharge: cartServiceCharge,
        vat: cartVat,
        grandTotal: cartGrandTotal,
        status: "pending",
        paymentMethod,
        customerNotes: notes,
        createdAt: nowIso,
        estimatedMinutes: 15,
      };

      const nextOrders = [newOrder, ...orders];
      saveOrdersState(nextOrders);

      // Auto-occupy table
      const targetTable = tables.find((t) => t.tableNumber === tableNumber);
      if (targetTable) {
        updateTableStatus(targetTable.id, "occupied", {
          currentGuestName: guestName,
          activeOrderId: orderId,
          occupiedSince: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }

      clearCart();
      setIsCartOpen(false);
      playAudioCue("bell");

      addToast({
        title: `Order ${orderNum} Placed!`,
        message: `Sent to kitchen for Table ${tableNumber}.`,
        type: "success",
        duration: 6000,
      });

      return newOrder;
    },
    [
      cart,
      cartSubtotal,
      cartServiceCharge,
      cartVat,
      cartGrandTotal,
      orders,
      tables,
      saveOrdersState,
      updateTableStatus,
      clearCart,
      playAudioCue,
      addToast,
    ]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      saveOrdersState(updated);
      playAudioCue("pop");

      const target = orders.find((o) => o.id === orderId);
      if (target) {
        addToast({
          title: `Order ${target.orderNumber} Status Updated`,
          message: `Now marked as: ${newStatus.toUpperCase()}`,
          type: "info",
        });

        if (newStatus === "paid") {
          const table = tables.find((t) => t.tableNumber === target.tableNumber);
          if (table) {
            updateTableStatus(table.id, "cleaning");
          }
        }
      }
    },
    [orders, tables, saveOrdersState, updateTableStatus, playAudioCue, addToast]
  );

  const getActiveOrderByTable = useCallback(
    (tableNumber: number) => {
      return orders.find(
        (o) =>
          o.tableNumber === tableNumber &&
          (o.status === "pending" || o.status === "preparing" || o.status === "served")
      );
    },
    [orders]
  );

  // Analytics Metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.grandTotal, 0);
  }, [orders]);

  const totalOrdersCount = useMemo(() => orders.length, [orders]);
  const averageOrderValue = useMemo(() => {
    if (totalOrdersCount === 0) return 0;
    return Math.round(totalRevenue / totalOrdersCount);
  }, [totalRevenue, totalOrdersCount]);

  const resetToDefaults = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.MENU);
      localStorage.removeItem(STORAGE_KEYS.TABLES);
      localStorage.removeItem(STORAGE_KEYS.ORDERS);
      localStorage.removeItem(STORAGE_KEYS.CART);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.TABLE_NUM);
    }
    setMenuItems(MOCK_MENU);
    setTables(MOCK_TABLES);
    setOrders(MOCK_ORDERS);
    setCart([]);
    setUserRoleState("customer");
    setSelectedTableNumberState(null);
    addToast({
      title: "Demo Data Reset",
      message: "Reset menu, tables, and orders to default showcase state.",
      type: "info",
    });
  }, [addToast]);

  return (
    <CafeContext.Provider
      value={{
        userRole,
        setUserRole,
        currencyMode,
        setCurrencyMode,
        formatPrice,
        selectedTableNumber,
        setSelectedTableNumber,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartServiceCharge,
        cartVat,
        cartGrandTotal,
        isCartOpen,
        setIsCartOpen,
        tables,
        addTable,
        updateTableConfig,
        deleteTable,
        updateTableStatus,
        assignGuestToTable,
        freeTable,
        reserveTable,
        getTableByNumber,
        orders,
        placeOrder,
        updateOrderStatus,
        getActiveOrderByTable,
        totalRevenue,
        totalOrdersCount,
        averageOrderValue,
        toasts,
        addToast,
        removeToast,
        playAudioCue,
        resetToDefaults,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error("useCafe must be used within a CafeProvider");
  }
  return context;
};
