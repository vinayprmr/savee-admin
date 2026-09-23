"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Layers,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  FolderPlus,
} from "lucide-react";
import { AdminCategoryItem, CreateCategoryPayload } from "../../domain/models";
import { AdminService } from "../../services/admin.service";

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: AdminCategoryItem[];
  onCategoryChanged: () => void;
}

export function ManageCategoriesModal({
  isOpen,
  onClose,
  categories,
  onCategoryChanged,
}: ManageCategoriesModalProps) {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New category form state
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatSubcats, setNewCatSubcats] = useState("");
  const [newCatFeatured, setNewCatFeatured] = useState(false);

  // Toggling status state
  const [updatingCatId, setUpdatingCatId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setNewCatName(val);
    // Auto-slugify if slug wasn't manually customized
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setNewCatSlug(autoSlug);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!newCatName.trim()) {
      setError("Please provide a category name.");
      return;
    }

    try {
      setSubmitting(true);
      const subcatList = newCatSubcats
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({
          name,
          slug: name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
        }));

      const payload: CreateCategoryPayload = {
        name: newCatName.trim(),
        slug: newCatSlug.trim() || undefined,
        description: newCatDesc.trim() || undefined,
        isFeatured: newCatFeatured,
        displayOrder: categories.length + 1,
        subcategories: subcatList,
      };

      await AdminService.createCategory(payload);
      setSuccessMsg(`Category "${newCatName}" added successfully!`);

      // Reset form
      setNewCatName("");
      setNewCatSlug("");
      setNewCatDesc("");
      setNewCatSubcats("");
      setNewCatFeatured(false);

      onCategoryChanged();
      setTimeout(() => {
        setActiveTab("list");
        setSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat: AdminCategoryItem) => {
    try {
      setUpdatingCatId(cat.id);
      await AdminService.updateCategory(cat.id, {
        isActive: !cat.isActive,
      });
      onCategoryChanged();
    } catch (err: any) {
      alert(err.message || "Failed to toggle category status");
    } finally {
      setUpdatingCatId(null);
    }
  };

  const handleDeleteCategory = async (cat: AdminCategoryItem) => {
    const confirmMsg =
      cat.itemCount > 0
        ? `"${cat.name}" currently contains ${cat.itemCount} garments. Deleting will safely hide/deactivate this category from the storefront. Proceed?`
        : `Are you sure you want to permanently delete category "${cat.name}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setUpdatingCatId(cat.id);
      const res = await AdminService.deleteCategory(cat.id);
      alert(res.message);
      onCategoryChanged();
    } catch (err: any) {
      alert(err.message || "Failed to remove category");
    } finally {
      setUpdatingCatId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-navy-950">
                Atelier Garment Categories
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage garment collections, navigation taxonomy, and catalog classifications.
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

        {/* Tab Controls */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`pb-3 text-xs font-semibold px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "list"
                ? "border-navy-950 text-navy-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <span>Existing Categories</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono">
              {categories.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`pb-3 text-xs font-semibold px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "create"
                ? "border-navy-950 text-navy-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "list" ? (
            <div className="space-y-3">
              {categories.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No categories found. Click "Add New Category" to create your first category.
                </div>
              ) : (
                categories.map((cat) => {
                  const isUpdating = updatingCatId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                        cat.isActive
                          ? "bg-slate-50/70 border-slate-200"
                          : "bg-slate-100/60 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-navy-950">
                            {cat.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-500">
                            /{cat.slug}
                          </span>
                          {cat.isFeatured && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-700 font-medium border border-gold-500/20">
                              Featured
                            </span>
                          )}
                        </div>

                        {cat.description && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                            {cat.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                          <span>
                            <strong className="text-slate-700">{cat.itemCount}</strong> garments
                          </span>
                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <span>
                              &bull; {cat.subcategories.length} subcategories (
                              {cat.subcategories.map((s) => s.name).join(", ")})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Toggle Active status */}
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleToggleStatus(cat)}
                          className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                            cat.isActive
                              ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                          title={cat.isActive ? "Hide from Storefront" : "Activate on Storefront"}
                        >
                          {cat.isActive ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[10px]">Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                              <span className="text-[10px]">Hidden</span>
                            </>
                          )}
                        </button>

                        {/* Delete/Deactivate button */}
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete or Deactivate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <form onSubmit={handleCreateCategory} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Office Wear, Casuals, Indo-Western"
                    value={newCatName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. office-wear"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Atelier Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Contemporary formal silhouettes, structured handloom cottons, and refined daywear."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Subcategories (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Silk Shirts, Formal Kurtas, Linen Trousers, Blazers"
                  value={newCatSubcats}
                  onChange={(e) => setNewCatSubcats(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="catFeatured"
                  checked={newCatFeatured}
                  onChange={(e) => setNewCatFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-navy-900 focus:ring-navy-900"
                />
                <label htmlFor="catFeatured" className="text-xs text-slate-700 cursor-pointer">
                  Feature this category in the curated storefront spotlight
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-navy-950 text-white hover:bg-navy-900 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-3.5 h-3.5 text-gold-400" />
                      <span>Create Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
