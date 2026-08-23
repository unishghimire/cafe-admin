"use client";

import React, { useState } from "react";
import { useCafe } from "@/context/AdminContext";
import { MenuItem, TableItem } from "@/types/cafe";
import { MenuItemModal } from "@/components/owner/MenuItemModal";
import { TableConfigModal } from "@/components/owner/TableConfigModal";
import { TableQRCard } from "@/components/qr/TableQRCard";
import { verifyOwnerPin } from "@/lib/security";
import {
  Crown,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Utensils,
  LayoutGrid,
  QrCode,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Lock,
  RefreshCw,
  Search,
  Users,
  Printer,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function OwnerAdminPage() {
  const {
    menuItems,
    deleteMenuItem,
    toggleItemAvailability,
    tables,
    deleteTable,
    orders,
    totalRevenue,
    totalOrdersCount,
    averageOrderValue,
    formatPrice,
    resetToDefaults,
    addToast,
  } = useCafe();

  // Security Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ownerPin, setOwnerPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Active Tab: 'analytics' | 'menu' | 'tables' | 'qr'
  const [activeTab, setActiveTab] = useState<"analytics" | "menu" | "tables" | "qr">("analytics");

  // Modals state
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  // Menu Search inside Owner Table
  const [menuSearch, setMenuSearch] = useState("");

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOwnerPin(ownerPin)) {
      setIsAuthenticated(true);
      setPinError(false);
      addToast({
        title: "Owner Authenticated",
        message: "Welcome to AURA Executive Management Suite.",
        type: "success",
      });
    } else {
      setPinError(true);
      addToast({
        title: "Invalid Master PIN",
        message: "Please enter default demo PIN (9900).",
        type: "error",
      });
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    addToast({
      title: "Owner Master Access Granted",
      message: "Full administrative CRUD and QR Generator privileges enabled.",
      type: "success",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-stone-950">
        <div className="max-w-md w-full bg-stone-900/90 border border-amber-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <Crown className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400">
              Restricted Executive Authority
            </span>
            <h2 className="text-2xl font-black text-stone-100">Owner Management Portal</h2>
            <p className="text-xs text-stone-400">
              Enter Owner Master PIN to manage menu CRUD, table configurations, and view table QR stands.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="password"
                maxLength={4}
                required
                placeholder="Enter 4-Digit Owner PIN"
                value={ownerPin}
                onChange={(e) => setOwnerPin(e.target.value)}
                className={`w-full bg-stone-950 border ${
                  pinError ? "border-rose-500" : "border-stone-700"
                } rounded-xl pl-10 pr-4 py-3 text-stone-100 outline-none focus:border-amber-500 text-center font-mono text-lg tracking-widest`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-extrabold py-3 px-4 rounded-xl text-sm shadow-xl transition-all"
            >
              Unlock Master Suite
            </button>
          </form>

          <button
            type="button"
            onClick={handleQuickUnlock}
            className="w-full bg-stone-950 hover:bg-stone-800 border border-amber-500/30 text-amber-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Quick Unlock (PIN: 9900)</span>
          </button>
        </div>
      </div>
    );
  }

  const filteredMenuItems = menuItems.filter((item) => {
    if (!menuSearch.trim()) return true;
    const q = menuSearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.nepaliName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Portal Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-stone-900/60 border border-amber-900/40 p-6 rounded-3xl backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="text-stone-400 hover:text-amber-400 text-xs font-semibold flex items-center gap-1 transition-colors mr-2"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Portals Hub
              </Link>
              <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/40 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" /> Owner Master Suite
              </span>
            </div>
            <h1 className="text-3xl font-black text-stone-100">
              Executive <span className="gold-gradient-text">Administration Portal</span>
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Complete restaurant management: Menu CRUD, Table floor plan layout, live sales metrics &amp; QR Stand generator.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={resetToDefaults}
              className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title="Reset Demo Data to Original"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/staff"
              className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Switch to Staff KDS</span>
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3 overflow-x-auto">
          {[
            { id: "analytics", label: "Financial Analytics & Overview", icon: TrendingUp },
            { id: "menu", label: `Menu Management (${menuItems.length})`, icon: Utensils },
            { id: "tables", label: `Table Configuration (${tables.length})`, icon: LayoutGrid },
            { id: "qr", label: "Exclusive QR Stand Hub", icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "analytics" | "menu" | "tables" | "qr")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isCurrent
                    ? "bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-900/30"
                    : "bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. FINANCIAL ANALYTICS & OVERVIEW TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-stone-900/80 border border-amber-900/40 p-5 rounded-3xl space-y-2">
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" /> Total Gross Sales
                </span>
                <p className="text-2xl font-black text-stone-100">{formatPrice(totalRevenue)}</p>
                <span className="text-[11px] text-emerald-400 font-medium">+18.4% vs last week</span>
              </div>

              <div className="bg-stone-900/80 border border-stone-800 p-5 rounded-3xl space-y-2">
                <span className="text-xs text-sky-400 font-semibold flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" /> Total Orders Placed
                </span>
                <p className="text-2xl font-black text-stone-100">{totalOrdersCount} Tickets</p>
                <span className="text-[11px] text-stone-400">QR &amp; Dine-in combined</span>
              </div>

              <div className="bg-stone-900/80 border border-stone-800 p-5 rounded-3xl space-y-2">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Average Order Value
                </span>
                <p className="text-2xl font-black text-stone-100">{formatPrice(averageOrderValue)}</p>
                <span className="text-[11px] text-stone-400">Across all active tables</span>
              </div>

              <div className="bg-stone-900/80 border border-stone-800 p-5 rounded-3xl space-y-2">
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4" /> Active Tables Capacity
                </span>
                <p className="text-2xl font-black text-stone-100">
                  {tables.filter((t) => t.status === "occupied").length} / {tables.length} Occupied
                </p>
                <span className="text-[11px] text-stone-400">
                  {Math.round((tables.filter((t) => t.status === "occupied").length / tables.length) * 100)}% Current Utilization
                </span>
              </div>
            </div>

            {/* Recent Orders Ticket Log */}
            <div className="bg-stone-900/60 border border-stone-800 p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-base text-stone-100 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Live Transaction Log</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-400 font-semibold uppercase text-[10px]">
                      <th className="pb-3">Ticket</th>
                      <th className="pb-3">Table</th>
                      <th className="pb-3">Guest</th>
                      <th className="pb-3">Items Summary</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Grand Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-800/40">
                        <td className="py-3 font-mono font-bold text-amber-400">{o.orderNumber}</td>
                        <td className="py-3 font-semibold">Table {o.tableNumber}</td>
                        <td className="py-3">{o.guestName || "Walk-in"}</td>
                        <td className="py-3 max-w-xs truncate text-stone-400">
                          {o.items.map((i) => `${i.quantity}x ${i.item.name}`).join(", ")}
                        </td>
                        <td className="py-3">{o.paymentMethod}</td>
                        <td className="py-3">
                          <span className="text-[10px] bg-stone-950 px-2 py-0.5 rounded border border-stone-800 uppercase font-bold text-amber-400">
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-stone-100">
                          {formatPrice(o.grandTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. MENU MANAGEMENT CRUD TAB */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter dishes, drinks, or category..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-100 outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setSelectedMenuItem(null);
                  setIsMenuModalOpen(true);
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-transform active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Culinary Dish</span>
              </button>
            </div>

            <div className="bg-stone-900/60 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950/80 border-b border-stone-800 text-stone-400 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Dish</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Dietary Tags</th>
                      <th className="p-4">In Stock / 86</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-800 shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-stone-100 block">{item.name}</span>
                            {item.nepaliName && (
                              <span className="text-[11px] text-amber-400/80">{item.nepaliName}</span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 capitalize text-stone-400">
                          {item.category.replace("_", " ")}
                        </td>

                        <td className="p-4 font-bold font-mono text-amber-400">
                          {formatPrice(item.price)}
                        </td>

                        <td className="p-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {item.isVeg && (
                              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                Veg
                              </span>
                            )}
                            {item.isChefSpecial && (
                              <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                Signature
                              </span>
                            )}
                            {item.isGlutenFree && (
                              <span className="bg-sky-950 text-sky-300 border border-sky-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                GF
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => toggleItemAvailability(item.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-1.5 ${
                              item.available
                                ? "bg-emerald-950/80 text-emerald-300 border-emerald-700"
                                : "bg-rose-950/80 text-rose-300 border-rose-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.available ? "bg-emerald-400" : "bg-rose-400"
                              }`}
                            />
                            <span>{item.available ? "Available" : "86'd (Sold Out)"}</span>
                          </button>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedMenuItem(item);
                                setIsMenuModalOpen(true);
                              }}
                              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
                              title="Edit Item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${item.name}" from the menu?`)) {
                                  deleteMenuItem(item.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-stone-950 hover:bg-rose-950 text-stone-400 hover:text-rose-400 border border-stone-800 transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. TABLE CONFIGURATION CRUD TAB */}
        {activeTab === "tables" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-stone-100">Restaurant Floor Seating</h3>
                <p className="text-xs text-stone-400">
                  Add, edit capacity, and configure dining zones. QR codes are automatically generated.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedTable(null);
                  setIsTableModalOpen(true);
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Table</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tables.map((tbl) => (
                <div
                  key={tbl.id}
                  className="bg-stone-900/70 border border-stone-800 p-5 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-base flex items-center justify-center">
                        T{tbl.tableNumber}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-stone-100">{tbl.label}</h4>
                        <span className="text-[11px] text-stone-400 capitalize">
                          {tbl.section.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-stone-300 font-mono">
                      {tbl.shape}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-300 pt-2 border-t border-stone-800/80">
                    <span className="flex items-center gap-1 text-stone-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>{tbl.capacity} Person Capacity</span>
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        tbl.status === "available"
                          ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                          : "bg-rose-950 text-rose-400 border-rose-800"
                      }`}
                    >
                      {tbl.status}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedTable(tbl);
                        setIsTableModalOpen(true);
                      }}
                      className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Table</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove Table ${tbl.tableNumber} from the floor plan?`)) {
                          deleteTable(tbl.id);
                        }
                      }}
                      className="p-2 bg-stone-950 hover:bg-rose-950 text-stone-400 hover:text-rose-400 rounded-xl border border-stone-800 transition-colors"
                      title="Delete Table"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. EXCLUSIVE QR GENERATOR & PRINT HUB TAB (OWNER ONLY) */}
        {activeTab === "qr" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Owner Restricted Access</span>
                </div>
                <h3 className="font-extrabold text-lg text-stone-100">Live QR Stand Generator &amp; Print Hub</h3>
                <p className="text-xs text-stone-400">
                  Pre-configured, tamper-resistant QR codes linked to each table. Print stands for physical restaurant placement.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-lg shadow-amber-950/40"
              >
                <Printer className="w-4 h-4" />
                <span>Print All Stands</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tables.map((tbl) => (
                <TableQRCard key={tbl.id} table={tbl} customerBaseUrl="http://localhost:3000" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Menu Item Create/Edit Modal */}
      <MenuItemModal
        item={selectedMenuItem}
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
      />

      {/* Table Create/Edit Modal */}
      <TableConfigModal
        table={selectedTable}
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />
    </div>
  );
}
