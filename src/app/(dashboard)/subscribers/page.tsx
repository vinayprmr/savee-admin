"use client";

import React, { useEffect, useState } from "react";
import { Mail, RefreshCw, CheckCircle2, Users } from "lucide-react";
import { NewsletterSubscriberItem } from "../../../domain/models";
import { AdminService } from "../../../services/admin.service";
import { formatDate } from "../../../lib/utils";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.listSubscribers({ limit: 100 });
      setSubscribers(data.items);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || "Failed to load newsletter subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600">
            <Mail className="w-4 h-4" />
            <span>Audience & Newsletter</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-navy-950 mt-1">
            Savee Circle Subscribers
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Customer email addresses collected from the storefront footer signup form.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-navy-50 text-navy-900 border border-navy-100 text-xs font-semibold">
            <span>{total} Total Subscribers</span>
          </div>
          <button
            onClick={fetchSubscribers}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Subscribers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-navy-900" : ""}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading && subscribers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gold-500 mb-2" />
            Loading subscribers list...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600">{error}</div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">No email subscribers yet. Submissions from the store footer will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Subscriber Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sub.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Subscribed</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 text-[11px]">
                      {formatDate(sub.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
