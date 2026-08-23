import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CafeProvider } from "@/context/AdminContext";
import { ToastContainer } from "@/components/ui/ToastContainer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AURA Cafe | Executive Admin & Staff Portal",
  description:
    "Internal Operations & Owner Administration System for AURA Artisanal Roastery & Kitchen, Jhamsikhel, Lalitpur.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0c0a09",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="bg-stone-950 text-stone-100 font-sans antialiased selection:bg-amber-500 selection:text-stone-950 min-h-screen flex flex-col">
        <CafeProvider>
          {children}
          <ToastContainer />
        </CafeProvider>
      </body>
    </html>
  );
}
