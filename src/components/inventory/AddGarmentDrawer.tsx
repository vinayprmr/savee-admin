"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Layers,
} from "lucide-react";
import {
  AdminCategoryItem,
  CreateProductPayload,
  CreateVariantPayload,
  CreateImagePayload,
} from "../../domain/models";
import { AdminService } from "../../services/admin.service";
import { GarmentMediaSection } from "./GarmentMediaSection";
import {
  GarmentVariantsSection,
  SAREE_PRESET_SIZES,
  APPAREL_PRESET_SIZES,
} from "./GarmentVariantsSection";
import { GarmentPricingSection } from "./GarmentPricingSection";

interface AddGarmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: AdminCategoryItem[];
  selectedCategorySlug?: string;
  onGarmentCreated: () => void;
}

export function AddGarmentDrawer({
  isOpen,
  onClose,
  categories,
  selectedCategorySlug,
  onGarmentCreated,
}: AddGarmentDrawerProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("Pure Handloom Silk");
  const [craft, setCraft] = useState("Handcrafted");
  const [occasion, setOccasion] = useState("Festive & Celebratory");
  const [fit, setFit] = useState("Classic Silhouette");

  // Pricing
  const [price, setPrice] = useState<number>(24999);
  const [originalPrice, setOriginalPrice] = useState<number>(32000);
  const [customSku, setCustomSku] = useState("");

  // Badges
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);

  // Media & Variants
  const [images, setImages] = useState<CreateImagePayload[]>([]);
  const [variants, setVariants] = useState<CreateVariantPayload[]>(SAREE_PRESET_SIZES);

  // Initialize category when opened
  useEffect(() => {
    if (categories.length > 0) {
      if (selectedCategorySlug && selectedCategorySlug !== "ALL") {
        const matching = categories.find((c) => c.slug === selectedCategorySlug);
        if (matching) {
          setCategoryId(matching.id);
          applyPresetForCategory(matching.slug);
          return;
        }
      }
      setCategoryId(categories[0].id);
      applyPresetForCategory(categories[0].slug);
    }
  }, [categories, selectedCategorySlug, isOpen]);

  const applyPresetForCategory = (catSlug: string) => {
    if (catSlug === "sarees") {
      setVariants(SAREE_PRESET_SIZES);
      setFabric("Pure Handloom Silk");
      setFit("Standard Drape");
    } else {
      setVariants(APPAREL_PRESET_SIZES);
      setFabric("Pure Silk Blend");
      setFit("Tailored Fit");
    }
  };

  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const cat = categories.find((c) => c.id === newCatId);
    if (cat) {
      applyPresetForCategory(cat.slug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a garment style title.");
      return;
    }
    if (!categoryId) {
      setError("Please select a valid category.");
      return;
    }
    if (price <= 0) {
      setError("Selling price must be greater than zero.");
      return;
    }
    if (variants.length === 0) {
      setError("At least one size variant is required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload: CreateProductPayload = {
        title: title.trim(),
        categoryId,
        subCategory: subCategory.trim() || undefined,
        description:
          description.trim() ||
          `Handcrafted luxury ${title.trim()} featuring timeless artisanal motifs, masterfully handloom finished.`,
        price,
        originalPrice: originalPrice > price ? originalPrice : price,
        sku: customSku.trim() || undefined,
        fabric,
        craft,
        occasion,
        fit,
        washCare: ["Dry clean only in specialized luxury garment care."],
        isNewArrival,
        isFeatured,
        isBestseller,
        images: images.length > 0 ? images : undefined,
        variants,
      };

      await AdminService.createProduct(payload);
      onGarmentCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create garment");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center font-serif shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-navy-950">
                  Add New Garment
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish a new style, configure sizing variants, and initialize inventory.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Garment Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Layers className="w-4 h-4 text-gold-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  1. Garment Identity & Classification
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Garment Style Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varanasi Gold Zari Tissue Heritage Saree"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.itemCount} styles)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Subcategory / Weave
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Katan Silk, Organza, Linen"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Fabric
                  </label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Artisanal Craft
                  </label>
                  <input
                    type="text"
                    value={craft}
                    onChange={(e) => setCraft(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Occasion
                  </label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Fit & Cut
                </label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Garment Story / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the silhouette, fabric weave, styling notes, and drape experience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                />
              </div>
            </div>

            {/* Section 2: Pricing & Codes */}
            <GarmentPricingSection
              price={price}
              originalPrice={originalPrice}
              customSku={customSku}
              onPriceChange={setPrice}
              onOriginalPriceChange={setOriginalPrice}
              onSkuChange={setCustomSku}
              categoryId={categoryId}
              categories={categories}
              error={error}
              onClearSkuError={() => setError(null)}
            />

            {/* Section 3: Visual Assets & Video */}
            <GarmentMediaSection
              images={images}
              onChange={setImages}
              title={title}
              onError={setError}
            />

            {/* Section 4: Sizing Variants & Stock */}
            <GarmentVariantsSection
              variants={variants}
              onChange={setVariants}
            />

            {/* Section 5: Merchandising Toggles */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 block mb-1">
                Storefront Merchandising Highlights
              </span>
              <div className="flex flex-wrap items-center gap-5 text-xs text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded border-slate-300 text-navy-950 focus:ring-navy-950"
                  />
                  <span>Mark as New In</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-slate-300 text-navy-950 focus:ring-navy-950"
                  />
                  <span>Feature in Spotlight</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="rounded border-slate-300 text-navy-950 focus:ring-navy-950"
                  />
                  <span>Bestseller Tag</span>
                </label>
              </div>
            </div>

            {/* Footer Submit */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 py-3 -mx-6 px-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-navy-950 text-white hover:bg-navy-900 transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing Garment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>Publish Garment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
