"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Layers,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { AdminProductItem, AdminVariantItem, PaginatedAdminProducts } from "../../../domain/models";
import { AdminService } from "../../../services/admin.service";
import { formatINR } from "../../../lib/utils";
import { StockStatusBadge } from "../../../components/ui/status-badge";

const CATEGORIES = [
  { label: "All Garments", value: "ALL" },
  { label: "Sarees", value: "sarees" },
  { label: "Lehengas", value: "lehengas" },
  { label: "Kurtas & Sets", value: "kurtas-sets" },
  { label: "Anarkalis", value: "anarkalis" },
  { label: "Gowns", value: "gowns" },
  { label: "Co-ord Sets", value: "coord-sets" },
  { label: "Dresses", value: "dresses" },
  { label: "Jewelry", value: "jewelry" },
];

export default function InventoryPage() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Expanded product rows
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Stock edit buffer: variantId -> new quantity
  const [stockBuffer, setStockBuffer] = useState<Record<string, number>>({});
  const [savingVariantId, setSavingVariantId] = useState<string | null>(null);
  const [savedVariantId, setSavedVariantId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await AdminService.listProducts({
        category: selectedCategory,
        stockStatus: stockFilter,
        q: searchQuery.trim() || undefined,
        page,
        limit,
      });
      setProducts(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);

      // Initialize buffer with current quantities
      const initialBuffer: Record<string, number> = {};
      res.items.forEach((p) => {
        p.variants.forEach((v) => {
          initialBuffer[v.id] = v.stockQuantity;
        });
      });
      setStockBuffer((prev) => ({ ...initialBuffer, ...prev }));
    } catch (err: any) {
      setError(err.message || "Failed to load catalog inventory");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, stockFilter, searchQuery, page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleExpand = (productId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleStockChange = (variantId: string, val: number) => {
    setStockBuffer((prev) => ({
      ...prev,
      [variantId]: Math.max(0, val),
    }));
  };

  const handleSaveStock = async (variantId: string, productId: string) => {
    const newQty = stockBuffer[variantId];
    if (newQty === undefined) return;

    setSavingVariantId(variantId);
    try {
      const updatedVariant = await AdminService.updateVariantStock(variantId, newQty);

      // Update local product state
      setProducts((prev) =>
        prev.map((prod) => {
          if (prod.id !== productId) return prod;
          const newVariants = prod.variants.map((v) =>
            v.id === variantId ? updatedVariant : v
          );
          const newTotalStock = newVariants.reduce(
            (sum, v) => sum + v.stockQuantity,
            0
          );
          return {
            ...prod,
            variants: newVariants,
            totalStock: newTotalStock,
            inStock: newTotalStock > 0,
          };
        })
      );

      setSavedVariantId(variantId);
      setTimeout(() => {
        setSavedVariantId(null);
      }, 2000);
    } catch (err: any) {
      alert(err.message || "Failed to update stock quantity");
    } finally {
      setSavingVariantId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search and Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? "bg-navy-950 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search styles by title, SKU, fabric..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900 bg-slate-50/50"
              />
            </div>

            {/* Stock status filter */}
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-900"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="low_stock">Low Stock (≤ 3 units)</option>
              <option value="out_of_stock">Out of Stock (0 units)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500">
              Showing <strong className="text-slate-800">{products.length}</strong> of {total} garments
            </span>
            <button
              onClick={fetchProducts}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh Catalog"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-navy-900" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading && products.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gold-500 mb-2" />
            Loading catalog garments...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">No garments match the current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 w-12 text-center">Variants</th>
                  <th className="py-3 px-4">Garment Style</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">SKU Code</th>
                  <th className="py-3 px-4">Atelier Price</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {products.map((prod) => {
                  const isExpanded = expandedIds.has(prod.id);

                  return (
                    <React.Fragment key={prod.id}>
                      {/* Parent Product Row */}
                      <tr
                        className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                          isExpanded ? "bg-slate-50/50" : ""
                        }`}
                        onClick={() => toggleExpand(prod.id)}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            className="p-1 text-slate-400 hover:text-slate-800 rounded transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {prod.image ? (
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="w-10 h-13 object-cover rounded bg-slate-100 border border-slate-200"
                              />
                            ) : (
                              <div className="w-10 h-13 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                                Atelier
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-slate-900 leading-tight">
                                {prod.title}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {prod.variants.length} sizing {prod.variants.length === 1 ? "variant" : "variants"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {prod.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {prod.sku}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {formatINR(prod.price)}
                        </td>

                        <td className="py-3.5 px-4">
                          <StockStatusBadge quantity={prod.totalStock} />
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`text-[11px] font-medium ${
                              prod.inStock ? "text-emerald-700" : "text-rose-600 font-semibold"
                            }`}
                          >
                            {prod.inStock ? "Available" : "Stock Depleted"}
                          </span>
                        </td>
                      </tr>

                      {/* Expandable Sizing & Quick Stock Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-y border-slate-200">
                          <td colSpan={7} className="p-4 pl-14">
                            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-xs font-semibold text-navy-950 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                                  <span>Garment Size & Sku Inventory Breakdown</span>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  Edits sync instantly to PostgreSQL
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {prod.variants.map((v) => {
                                  const currentBuffer =
                                    stockBuffer[v.id] !== undefined
                                      ? stockBuffer[v.id]
                                      : v.stockQuantity;
                                  const isDirty = currentBuffer !== v.stockQuantity;
                                  const isSaving = savingVariantId === v.id;
                                  const isSaved = savedVariantId === v.id;

                                  return (
                                    <div
                                      key={v.id}
                                      className={`p-3 rounded-lg border transition-all ${
                                        isDirty
                                          ? "bg-amber-50/50 border-amber-300 shadow-xs"
                                          : isSaved
                                          ? "bg-emerald-50/50 border-emerald-300"
                                          : "bg-slate-50 border-slate-200"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1.5">
                                        <div className="font-semibold text-slate-800 text-xs">
                                          Size: <span className="text-navy-950">{v.size}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400">
                                          {v.sku}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 mt-2">
                                        {/* Counter controls */}
                                        <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleStockChange(v.id, currentBuffer - 1)
                                            }
                                            className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition-colors font-bold text-xs"
                                          >
                                            -
                                          </button>
                                          <input
                                            type="number"
                                            min={0}
                                            value={currentBuffer}
                                            onChange={(e) =>
                                              handleStockChange(
                                                v.id,
                                                parseInt(e.target.value) || 0
                                              )
                                            }
                                            className="w-12 text-center text-xs py-1 font-semibold text-slate-800 focus:outline-none"
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleStockChange(v.id, currentBuffer + 1)
                                            }
                                            className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition-colors font-bold text-xs"
                                          >
                                            +
                                          </button>
                                        </div>

                                        {/* Save button */}
                                        <button
                                          type="button"
                                          disabled={!isDirty || isSaving}
                                          onClick={() => handleSaveStock(v.id, prod.id)}
                                          className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                                            isSaved
                                              ? "bg-emerald-600 text-white"
                                              : isDirty
                                              ? "bg-navy-950 hover:bg-navy-900 text-white shadow-xs"
                                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                          }`}
                                        >
                                          {isSaving ? (
                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                          ) : isSaved ? (
                                            <>
                                              <Check className="w-3 h-3" />
                                              <span>Saved</span>
                                            </>
                                          ) : (
                                            <>
                                              <Save className="w-3 h-3" />
                                              <span>Save</span>
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <div>
            Page <strong className="text-slate-900">{page}</strong> of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
