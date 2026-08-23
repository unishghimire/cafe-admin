"use client";

import React, { useState } from "react";
import { TableItem, TableSection, TableStatus } from "@/types/cafe";
import { useCafe } from "@/context/AdminContext";
import { TableActionModal } from "@/components/tables/TableActionModal";
import {
  Users,
  LayoutGrid,
  Map,
  Filter,
  Sparkles,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FloorPlan: React.FC = () => {
  const { tables } = useCafe();

  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterSection, setFilterSection] = useState<TableSection | "all">("all");
  const [viewMode, setViewMode] = useState<"floorplan" | "grid">("floorplan");

  const sections: { id: TableSection | "all"; label: string }[] = [
    { id: "all", label: "All Zones (12 Tables)" },
    { id: "indoor_main", label: "Indoor Main Hall" },
    { id: "barista_counter", label: "Barista Counter" },
    { id: "terrace_veranda", label: "Terrace Veranda" },
    { id: "private_lounge", label: "Himalayan Lounge" },
  ];

  const filteredTables =
    filterSection === "all" ? tables : tables.filter((t) => t.section === filterSection);

  const handleTableClick = (table: TableItem) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "available":
        return {
          bg: "bg-emerald-950/80 hover:bg-emerald-900/90",
          border: "border-emerald-500/60 shadow-emerald-950/50",
          text: "text-emerald-300",
          dot: "bg-emerald-400 animate-pulse",
          badge: "bg-emerald-900/80 text-emerald-300 border-emerald-700",
        };
      case "occupied":
        return {
          bg: "bg-rose-950/80 hover:bg-rose-900/90",
          border: "border-rose-500/60 shadow-rose-950/50",
          text: "text-rose-300",
          dot: "bg-rose-400",
          badge: "bg-rose-900/80 text-rose-300 border-rose-700",
        };
      case "reserved":
        return {
          bg: "bg-amber-950/80 hover:bg-amber-900/90",
          border: "border-amber-500/60 shadow-amber-950/50",
          text: "text-amber-300",
          dot: "bg-amber-400",
          badge: "bg-amber-900/80 text-amber-300 border-amber-700",
        };
      case "cleaning":
        return {
          bg: "bg-indigo-950/80 hover:bg-indigo-900/90",
          border: "border-indigo-500/60 shadow-indigo-950/50",
          text: "text-indigo-300",
          dot: "bg-indigo-400",
          badge: "bg-indigo-900/80 text-indigo-300 border-indigo-700",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/60 border border-stone-800 p-4 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setFilterSection(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                filterSection === sec.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                  : "bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        <div className="bg-stone-950 border border-stone-800 p-1 rounded-2xl flex items-center gap-1 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode("floorplan")}
            className={`p-2 rounded-xl transition-all ${
              viewMode === "floorplan"
                ? "bg-stone-800 text-indigo-400"
                : "text-stone-400 hover:text-stone-200"
            }`}
            title="2D Floorplan Layout"
          >
            <Map className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-xl transition-all ${
              viewMode === "grid"
                ? "bg-stone-800 text-indigo-400"
                : "text-stone-400 hover:text-stone-200"
            }`}
            title="Grid Cards Layout"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900/40 border border-stone-800/80 px-5 py-3 rounded-2xl text-xs text-stone-300">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available ({tables.filter((t) => t.status === "available").length})</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Occupied ({tables.filter((t) => t.status === "occupied").length})</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Reserved ({tables.filter((t) => t.status === "reserved").length})</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span>Cleaning ({tables.filter((t) => t.status === "cleaning").length})</span>
          </span>
        </div>
        <span className="text-[11px] text-stone-500">
          Click any table to manage seating or advance orders
        </span>
      </div>

      {/* 1. 2D FLOORPLAN ARCHITECTURAL VIEW */}
      {viewMode === "floorplan" && (
        <div className="relative w-full bg-gradient-to-b from-stone-950 via-stone-900/90 to-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 min-h-[560px] shadow-2xl overflow-hidden">
          {/* Architectural Background Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#6366f1 1px, transparent 1px), radial-gradient(#6366f1 1px, #0c0a09 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Zone Watermark Labels */}
          <div className="absolute top-4 left-6 text-[11px] uppercase tracking-widest font-black text-indigo-400/30">
            North Veranda Terrace
          </div>
          <div className="absolute top-4 right-6 text-[11px] uppercase tracking-widest font-black text-indigo-400/30">
            Himalayan VIP Lounge
          </div>
          <div className="absolute bottom-4 left-6 text-[11px] uppercase tracking-widest font-black text-indigo-400/30">
            Barista Roasting Counter
          </div>
          <div className="absolute bottom-4 right-6 text-[11px] uppercase tracking-widest font-black text-indigo-400/30">
            Main Indoor Seating
          </div>

          {/* Interactive Tables positioned in 2D coordinates */}
          <div className="relative w-full h-[480px]">
            {filteredTables.map((table) => {
              const colors = getStatusColor(table.status);
              return (
                <motion.button
                  key={table.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTableClick(table)}
                  style={{
                    left: `${table.position.x}%`,
                    top: `${table.position.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className={`absolute p-3 rounded-2xl border-2 shadow-xl backdrop-blur-md flex flex-col items-center justify-center transition-all cursor-pointer ${
                    colors.bg
                  } ${colors.border} ${
                    table.shape === "round"
                      ? "rounded-full w-20 h-20"
                      : table.shape === "rect"
                      ? "w-28 h-18 rounded-2xl"
                      : "w-20 h-20 rounded-2xl"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <span className="font-mono font-black text-sm text-stone-100">
                      T{table.tableNumber}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-300 font-medium flex items-center gap-0.5 mt-0.5">
                    <Users className="w-2.5 h-2.5" />
                    {table.capacity}
                  </span>
                  {table.currentGuestName && (
                    <span className="text-[9px] text-amber-300 truncate max-w-[70px] font-bold">
                      {table.currentGuestName}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. GRID CARDS VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map((table) => {
            const colors = getStatusColor(table.status);
            return (
              <motion.div
                key={table.id}
                whileHover={{ y: -3 }}
                onClick={() => handleTableClick(table)}
                className={`bg-stone-900/80 border p-5 rounded-3xl space-y-3 cursor-pointer shadow-lg transition-all ${colors.border}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center font-mono font-black text-sm text-indigo-400">
                      T{table.tableNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-100">{table.label}</h4>
                      <span className="text-[11px] text-stone-400 capitalize">
                        {table.section.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${colors.badge}`}
                  >
                    {table.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-300 pt-2 border-t border-stone-800/80">
                  <span className="flex items-center gap-1 text-stone-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{table.capacity} Person Capacity</span>
                  </span>
                  <span className="font-mono text-[10px] bg-stone-950 px-2 py-0.5 rounded border border-stone-800 uppercase text-stone-400">
                    {table.shape}
                  </span>
                </div>

                {table.currentGuestName && (
                  <div className="bg-stone-950 p-2 rounded-xl text-xs text-amber-300 flex justify-between items-center font-medium">
                    <span>Seated: {table.currentGuestName}</span>
                    <span className="text-stone-400 text-[10px]">{table.occupiedSince}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Table Action Modal */}
      <TableActionModal
        table={selectedTable}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
