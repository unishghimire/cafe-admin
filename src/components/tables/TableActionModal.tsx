"use client";

import React, { useState } from "react";
import { TableItem, TableStatus } from "@/types/cafe";
import { useCafe } from "@/context/AdminContext";
import {
  X,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Coffee,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TableActionModalProps {
  table: TableItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TableActionModal: React.FC<TableActionModalProps> = ({
  table,
  isOpen,
  onClose,
}) => {
  const { updateTableStatus, assignGuestToTable, freeTable, getActiveOrderByTable, formatPrice } =
    useCafe();

  const [staffGuestName, setStaffGuestName] = useState("");
  const [staffGuestCount, setStaffGuestCount] = useState(2);

  if (!table) return null;

  const isAvailable = table.status === "available";
  const isOccupied = table.status === "occupied";
  const isReserved = table.status === "reserved";
  const isCleaning = table.status === "cleaning";

  const activeOrder = getActiveOrderByTable(table.tableNumber);

  const handleStaffSeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffGuestName.trim()) return;
    assignGuestToTable(table.id, staffGuestName.trim(), staffGuestCount);
    setStaffGuestName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-stone-950 border border-indigo-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-stone-100 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 font-extrabold flex items-center justify-center text-sm font-mono">
                  T{table.tableNumber}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-stone-100">{table.label}</h3>
                  <p className="text-xs text-stone-400 capitalize">
                    {table.section.replace("_", " ")} • {table.capacity} Seats
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Order Preview if Occupied */}
            {activeOrder && (
              <div className="bg-stone-900/90 border border-amber-500/30 p-3.5 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>Active Order: {activeOrder.orderNumber}</span>
                  <span className="uppercase text-[10px] bg-stone-950 px-2 py-0.5 rounded border border-amber-500/40">
                    {activeOrder.status}
                  </span>
                </div>
                <div className="space-y-1 text-stone-300">
                  {activeOrder.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span>
                        {i.quantity}x {i.item.name}
                      </span>
                      <span className="font-mono text-stone-400">{formatPrice(i.totalPrice)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-stone-100 pt-1 border-t border-stone-800">
                  <span>Total Due:</span>
                  <span className="text-amber-400">{formatPrice(activeOrder.grandTotal)}</span>
                </div>
              </div>
            )}

            {/* Staff Status Control Buttons */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                Quick Table Status Override:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => updateTableStatus(table.id, "available")}
                  className={`py-2.5 px-3 rounded-xl border font-semibold transition-all ${
                    isAvailable
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/50"
                      : "bg-stone-900 text-stone-400 border-stone-800 hover:text-white"
                  }`}
                >
                  🟢 Mark Available
                </button>
                <button
                  onClick={() => updateTableStatus(table.id, "occupied")}
                  className={`py-2.5 px-3 rounded-xl border font-semibold transition-all ${
                    isOccupied
                      ? "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-950/50"
                      : "bg-stone-900 text-stone-400 border-stone-800 hover:text-white"
                  }`}
                >
                  🔴 Mark Occupied
                </button>
                <button
                  onClick={() => updateTableStatus(table.id, "reserved")}
                  className={`py-2.5 px-3 rounded-xl border font-semibold transition-all ${
                    isReserved
                      ? "bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-950/50"
                      : "bg-stone-900 text-stone-400 border-stone-800 hover:text-white"
                  }`}
                >
                  🟡 Mark Reserved
                </button>
                <button
                  onClick={() => updateTableStatus(table.id, "cleaning")}
                  className={`py-2.5 px-3 rounded-xl border font-semibold transition-all ${
                    isCleaning
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/50"
                      : "bg-stone-900 text-stone-400 border-stone-800 hover:text-white"
                  }`}
                >
                  🟣 Mark Cleaning / Billed
                </button>
              </div>

              {/* Walk-in Seat Form */}
              <form onSubmit={handleStaffSeat} className="bg-stone-900/60 p-4 rounded-2xl space-y-3 text-xs border border-stone-800">
                <span className="font-bold text-stone-200 block">Seat Walk-In Party at Table {table.tableNumber}:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Guest / Party name"
                    value={staffGuestName}
                    onChange={(e) => setStaffGuestName(e.target.value)}
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-indigo-500"
                  />
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={staffGuestCount}
                    onChange={(e) => setStaffGuestCount(Number(e.target.value))}
                    className="w-20 bg-stone-950 border border-stone-800 rounded-xl px-2 py-2 text-stone-100 outline-none text-center font-mono font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-md"
                >
                  Seat Guests Now
                </button>
              </form>

              {/* Free Table */}
              <button
                onClick={() => {
                  freeTable(table.id);
                  onClose();
                }}
                className="w-full bg-stone-900 hover:bg-stone-800 text-rose-400 hover:text-rose-300 py-2.5 rounded-xl text-xs font-semibold border border-stone-800 transition-colors"
              >
                Release Table &amp; Reset to Clean Available
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
