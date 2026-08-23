"use client";

import React, { useState, useEffect } from "react";
import { MenuItem, MenuCategory } from "@/types/cafe";
import { useCafe } from "@/context/AdminContext";
import { X, Sparkles, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: "Pour Over Coffee", url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop" },
  { label: "Espresso Latte", url: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop" },
  { label: "Iced Cold Brew", url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop" },
  { label: "Sourdough Toast", url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop" },
  { label: "Tomato Soup", url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop" },
  { label: "Truffle Risotto", url: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=800&auto=format&fit=crop" },
  { label: "Caramel Custard", url: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?q=80&w=800&auto=format&fit=crop" },
  { label: "Tiramisu Dessert", url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop" },
];

export const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, isOpen, onClose }) => {
  const { addMenuItem, updateMenuItem } = useCafe();

  const [name, setName] = useState("");
  const [nepaliName, setNepaliName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(450);
  const [category, setCategory] = useState<MenuCategory>("hot_beverages");
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [isVeg, setIsVeg] = useState(true);
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [prepTime, setPrepTime] = useState<number>(8);
  const [calories, setCalories] = useState<number>(250);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setNepaliName(item.nepaliName || "");
      setDescription(item.description);
      setPrice(item.price);
      setCategory(item.category);
      setImage(item.image);
      setIsVeg(item.isVeg);
      setIsChefSpecial(Boolean(item.isChefSpecial));
      setIsGlutenFree(Boolean(item.isGlutenFree));
      setPrepTime(item.preparationTimeMinutes);
      setCalories(item.calories || 250);
    } else {
      setName("");
      setNepaliName("");
      setDescription("");
      setPrice(450);
      setCategory("hot_beverages");
      setImage(PRESET_IMAGES[0].url);
      setIsVeg(true);
      setIsChefSpecial(false);
      setIsGlutenFree(false);
      setPrepTime(8);
      setCalories(250);
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (item) {
      updateMenuItem(item.id, {
        name: name.trim(),
        nepaliName: nepaliName.trim() || undefined,
        description: description.trim(),
        price: Number(price),
        category,
        image,
        isVeg,
        isChefSpecial,
        isGlutenFree,
        preparationTimeMinutes: Number(prepTime),
        calories: Number(calories),
      });
    } else {
      addMenuItem({
        name: name.trim(),
        nepaliName: nepaliName.trim() || undefined,
        description: description.trim(),
        price: Number(price),
        category,
        image,
        isVeg,
        isChefSpecial,
        isGlutenFree,
        preparationTimeMinutes: Number(prepTime),
        calories: Number(calories),
        available: true,
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
            className="relative w-full max-w-xl bg-stone-950 border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-stone-100 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {item ? "Edit Dish" : "Create New Dish"}
                </span>
                <h3 className="font-extrabold text-lg text-stone-100">
                  {item ? item.name : "Add Culinary Item"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Item Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spiced Tomato Concasse"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Nepali Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. टोमाटो कोन्कासे सूप"
                    value={nepaliName}
                    onChange={(e) => setNepaliName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MenuCategory)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="hot_beverages">Hot Brews &amp; Espresso</option>
                    <option value="cold_brews">Cold Brews &amp; Iced</option>
                    <option value="breakfast">Breakfast &amp; Sourdough</option>
                    <option value="soups_salads">Soups &amp; Salads</option>
                    <option value="main_course">Main Courses</option>
                    <option value="desserts">Decadent Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Price in NPR (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    step={10}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Artisanal ingredients, provenance notes, and flavors..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none focus:border-amber-500 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Dish Image URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-[11px] font-mono mb-2"
                />
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border transition-all ${
                        image === preset.url ? "border-amber-500 scale-105" : "border-stone-800 opacity-60"
                      }`}
                    >
                      <Image src={preset.url} alt={preset.label} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVeg(!isVeg)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                    isVeg ? "bg-emerald-950/80 border-emerald-500 text-emerald-300" : "bg-stone-900 border-stone-800 text-stone-400"
                  }`}
                >
                  <span>Vegetarian</span>
                  {isVeg && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsChefSpecial(!isChefSpecial)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                    isChefSpecial ? "bg-amber-950/80 border-amber-500 text-amber-300" : "bg-stone-900 border-stone-800 text-stone-400"
                  }`}
                >
                  <span>Chef's Choice</span>
                  {isChefSpecial && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsGlutenFree(!isGlutenFree)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                    isGlutenFree ? "bg-sky-950/80 border-sky-500 text-sky-300" : "bg-stone-900 border-stone-800 text-stone-400"
                  }`}
                >
                  <span>Gluten-Free</span>
                  {isGlutenFree && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              </div>

              <div className="pt-4 border-t border-stone-800 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{item ? "Save Changes" : "Publish to Live Menu"}</span>
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
