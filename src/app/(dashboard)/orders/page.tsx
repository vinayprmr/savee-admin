"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  ExternalLink,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { AdminOrder, OrderStatus, PaginatedOrders } from "../../../domain/models";
import { AdminService } from "../../../services/admin.service";
import { formatINR, formatDate } from "../../../lib/utils";
import { OrderStatusBadge, PaymentStatusBadge } from "../../../components/ui/status-badge";
import { OrderDrawer } from "../../../components/ui/order-drawer";

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All Orders", value: "ALL" },
  { label: "Placed", value: "PLACED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Handcrafting", value: "HANDCRAFTING" },
  { label: "Dispatched", value: "DISPATCHED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await AdminService.listOrders({
        status: selectedTab,
        q: searchQuery.trim() || undefined,
        page,
        limit,
      });
      setOrders(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [selectedTab, searchQuery, page, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleTabChange = (tabValue: string) => {
    setSelectedTab(tabValue);
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleOrderUpdated = (updated: AdminOrder) => {
    setActiveOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTab === tab.value
                  ? "bg-navy-950 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID, customer, phone, Delhivery AWB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900 bg-slate-50/50"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500">
              Showing <strong className="text-slate-800">{orders.length}</strong> of {total} orders
            </span>
            <button
              onClick={fetchOrders}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-navy-900" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading && orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gold-500 mb-2" />
            Loading fulfillment orders...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">No orders found matching the filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Patron & Destination</th>
                  <th className="py-3 px-4">Garment Items</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Grand Total</th>
                  <th className="py-3 px-4">Status & Carrier</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Order Number */}
                    <td className="py-3.5 px-4 font-mono font-medium text-navy-950">
                      #{o.orderNumber}
                    </td>

                    {/* Patron & Destination */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {o.shippingAddress.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {o.shippingAddress.city}, {o.shippingAddress.state}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {o.customerPhone}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {o.items[0]?.productTitle || "Atelier Garment"}
                        {o.items.length > 1 && (
                          <span className="text-slate-400 font-normal"> +{o.items.length - 1} more</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Size: {o.items[0]?.selectedSize} • Qty: {o.items[0]?.quantity}
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-semibold text-slate-800">{o.paymentMethod}</span>
                      </div>
                      <PaymentStatusBadge status={o.paymentStatus} />
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm">
                      {formatINR(o.total)}
                    </td>

                    {/* Status & Carrier */}
                    <td className="py-3.5 px-4">
                      <div className="mb-1">
                        <OrderStatusBadge status={o.orderStatus} />
                      </div>
                      {o.trackingNumber ? (
                        <div className="text-[10px] text-navy-900 font-mono flex items-center gap-1">
                          <Truck className="w-3 h-3 text-slate-400" />
                          <span>{o.trackingNumber}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400">Standard Dispatch</div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {formatDate(o.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setActiveOrder(o);
                          setIsDrawerOpen(true);
                        }}
                        className="px-3 py-1.5 bg-navy-950 hover:bg-navy-900 text-white rounded text-xs font-medium transition-colors shadow-2xs inline-flex items-center gap-1"
                      >
                        <span>Inspect & Advance</span>
                      </button>
                    </td>
                  </tr>
                ))}
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

      {/* Slide-out Order Drawer */}
      <OrderDrawer
        order={activeOrder}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setActiveOrder(null);
        }}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  );
}
