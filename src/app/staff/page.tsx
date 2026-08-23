"use client";

import React, { useState } from "react";
import { useCafe } from "@/context/AdminContext";
import { CafeOrder, OrderStatus } from "@/types/cafe";
import { FloorPlan } from "@/components/tables/FloorPlan";
import { verifyStaffPin } from "@/lib/security";
import {
  ChefHat,
  LayoutGrid,
  Clock,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  DollarSign,
  ShieldCheck,
  ChevronLeft,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function StaffPortalPage() {
  const { orders, updateOrderStatus, formatPrice, resetToDefaults, addToast } = useCafe();

  // Security Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staffPin, setStaffPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const [staffTab, setStaffTab] = useState<"kds" | "seating">("kds");

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyStaffPin(staffPin)) {
      setIsAuthenticated(true);
      setPinError(false);
      addToast({
        title: "Staff Authenticated",
        message: "Logged into Kitchen Display System.",
        type: "success",
      });
    } else {
      setPinError(true);
      addToast({
        title: "Invalid Staff PIN",
        message: "Please enter default PIN (7788).",
        type: "error",
      });
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    addToast({
      title: "Staff Access Granted",
      message: "Kitchen display and floor plan controls unlocked.",
      type: "success",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-stone-950">
        <div className="max-w-md w-full bg-stone-900/90 border border-indigo-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 mx-auto flex items-center justify-center shadow-lg">
            <ChefHat className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-indigo-400">
              Operational Kitchen &amp; Floor
            </span>
            <h2 className="text-2xl font-black text-stone-100">Staff Portal Login</h2>
            <p className="text-xs text-stone-400">
              Enter Staff Passcode to manage live order prep tickets and guest seating.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="password"
                maxLength={4}
                required
                placeholder="Enter 4-Digit Staff PIN"
                value={staffPin}
                onChange={(e) => setStaffPin(e.target.value)}
                className={`w-full bg-stone-950 border ${
                  pinError ? "border-rose-500" : "border-stone-700"
                } rounded-xl pl-10 pr-4 py-3 text-stone-100 outline-none focus:border-indigo-500 text-center font-mono text-lg tracking-widest`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-xl transition-all"
            >
              Verify Staff PIN
            </button>
          </form>

          <button
            type="button"
            onClick={handleQuickUnlock}
            className="w-full bg-stone-950 hover:bg-stone-800 border border-indigo-500/30 text-indigo-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Quick Unlock (PIN: 7788)</span>
          </button>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const servedOrders = orders.filter((o) => o.status === "served");
  const completedOrders = orders.filter((o) => o.status === "paid" || o.status === "cancelled");

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-950 text-amber-400 border-amber-800";
      case "preparing":
        return "bg-sky-950 text-sky-400 border-sky-800 animate-pulse";
      case "served":
        return "bg-emerald-950 text-emerald-400 border-emerald-800";
      case "paid":
        return "bg-stone-900 text-stone-400 border-stone-800";
      case "cancelled":
        return "bg-rose-950 text-rose-400 border-rose-800";
    }
  };

  const renderOrderCard = (order: CafeOrder) => (
    <motion.div
      key={order.id}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-4 space-y-3 shadow-xl flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-amber-400">
              {order.orderNumber}
            </span>
            <span className="bg-stone-950 px-2 py-0.5 rounded-md border border-stone-800 text-xs font-bold text-stone-100">
              Table {order.tableNumber}
            </span>
          </div>

          <span
            className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${getStatusBadge(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
          <span>{order.guestName || "Guest"}</span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-stone-500" />
            {new Date(order.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-1.5 py-2 border-y border-stone-800/80">
        {order.items.map((item, idx) => (
          <div key={idx} className="text-xs">
            <div className="flex items-center justify-between text-stone-200 font-medium">
              <span>
                <strong className="text-amber-400">{item.quantity}x</strong> {item.item.name}
              </span>
              <span className="font-mono text-stone-400">{formatPrice(item.totalPrice)}</span>
            </div>
            {item.selectedOptions && item.selectedOptions.length > 0 && (
              <p className="text-[10px] text-amber-300/80 pl-4">
                ↳ {item.selectedOptions.map((o) => o.optionName).join(", ")}
              </p>
            )}
            {item.notes && (
              <p className="text-[10px] text-stone-400 italic pl-4">Note: {item.notes}</p>
            )}
          </div>
        ))}
      </div>

      {/* Customer Notes */}
      {order.customerNotes && (
        <div className="bg-stone-950 p-2 rounded-lg border border-stone-800/80 text-[11px] text-amber-300/90 italic">
          "{order.customerNotes}"
        </div>
      )}

      {/* Total & Action */}
      <div className="flex items-center justify-between text-xs font-bold pt-1">
        <span className="text-[10px] bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-stone-400">
          {order.paymentMethod}
        </span>
        <span className="text-amber-400 text-sm font-extrabold">
          {formatPrice(order.grandTotal)}
        </span>
      </div>

      <div className="pt-2 border-t border-stone-800">
        {order.status === "pending" && (
          <button
            onClick={() => updateOrderStatus(order.id, "preparing")}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Send to Kitchen (Start Prep)</span>
          </button>
        )}

        {order.status === "preparing" && (
          <button
            onClick={() => updateOrderStatus(order.id, "served")}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Dishes as Served</span>
          </button>
        )}

        {order.status === "served" && (
          <button
            onClick={() => updateOrderStatus(order.id, "paid")}
            className="w-full bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-amber-500/30 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Settle Bill &amp; Clean Table</span>
          </button>
        )}

        {order.status === "paid" && (
          <span className="block text-center text-[11px] text-stone-500 py-1">
            ✓ Order Completed &amp; Settled
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 border border-indigo-900/40 p-6 rounded-3xl backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="text-stone-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-colors mr-2"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Portals Hub
              </Link>
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Staff Operations Portal
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-100">
              Kitchen Display &amp; <span className="gold-gradient-text">Floor Management</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefaults}
              className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title="Reset Orders"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/owner"
              className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Owner Admin Suite</span>
            </Link>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <button
            onClick={() => setStaffTab("kds")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              staffTab === "kds"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/50"
                : "bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200"
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen Display System ({pendingOrders.length + preparingOrders.length} Active)</span>
          </button>

          <button
            onClick={() => setStaffTab("seating")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              staffTab === "seating"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/50"
                : "bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Seating &amp; Floor Plan</span>
          </button>
        </div>

        {/* TAB 1: KITCHEN DISPLAY SYSTEM KANBAN */}
        {staffTab === "kds" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {/* Column 1: New / Pending */}
            <div className="bg-stone-900/40 border border-amber-900/30 rounded-3xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <h3 className="font-bold text-sm text-stone-100">New Incoming</h3>
                </div>
                <span className="bg-amber-950 text-amber-400 font-bold text-xs px-2 py-0.5 rounded-full border border-amber-800 font-mono">
                  {pendingOrders.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[200px]">
                <AnimatePresence>
                  {pendingOrders.map((order) => renderOrderCard(order))}
                </AnimatePresence>
                {pendingOrders.length === 0 && (
                  <div className="text-center py-10 text-stone-500 text-xs italic">
                    No new orders waiting
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: In Kitchen / Preparing */}
            <div className="bg-stone-900/40 border border-sky-900/30 rounded-3xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <h3 className="font-bold text-sm text-stone-100">Preparing in Kitchen</h3>
                </div>
                <span className="bg-sky-950 text-sky-400 font-bold text-xs px-2 py-0.5 rounded-full border border-sky-800 font-mono">
                  {preparingOrders.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[200px]">
                <AnimatePresence>
                  {preparingOrders.map((order) => renderOrderCard(order))}
                </AnimatePresence>
                {preparingOrders.length === 0 && (
                  <div className="text-center py-10 text-stone-500 text-xs italic">
                    No orders in prep
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Served on Table */}
            <div className="bg-stone-900/40 border border-emerald-900/30 rounded-3xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <h3 className="font-bold text-sm text-stone-100">Served &amp; Dining</h3>
                </div>
                <span className="bg-emerald-950 text-emerald-400 font-bold text-xs px-2 py-0.5 rounded-full border border-emerald-800 font-mono">
                  {servedOrders.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[200px]">
                <AnimatePresence>
                  {servedOrders.map((order) => renderOrderCard(order))}
                </AnimatePresence>
                {servedOrders.length === 0 && (
                  <div className="text-center py-10 text-stone-500 text-xs italic">
                    No served orders
                  </div>
                )}
              </div>
            </div>

            {/* Column 4: Paid / Settled */}
            <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-500" />
                  <h3 className="font-bold text-sm text-stone-100">Completed &amp; Settled</h3>
                </div>
                <span className="bg-stone-900 text-stone-400 font-bold text-xs px-2 py-0.5 rounded-full border border-stone-800 font-mono">
                  {completedOrders.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[200px]">
                <AnimatePresence>
                  {completedOrders.map((order) => renderOrderCard(order))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEATING & FLOOR PLAN */}
        {staffTab === "seating" && (
          <div className="space-y-6">
            <FloorPlan />
          </div>
        )}
      </div>
    </div>
  );
}
