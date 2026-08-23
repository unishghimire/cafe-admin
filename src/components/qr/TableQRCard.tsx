"use client";

import React, { useState } from "react";
import { TableItem } from "@/types/cafe";
import { useCafe } from "@/context/AdminContext";
import { QRCodeSVG } from "qrcode.react";
import { generateTableQRToken } from "@/lib/security";
import { TableTentModal } from "@/components/qr/TableTentModal";
import {
  QrCode,
  Printer,
  Copy,
  ExternalLink,
  Users,
  Sparkles,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

interface TableQRCardProps {
  table: TableItem;
  customerBaseUrl?: string;
}

export const TableQRCard: React.FC<TableQRCardProps> = ({
  table,
  customerBaseUrl,
}) => {
  const { addToast } = useCafe();
  const [copied, setCopied] = useState(false);
  const [isTentModalOpen, setIsTentModalOpen] = useState(false);

  // Dynamic Base URL resolving: User Prop -> Env Variable -> Fallback
  const activeBaseUrl =
    customerBaseUrl ||
    process.env.NEXT_PUBLIC_CUSTOMER_URL ||
    "http://localhost:3000";

  // Generate verified token for security
  const qrToken = generateTableQRToken(table.tableNumber);
  const targetUrl = `${activeBaseUrl}/menu?table=${table.tableNumber}&token=${qrToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    addToast({
      title: "Menu Link Copied",
      message: `Direct ordering URL for Table ${table.tableNumber} copied.`,
      type: "success",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-stone-900/80 border border-amber-900/30 hover:border-amber-500/50 rounded-3xl p-5 flex flex-col items-center justify-between text-center space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden group transition-all"
      >
        {/* Card Header */}
        <div className="w-full flex items-center justify-between">
          <span className="bg-amber-500/20 text-amber-400 text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30">
            Table {table.tableNumber}
          </span>
          <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
            <Users className="w-3 h-3 text-stone-500" />
            {table.capacity} Seats
          </span>
        </div>

        {/* QR Code Canvas */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xl border border-amber-500/20 group-hover:scale-105 transition-transform">
          <QRCodeSVG
            value={targetUrl}
            size={135}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=60&auto=format&fit=crop",
              x: undefined,
              y: undefined,
              height: 26,
              width: 26,
              excavate: true,
            }}
          />
        </div>

        {/* Table Details */}
        <div className="space-y-0.5">
          <h4 className="font-bold text-sm text-stone-100">{table.label}</h4>
          <p className="text-[11px] text-stone-400 capitalize">
            {table.section.replace("_", " ")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-stone-800/80 text-xs">
          <button
            onClick={() => setIsTentModalOpen(true)}
            className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold py-2 px-3 rounded-xl border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Stand</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 py-2 px-3 rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy URL"}</span>
          </button>
        </div>
      </motion.div>

      {/* Printable Stand Preview Modal */}
      <TableTentModal
        table={table}
        isOpen={isTentModalOpen}
        onClose={() => setIsTentModalOpen(false)}
        qrUrl={targetUrl}
      />
    </>
  );
};
