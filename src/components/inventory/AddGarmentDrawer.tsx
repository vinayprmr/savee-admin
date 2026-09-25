"use client";

import React, { useState, useEffect, useId } from "react";
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  RefreshCw,
  Tag,
  Layers,
  ChevronRight,
  ChevronLeft,
  Film,
  Volume2,
} from "lucide-react";
import {
  AdminCategoryItem,
  CreateProductPayload,
  CreateVariantPayload,
  CreateImagePayload,
} from "../../domain/models";
import { AdminService } from "../../services/admin.service";
import { formatINR } from "../../lib/utils";

interface AddGarmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: AdminCategoryItem[];
  selectedCategorySlug?: string;
  onGarmentCreated: () => void;
}

const SAREE_PRESET_SIZES = [{ size: "Free Size", stockQuantity: 15 }];
const APPAREL_PRESET_SIZES = [
  { size: "XS", stockQuantity: 5 },
  { size: "S", stockQuantity: 8 },
  { size: "M", stockQuantity: 10 },
  { size: "L", stockQuantity: 8 },
  { size: "XL", stockQuantity: 5 },
  { size: "XXL", stockQuantity: 3 },
];

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

  // Images & Video media list
  const [images, setImages] = useState<CreateImagePayload[]>([
    {
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      altText: "Luxury Handcrafted Ensemble",
      isPrimary: true,
      mediaType: "image",
    },
  ]);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newThumbnailUrl, setNewThumbnailUrl] = useState("");
  const [newHasAudio, setNewHasAudio] = useState(false);

  // Variants list
  const [variants, setVariants] = useState<CreateVariantPayload[]>(SAREE_PRESET_SIZES);
  const [customSizeInput, setCustomSizeInput] = useState("");

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

  const handleAddImage = () => {
    const trimmedUrl = newImageUrl.trim();
    if (!trimmedUrl) return;

    const isVideo = mediaType === "video" || /\.(mp4|webm|mov)(\?.*)?$/i.test(trimmedUrl);
    const posterUrl = newThumbnailUrl.trim() || undefined;

    setImages((prev) => [
      ...prev,
      {
        url: trimmedUrl,
        altText: title || (isVideo ? "Atelier Video Drape" : "Atelier Silhouette"),
        isPrimary: prev.length === 0,
        mediaType: isVideo ? "video" : "image",
        thumbnailUrl: isVideo
          ? posterUrl ||
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
          : undefined,
        hasAudio: isVideo ? newHasAudio : false,
      },
    ]);

    setNewImageUrl("");
    setNewThumbnailUrl("");
    setNewHasAudio(false);
    setMediaType("image");
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    setImages((prev) => {
      const targetIndex = direction === "left" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((img) => img.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  };

  const handleStockChange = (index: number, val: number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, stockQuantity: Math.max(0, val) } : v))
    );
  };

  const handleAddCustomSize = () => {
    const clean = customSizeInput.trim().toUpperCase();
    if (!clean) return;
    if (variants.some((v) => v.size.toUpperCase() === clean)) {
      alert("This size is already configured.");
      return;
    }
    setVariants((prev) => [...prev, { size: clean, stockQuantity: 10 }]);
    setCustomSizeInput("");
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      alert("At least one sizing variant is required.");
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCalculatedStock = variants.reduce((acc, v) => acc + v.stockQuantity, 0);
  const calculatedDiscount =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAutoGenerateSku = () => {
    const selectedCat = categories.find((c) => c.id === categoryId);
    const catCode = selectedCat?.slug ? selectedCat.slug.substring(0, 3).toUpperCase() : "SAV";
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    setCustomSku(`SV-${catCode}-${randomHex}`);
    if (error && error.toLowerCase().includes("sku")) {
      setError(null);
    }
  };

  const hasSkuError = Boolean(error && error.toLowerCase().includes("sku"));

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
      setError("Atelier price must be greater than zero.");
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
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Tag className="w-4 h-4 text-gold-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  2. Pricing & Valuation
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
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
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
                    onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
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
                      setCustomSku(e.target.value);
                      if (hasSkuError) setError(null);
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

            {/* Section 3: Visual Imagery & Videos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gold-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    3. High-Resolution Visual Assets & Video
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  {images.length} {images.length === 1 ? "asset" : "assets"} linked
                </span>
              </div>

              {/* Media Type Switcher */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg max-w-xs">
                <button
                  type="button"
                  onClick={() => setMediaType("image")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    mediaType === "image"
                      ? "bg-white text-navy-950 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Still Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("video")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    mediaType === "video"
                      ? "bg-white text-gold-600 shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Video Drape</span>
                </button>
              </div>

              {/* Input Fields */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder={
                      mediaType === "video"
                        ? "Paste direct video stream URL (.mp4, .webm)..."
                        : "Paste direct high-res image URL (e.g. Unsplash, CDN)..."
                    }
                    value={newImageUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewImageUrl(val);
                      if (/\.(mp4|webm|mov)(\?.*)?$/i.test(val)) {
                        setMediaType("video");
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add {mediaType === "video" ? "Video" : "URL"}</span>
                  </button>
                </div>

                {mediaType === "video" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="Poster / Cover Image URL (displayed on cards & thumbnail)..."
                      value={newThumbnailUrl}
                      onChange={(e) => setNewThumbnailUrl(e.target.value)}
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                    />
                    <label className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newHasAudio}
                        onChange={(e) => setNewHasAudio(e.target.checked)}
                        className="rounded border-slate-300 text-gold-500 focus:ring-gold-500"
                      />
                      <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Video includes sound / audio track</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Thumbnails preview & sequence management */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => {
                  const isVid = img.mediaType === "video";
                  const coverSrc = isVid ? img.thumbnailUrl || img.url : img.url;

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-xl border overflow-hidden group transition-all ${
                        img.isPrimary
                          ? "ring-2 ring-gold-500 border-gold-500 shadow-xs"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      {/* Image / Video thumbnail */}
                      <div className="relative w-full h-24 bg-slate-900 overflow-hidden">
                        <img
                          src={coverSrc}
                          alt={img.altText || `Garment asset ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isVid && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-gold-400 text-[10px] font-semibold flex items-center gap-1">
                            <Film className="w-3 h-3" />
                            <span>Video</span>
                            {img.hasAudio && <Volume2 className="w-2.5 h-2.5 text-white/80" />}
                          </div>
                        )}
                        <div className="absolute top-1.5 right-1.5 px-1 rounded bg-black/60 text-white text-[9px] font-mono">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Card Controls */}
                      <div className="p-1.5 bg-white/95 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-0.5">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, "left")}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                              title="Move Earlier"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {idx < images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, "right")}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                              title="Move Later"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className={`font-semibold flex items-center gap-1 ${
                            img.isPrimary
                              ? "text-gold-600 font-bold"
                              : "text-slate-400 hover:text-slate-700"
                          }`}
                        >
                          {img.isPrimary && <Check className="w-3 h-3" />}
                          {img.isPrimary ? "Primary" : "Set Primary"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="text-slate-300 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Sizing & Variant Inventory */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    4. Sizing Variants & Initial Stock
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
                  onClick={() => setVariants(SAREE_PRESET_SIZES)}
                  className="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Saree Drape (Free Size)
                </button>
                <button
                  type="button"
                  onClick={() => setVariants(APPAREL_PRESET_SIZES)}
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
