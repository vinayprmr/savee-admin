"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  DollarSign,
} from "lucide-react";
import { AnalyticsSummary, AdminOrder } from "../../domain/models";
import { AdminService } from "../../services/admin.service";
import { formatINR, formatDate } from "../../lib/utils";
import { OrderStatusBadge } from "../../components/ui/status-badge";
import { OrderDrawer } from "../../components/ui/order-drawer";

export default function DashboardOverviewPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.getAnalyticsSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve analytics summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOrderUpdated = (updated: AdminOrder) => {
    setSelectedOrder(updated);
    if (summary) {
      setSummary({
        ...summary,
        recent_orders: summary.recent_orders.map((o) =>
          o.id === updated.id ? updated : o
        ),
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl shadow-xs border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-center">
        <AlertTriangle className="w-8 h-8 mx-auto text-rose-500 mb-2" />
        <h3 className="text-base font-semibold">Backend Connection Issue</h3>
        <p className="text-xs text-rose-600 mt-1 max-w-md mx-auto">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded text-xs font-medium hover:bg-rose-700 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-2xl p-6 text-white shadow-md border border-navy-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Atelier Operational Pulse</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-100 mt-1">
            Welcome to the Savee Command Center
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time fulfillment metrics, luxury stock inventory across 126 catalog garments, and synchronized Delhivery logistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <span>Fulfillment Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/inventory"
            className="px-4 py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-medium border border-navy-700 transition-colors"
          >
            Manage Stock
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-navy-950 mt-3">
            {formatINR(summary.total_revenue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">Live</span> from customer orders
          </div>
        </div>

        {/* Active In Fulfillment */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active In Fulfillment
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-navy-950 mt-3">
            {summary.active_orders}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            Handcrafting & In-Transit
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average Order Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-navy-950 mt-3">
            {formatINR(summary.average_order_value)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {summary.total_orders} total orders
          </div>
        </div>

        {/* Low Stock Alert */}
        <Link
          href="/inventory?stockStatus=low_stock"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Low Stock Alert
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-navy-950 mt-3 flex items-center justify-between">
            <span>{summary.low_stock_variants_count}</span>
            <span className="text-xs text-amber-600 font-sans font-medium flex items-center gap-1">
              Restock <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Variants with &le; 3 units remaining
          </div>
        </Link>
      </div>

      {/* Grid: Category Distribution & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Garment Catalog by Category
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total 126 handcrafted styles currently cataloged in PostgreSQL
              </p>
            </div>
            <Link
              href="/inventory"
              className="text-xs text-gold-600 hover:text-gold-700 font-semibold flex items-center gap-1"
            >
              <span>View Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {summary.category_distribution.map((cat) => (
              <div
                key={cat.category}
                className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between"
              >
                <span className="text-xs font-medium text-slate-700 truncate">
                  {cat.category}
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-lg font-serif font-bold text-navy-950">
                    {cat.product_count}
                  </span>
                  <span className="text-[10px] text-slate-400">garments</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Shortcuts (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Atelier Operations Hub
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Direct access to brand management modules
            </p>

            <div className="space-y-2.5">
              <Link
                href="/orders"
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-navy-900" />
                  <span>Order Fulfillment Pipeline</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/inventory"
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-navy-900" />
                  <span>Variant Inventory & Stock</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/coupons"
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-gold-600" />
                  <span>Promotional Privilege Codes</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/reviews"
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Customer Review Moderation</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Customer Front End</span>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-gold-600 hover:text-gold-700 font-medium inline-flex items-center gap-1"
            >
              <span>Visit Shop</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest patron orders submitted to the atelier
            </p>
          </div>
          <Link
            href="/orders"
            className="text-xs text-navy-900 hover:text-navy-950 font-semibold flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {summary.recent_orders.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No orders submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Patron</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Milestone</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {summary.recent_orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-navy-950">
                      #{o.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">
                        {o.shippingAddress.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {o.shippingAddress.city}, {o.shippingAddress.state}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {o.items.length} {o.items.length === 1 ? "garment" : "garments"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {formatINR(o.total)}
                    </td>
                    <td className="py-3 px-4">
                      <OrderStatusBadge status={o.orderStatus} />
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setDrawerOpen(true);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-out Order Drawer */}
      <OrderDrawer
        order={selectedOrder}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedOrder(null);
        }}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  );
}
