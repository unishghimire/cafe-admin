"use client";

import React from "react";
import { useCafe } from "@/context/AdminContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCafe();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isWarning = toast.type === "warning";
          const isError = toast.type === "error";

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl backdrop-blur-xl border flex items-start gap-3 text-sm text-stone-100 ${
                isSuccess
                  ? "bg-stone-900/95 border-emerald-500/50 shadow-emerald-950/40"
                  : isWarning
                  ? "bg-stone-900/95 border-amber-500/50 shadow-amber-950/40"
                  : isError
                  ? "bg-stone-900/95 border-rose-500/50 shadow-rose-950/40"
                  : "bg-stone-900/95 border-stone-700 shadow-stone-950/40"
              }`}
            >
              <div className="mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {isError && <XCircle className="w-5 h-5 text-rose-400" />}
                {toast.type === "info" && <Info className="w-5 h-5 text-sky-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-100">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-stone-200 p-0.5 rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
