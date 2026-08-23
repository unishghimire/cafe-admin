"use client";

import React, { useState, useEffect } from "react";
import { TableItem, TableSection, TableShape } from "@/types/cafe";
import { useCafe } from "@/context/AdminContext";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TableConfigModalProps {
  table: TableItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TableConfigModal: React.FC<TableConfigModalProps> = ({ table, isOpen, onClose }) => {
  const { addTable, updateTableConfig, tables } = useCafe();

  const [tableNumber, setTableNumber] = useState<number>(tables.length + 1);
  const [label, setLabel] = useState("");
  const [capacity, setCapacity] = useState<number>(4);
  const [section, setSection] = useState<TableSection>("indoor_main");
  const [shape, setShape] = useState<TableShape>("square");

  useEffect(() => {
    if (table) {
      setTableNumber(table.tableNumber);
      setLabel(table.label);
      setCapacity(table.capacity);
      setSection(table.section);
      setShape(table.shape);
    } else {
      const nextNum = Math.max(...tables.map((t) => t.tableNumber), 0) + 1;
      setTableNumber(nextNum);
      setLabel(`T-${String(nextNum).padStart(2, "0")} (New Table)`);
      setCapacity(4);
      setSection("indoor_main");
      setShape("square");
    }
  }, [table, isOpen, tables]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    if (table) {
      updateTableConfig(table.id, {
        tableNumber: Number(tableNumber),
        label: label.trim(),
        capacity: Number(capacity),
        section,
        shape,
      });
    } else {
      addTable({
        tableNumber: Number(tableNumber),
        label: label.trim(),
        capacity: Number(capacity),
        section,
        shape,
        status: "available",
        position: { x: 45, y: 45, width: 75, height: 75 },
      });
    }

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
            className="relative w-full max-w-md bg-stone-950 border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-stone-100 space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {table ? "Edit Table" : "Configure Table"}
                </span>
                <h3 className="font-extrabold text-lg text-stone-100">
                  {table ? `Table ${table.tableNumber}` : "New Table Setup"}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Table Number *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50}
                    value={tableNumber}
                    onChange={(e) => setTableNumber(Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Seating Capacity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={16}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Table Label / Identifier *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T-13 (Garden Gazebo)"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Dining Section *</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value as TableSection)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="indoor_main">Main Indoor Hall</option>
                    <option value="barista_counter">Barista Counter</option>
                    <option value="terrace_veranda">Terrace Veranda</option>
                    <option value="private_lounge">Himalayan VIP Lounge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Visual Shape *</label>
                  <select
                    value={shape}
                    onChange={(e) => setShape(e.target.value as TableShape)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="square">Square</option>
                    <option value="rect">Rectangle</option>
                    <option value="round">Round</option>
                    <option value="booth">VIP Booth</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{table ? "Save Configuration" : "Add Table & Generate QR"}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl text-xs font-medium border border-stone-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
