"use client";

import React from "react";
import { Tag, Sparkles } from "lucide-react";
import { AdminCategoryItem } from "../../domain/models";
import { formatINR } from "../../lib/utils";

interface GarmentPricingSectionProps {
  price: number;
  originalPrice: number;
  customSku: string;
  onPriceChange: (val: number) => void;
  onOriginalPriceChange: (val: number) => void;
  onSkuChange: (val: string) => void;
  categoryId?: string;
  categories: AdminCategoryItem[];
  error?: string | null;
  onClearSkuError?: () => void;
}

export function GarmentPricingSection({
  price,
  originalPrice,
  customSku,
  onPriceChange,
  onOriginalPriceChange,
  onSkuChange,
  categoryId,
  categories,
  error,
  onClearSkuError,
}: GarmentPricingSectionProps) {
  const calculatedDiscount =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAutoGenerateSku = () => {
    const selectedCat = categories.find((c) => c.id === categoryId);
    const catCode = selectedCat?.slug ? selectedCat.slug.substring(0, 3).toUpperCase() : "SAV";
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    onSkuChange(`SV-${catCode}-${randomHex}`);
    if (onClearSkuError) {
      onClearSkuError();
    }
  };

  const hasSkuError = Boolean(error && error.toLowerCase().includes("sku"));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Tag className="w-4 h-4 text-gold-500" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Pricing & Valuation
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Selling Price (₹) *
          </label>
          <input
            type="number"
            required
            min={100}
            value={price}
            onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white font-semibold text-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
            MRP Valuation (₹)
          </label>
          <input
            type="number"
            min={price}
            value={originalPrice}
            onChange={(e) => onOriginalPriceChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white text-slate-700"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Base SKU Code (Optional)
            </label>
            <button
              type="button"
              onClick={handleAutoGenerateSku}
              className="text-[10px] text-gold-600 hover:text-gold-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Generate a unique Savee SKU"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Auto-Generate</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="e.g. SV-SAR-A1B2C"
            value={customSku}
            onChange={(e) => {
              onSkuChange(e.target.value);
              if (hasSkuError && onClearSkuError) onClearSkuError();
            }}
            className={`w-full px-3 py-2 text-xs rounded-lg border font-mono transition-colors focus:outline-none focus:ring-1 ${
              hasSkuError
                ? "border-rose-400 ring-1 ring-rose-400 bg-rose-50/20 text-rose-900"
                : "border-slate-300 focus:ring-navy-900 bg-white"
            }`}
          />
          {hasSkuError ? (
            <p className="text-[10px] text-rose-600 font-medium mt-1">
              {error}
            </p>
          ) : (
            <p className="text-[10px] text-slate-400 mt-1">
              Leave empty to auto-assign a certified Savee SKU.
            </p>
          )}
        </div>
      </div>

      {calculatedDiscount > 0 && (
        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>Storefront Privilege Display:</span>
          <span className="font-bold font-mono">
            {formatINR(price)} (M.R.P. {formatINR(originalPrice)} &bull; {calculatedDiscount}% OFF)
          </span>
        </div>
      )}
    </div>
  );
}
