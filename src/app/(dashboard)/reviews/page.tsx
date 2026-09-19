"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  RefreshCw,
  CheckCircle,
  XCircle,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { AdminReviewItem } from "../../../domain/models";
import { AdminService } from "../../../services/admin.service";
import { formatDate } from "../../../lib/utils";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");
  const [moderatingId, setModeratingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.listReviews();
      setReviews(data);
    } catch (err: any) {
      setError(err.message || "Failed to load customer reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (reviewId: string, isApproved: boolean) => {
    setModeratingId(reviewId);
    try {
      const updated = await AdminService.moderateReview(reviewId, isApproved);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? updated : r))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update review moderation status");
    } finally {
      setModeratingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "APPROVED") return r.isApproved;
    if (filter === "PENDING") return !r.isApproved;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600">
            <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
            <span>Patron Feedback & Testimonials</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-navy-950 mt-1">
            Customer Review Moderation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Curate customer experiences, verify purchase authenticity, and maintain atelier reputation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === "ALL" ? "bg-white text-navy-950 shadow-2xs font-semibold" : "text-slate-600"
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === "PENDING" ? "bg-white text-navy-950 shadow-2xs font-semibold" : "text-slate-600"
              }`}
            >
              Pending ({reviews.filter((r) => !r.isApproved).length})
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === "APPROVED" ? "bg-white text-navy-950 shadow-2xs font-semibold" : "text-slate-600"
              }`}
            >
              Approved ({reviews.filter((r) => r.isApproved).length})
            </button>
          </div>

          <button
            onClick={fetchReviews}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Reviews"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-navy-900" : ""}`} />
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading && reviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gold-500 mb-2" />
            Loading reviews...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600">{error}</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">No reviews matching the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Author & Verification</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Comment & Feedback</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Garment */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 max-w-[200px] truncate">
                        {rev.productTitle}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        ID: {rev.productId}
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{rev.author}</div>
                      {rev.isVerifiedPurchase && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Purchase</span>
                        </div>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating
                                ? "text-gold-500 fill-gold-500"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Feedback */}
                    <td className="py-3.5 px-4 max-w-sm">
                      {rev.title && (
                        <div className="font-semibold text-slate-900 text-xs mb-0.5">
                          {rev.title}
                        </div>
                      )}
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                        {rev.comment}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {formatDate(rev.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rev.isApproved
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            rev.isApproved ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {rev.isApproved ? "Public" : "Pending Review"}
                      </span>
                    </td>

                    {/* Moderation Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {moderatingId === rev.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-400 inline" />
                      ) : rev.isApproved ? (
                        <button
                          onClick={() => handleModerate(rev.id, false)}
                          className="px-2.5 py-1 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded text-xs font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Hide</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerate(rev.id, true)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors shadow-2xs inline-flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}
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
