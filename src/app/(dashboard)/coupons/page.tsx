"use client";

import React, { useEffect, useState } from "react";
import {
  TicketPercent,
  Plus,
  RefreshCw,
  Sparkles,
  Check,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { AdminCouponItem, CreateCouponPayload } from "../../../domain/models";
import { AdminService } from "../../../services/admin.service";
import { formatINR } from "../../../lib/utils";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<AdminCouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(2000);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(1000);

  // Toggling state tracker
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.listCoupons();
      setCoupons(data);
    } catch (err: any) {
      setError(err.message || "Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggle = async (couponId: string) => {
    setTogglingId(couponId);
    try {
      const updated = await AdminService.toggleCoupon(couponId);
      setCoupons((prev) =>
        prev.map((c) => (c.id === couponId ? updated : c))
      );
    } catch (err: any) {
      alert(err.message || "Failed to toggle promotion status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const payload: CreateCouponPayload = {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      };

      const newCoupon = await AdminService.createCoupon(payload);
      setCoupons((prev) => [newCoupon, ...prev]);
      setIsModalOpen(false);

      // Reset form
      setCode("");
      setDiscountValue(10);
      setMinOrderValue(2000);
      setMaxDiscount(1000);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create coupon");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner and Action */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600">
            <TicketPercent className="w-4 h-4" />
            <span>Campaigns & Privileges</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-navy-950 mt-1">
            Luxury Promotional Codes
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure boutique seasonal discounts, VIP client privileges, and cart value gates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Promotions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-navy-900" : ""}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-navy-950 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Privilege Code</span>
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading && coupons.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gold-500 mb-2" />
            Loading active campaigns...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600">{error}</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <TicketPercent className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">No active promotion codes found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Privilege Value</th>
                  <th className="py-3 px-4">Min Order Threshold</th>
                  <th className="py-3 px-4">Max Discount Cap</th>
                  <th className="py-3 px-4">Total Redemptions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Active Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-950 text-sm">
                      <span className="px-2.5 py-1 rounded bg-gold-50 text-gold-900 border border-gold-200">
                        {c.code}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900">
                        {c.discountType === "percentage"
                          ? `${c.discountValue}% OFF`
                          : `${formatINR(c.discountValue)} FLAT OFF`}
                      </span>
                    </td>

                    {/* Min Order */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.minOrderValue > 0 ? formatINR(c.minOrderValue) : "No minimum"}
                    </td>

                    {/* Max Discount */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.maxDiscount ? formatINR(c.maxDiscount) : "No limit"}
                    </td>

                    {/* Times Used */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 font-mono">
                        {c.timesUsed}
                      </span>
                      <span className="text-[11px] text-slate-400"> patrons</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          c.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {c.isActive ? "Live in Store" : "Disabled"}
                      </span>
                    </td>

                    {/* Toggle Switch */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggle(c.id)}
                        disabled={togglingId === c.id}
                        className={`p-1 rounded transition-colors ${
                          c.isActive ? "text-emerald-600 hover:text-emerald-700" : "text-slate-400 hover:text-slate-600"
                        }`}
                        title={c.isActive ? "Click to deactivate" : "Click to activate"}
                      >
                        {togglingId === c.id ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : c.isActive ? (
                          <ToggleRight className="w-7 h-7" />
                        ) : (
                          <ToggleLeft className="w-7 h-7" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-navy-950">
                  New Promotion Privilege
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Issue a new promotional coupon code for customer checkout
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
              {createError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs font-mono uppercase font-semibold rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) =>
                      setDiscountType(e.target.value as "percentage" | "flat")
                    }
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Discount Value {discountType === "percentage" ? "(%)" : "(₹)"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Optional"
                    value={maxDiscount ?? ""}
                    onChange={(e) =>
                      setMaxDiscount(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {creating ? "Creating..." : "Save Privilege Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
