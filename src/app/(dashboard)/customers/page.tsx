"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Users,
  Search,
  RefreshCw,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { AdminCustomerItem, PaginatedAdminCustomers } from "../../../domain/models";
import { AdminService } from "../../../services/admin.service";
import { formatINR, formatDate } from "../../../lib/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomerItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.listCustomers({
        q: searchQuery.trim() || undefined,
        page,
        limit,
      });
      setCustomers(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load customer directory");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page, limit]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600">
            <Users className="w-4 h-4" />
            <span>Patronage & CRM</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-navy-950 mt-1">
            Customer Lifetime Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            View registered atelier patrons, lifetime garment spend, and regional distribution.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patron name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900 bg-slate-50/50"
            />
          </form>

          <button
            onClick={fetchCustomers}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-navy-900" : ""}`} />
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading && customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gold-500 mb-2" />
            Loading patron directory...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600">{error}</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">No customer accounts match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Patron Name</th>
                  <th className="py-3 px-4">Contact Coordinates</th>
                  <th className="py-3 px-4">Primary Destination</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Patron Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Patron Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-navy-950 text-gold-400 flex items-center justify-center text-[10px] font-serif font-bold">
                          {c.fullName.charAt(0)}
                        </span>
                        <span>{c.fullName}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">{c.email || "No email on record"}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {c.phone || "No phone"}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      {c.city ? (
                        <div className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                          <span>
                            {c.city}, {c.state}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Unspecified</span>
                      )}
                    </td>

                    {/* Orders */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 font-mono">
                        {c.totalOrders}
                      </span>
                      <span className="text-[11px] text-slate-400"> orders</span>
                    </td>

                    {/* Total Spend */}
                    <td className="py-3.5 px-4 font-semibold text-navy-950 text-sm">
                      {formatINR(c.totalSpent)}
                    </td>

                    {/* Last Order */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {c.lastOrderDate ? formatDate(c.lastOrderDate) : "No orders yet"}
                    </td>

                    {/* Patron Since */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] text-right whitespace-nowrap">
                      {formatDate(c.createdAt)}
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
    </div>
  );
}
