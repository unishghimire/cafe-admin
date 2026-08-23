"use client";

import React from "react";
import { TableItem } from "@/types/cafe";
import { CAFE_CONFIG } from "@/data/cafeConfig";
import { QRCodeSVG } from "qrcode.react";
import { X, Printer, Sparkles, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TableTentModalProps {
  table: TableItem | null;
  isOpen: boolean;
  onClose: () => void;
  qrUrl: string;
}

export const TableTentModal: React.FC<TableTentModalProps> = ({
  table,
  isOpen,
  onClose,
  qrUrl,
}) => {
  if (!table) return null;

  const handlePrint = () => {
    window.print();
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
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-stone-950 border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-stone-100 space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Print Ready Stand
                </span>
                <h3 className="font-extrabold text-lg text-stone-100">
                  Table {table.tableNumber} Tent Card
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Tent Stand Design */}
            <div
              id="printable-tent-card"
              className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/50 rounded-3xl p-6 text-center space-y-5 shadow-2xl relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-widest">
                  <Coffee className="w-4 h-4" />
                  <span>{CAFE_CONFIG.name}</span>
                </div>
                <h2 className="text-xl font-black text-stone-100">
                  Welcome to <span className="gold-gradient-text">Jhamsikhel</span>
                </h2>
              </div>

              <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-amber-500/30">
                <QRCodeSVG
                  value={qrUrl}
                  size={190}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=100&auto=format&fit=crop",
                    x: undefined,
                    y: undefined,
                    height: 38,
                    width: 38,
                    excavate: true,
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="inline-block bg-amber-500 text-stone-950 font-black text-sm px-4 py-1 rounded-full shadow-lg">
                  TABLE {table.tableNumber} • {table.label}
                </div>
                <p className="text-xs text-stone-300 font-medium">
                  Scan with your Phone Camera to Browse Menu &amp; Order Fresh
                </p>
                <div className="text-[11px] text-amber-400/90 font-mono">
                  Guest Wi-Fi: {CAFE_CONFIG.wifi.ssid} • Pass: {CAFE_CONFIG.wifi.passcode}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Table Tent Card</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl text-xs font-medium border border-stone-800"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
