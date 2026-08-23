"use client";

import React from "react";
import Link from "next/link";
import {
  Crown,
  ChefHat,
  ShieldCheck,
  Coffee,
  Sparkles,
  QrCode,
  Utensils,
  LayoutGrid,
  TrendingUp,
  ArrowRight,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPortalHub() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-900/30">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              <Coffee className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-stone-100">AURA</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/40 uppercase font-bold">
                Operations
              </span>
            </div>
            <p className="text-xs text-stone-400">Jhamsikhel • Lalitpur Operations System</p>
          </div>
        </div>

        <span className="text-xs text-stone-400 font-mono bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 hidden sm:inline-block">
          Internal Systems Only
        </span>
      </header>

      {/* Main Selection Cards */}
      <main className="max-w-5xl w-full mx-auto my-auto py-12 space-y-10 z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-indigo-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Personnel Access</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-100">
            AURA Cafe <span className="gold-gradient-text">Management Portals</span>
          </h1>
          <p className="text-sm text-stone-400 max-w-xl mx-auto">
            Select your operational role to access kitchen order fulfillment or executive menu and
            table layout controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Owner Master Suite */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-gradient-to-b from-stone-900/90 via-stone-950 to-stone-900 border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl p-8 space-y-6 shadow-2xl flex flex-col justify-between relative group transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg">
                  <Crown className="w-7 h-7" />
                </div>
                <span className="bg-amber-500/20 text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-amber-500/40">
                  PIN: 9900
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-100 group-hover:text-amber-400 transition-colors">
                  Owner Executive Suite
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Full administrative authority over menu pricing, floor seating, and QR stands.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-stone-300">
                <div className="flex items-center gap-2 text-amber-300">
                  <QrCode className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Exclusive QR Stand Hub</strong> (Generate &amp; Print Table Stands)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Menu Management (CRUD)</strong> — Add, edit prices, 86 stock
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Table Configuration (CRUD)</strong> — Seats, zones, shapes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Financial Analytics</strong> — Gross sales &amp; order log
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/owner"
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-black py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 transition-all"
            >
              <span>Launch Owner Suite</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Card 2: Staff Operational Portal */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-gradient-to-b from-stone-900/90 via-stone-950 to-stone-900 border-2 border-indigo-500/40 hover:border-indigo-400 rounded-3xl p-8 space-y-6 shadow-2xl flex flex-col justify-between relative group transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-lg">
                  <ChefHat className="w-7 h-7" />
                </div>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-indigo-500/40">
                  PIN: 7788
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-100 group-hover:text-indigo-400 transition-colors">
                  Staff Operational Portal
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Kitchen Display System (KDS) &amp; floor plan table seating manager.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    <strong>Live Kitchen KDS Kanban</strong> — Advance ticket prep stages
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    <strong>Floor Plan Seating</strong> — Seat walk-ins &amp; clear tables
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    <strong>Order Status Overrides</strong> — Mark served &amp; settle bills
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/staff"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/50 transition-all"
            >
              <span>Launch Staff KDS &amp; Floor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-stone-500 font-mono py-4 border-t border-stone-900 z-10">
        AURA Roastery &amp; Kitchen Management System • Jhamsikhel, Lalitpur
      </footer>
    </div>
  );
}
