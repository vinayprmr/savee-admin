"use client";

import React, { useState } from "react";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import { CreateVariantPayload } from "../../domain/models";

export const SAREE_PRESET_SIZES: CreateVariantPayload[] = [
  { size: "Free Size", stockQuantity: 15 },
];

export const APPAREL_PRESET_SIZES: CreateVariantPayload[] = [
  { size: "XS", stockQuantity: 5 },
  { size: "S", stockQuantity: 8 },
  { size: "M", stockQuantity: 10 },
  { size: "L", stockQuantity: 8 },
  { size: "XL", stockQuantity: 5 },
  { size: "XXL", stockQuantity: 3 },
];

interface GarmentVariantsSectionProps {
  variants: CreateVariantPayload[];
  onChange: (variants: CreateVariantPayload[]) => void;
}

export function GarmentVariantsSection({
  variants,
  onChange,
}: GarmentVariantsSectionProps) {
  const [customSizeInput, setCustomSizeInput] = useState("");

  const totalCalculatedStock = variants.reduce((acc, v) => acc + v.stockQuantity, 0);

  const handleStockChange = (index: number, val: number) => {
    onChange(
      variants.map((v, i) => (i === index ? { ...v, stockQuantity: Math.max(0, val) } : v))
    );
  };

  const handleAddCustomSize = () => {
    const clean = customSizeInput.trim().toUpperCase();
    if (!clean) return;
    if (variants.some((v) => v.size.toUpperCase() === clean)) {
      alert("This size is already configured.");
      return;
    }
    onChange([...variants, { size: clean, stockQuantity: 10 }]);
    setCustomSizeInput("");
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      alert("At least one sizing variant is required.");
      return;
    }
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Sizing Variants & Initial Stock
          </h3>
        </div>
        <span className="text-xs text-navy-950 font-semibold">
          Total Initial Stock: <strong className="text-gold-600">{totalCalculatedStock} units</strong>
        </span>
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 text-[11px]">Sizing Presets:</span>
        <button
          type="button"
          onClick={() => onChange(SAREE_PRESET_SIZES)}
          className="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          Saree Drape (Free Size)
        </button>
        <button
          type="button"
          onClick={() => onChange(APPAREL_PRESET_SIZES)}
          className="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          Stitched (XS to XXL)
        </button>
      </div>

      {/* Sizing Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {variants.map((v, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2"
          >
            <div>
              <span className="text-xs font-bold text-navy-950">{v.size}</span>
              <span className="block text-[10px] text-slate-400 font-mono">
                variant {idx + 1}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleStockChange(idx, v.stockQuantity - 1)}
                  className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min={0}
                  value={v.stockQuantity}
                  onChange={(e) => handleStockChange(idx, parseInt(e.target.value) || 0)}
                  className="w-10 text-center text-xs py-0.5 font-bold text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleStockChange(idx, v.stockQuantity + 1)}
                  className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Size */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          placeholder="Custom size e.g. 3XL, Plus Size, Custom..."
          value={customSizeInput}
          onChange={(e) => setCustomSizeInput(e.target.value)}
          className="w-60 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
        />
        <button
          type="button"
          onClick={handleAddCustomSize}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          <span>Add Size</span>
        </button>
      </div>
    </div>
  );
}
