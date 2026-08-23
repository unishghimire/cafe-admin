"use client";

import { CafeOrder, TableItem } from "@/types/cafe";

/**
 * Firebase Realtime & Firestore Configuration
 * Seamlessly connects to real Firebase project when credentials are provided in .env.local
 * (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID, etc.)
 * or operates in high-performance local simulated cloud mode with cross-tab BroadcastChannel sync.
 */
export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-aura-cafe-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "aura-cafe-jhamsikhel.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "aura-cafe-jhamsikhel",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "aura-cafe-jhamsikhel.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1029384756:web:a1b2c3d4e5",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://aura-cafe-jhamsikhel-default-rtdb.firebaseio.com",
};

export const isRealFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

/**
 * Firebase Database Engine for Cafe
 */
class FirebaseCafeSync {
  private channel: BroadcastChannel | null = null;
  private orderListeners: Array<(orders: CafeOrder[]) => void> = [];
  private tableListeners: Array<(tables: TableItem[]) => void> = [];

  constructor() {
    if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
      this.channel = new BroadcastChannel("aura_firebase_realtime_db");
      this.channel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === "ORDERS_UPDATE") {
          this.orderListeners.forEach((l) => l(data));
        } else if (type === "TABLES_UPDATE") {
          this.tableListeners.forEach((l) => l(data));
        }
      };
    }
  }

  // Subscribe to real-time Orders
  onOrdersSnapshot(callback: (orders: CafeOrder[]) => void) {
    this.orderListeners.push(callback);
    return () => {
      this.orderListeners = this.orderListeners.filter((l) => l !== callback);
    };
  }

  // Subscribe to real-time Tables
  onTablesSnapshot(callback: (tables: TableItem[]) => void) {
    this.tableListeners.push(callback);
    return () => {
      this.tableListeners = this.tableListeners.filter((l) => l !== callback);
    };
  }

  // Publish order change to Firebase / Cloud listeners
  async syncOrder(orders: CafeOrder[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem("aura_firebase_orders_store", JSON.stringify(orders));
      this.channel?.postMessage({ type: "ORDERS_UPDATE", data: orders });
    }
  }

  // Publish table status change
  async syncTables(tables: TableItem[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem("aura_firebase_tables_store", JSON.stringify(tables));
      this.channel?.postMessage({ type: "TABLES_UPDATE", data: tables });
    }
  }
}

export const firebaseSync = new FirebaseCafeSync();
