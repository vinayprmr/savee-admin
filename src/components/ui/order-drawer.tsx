"use client";

import React, { useState } from "react";
import { AdminOrder, OrderStatus } from "../../domain/models";
import { cn, formatINR, formatDate } from "../../lib/utils";
import { OrderStatusBadge, PaymentStatusBadge } from "./status-badge";
import {
  X,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
} from "lucide-react";
import { AdminService } from "../../services/admin.service";

interface OrderDrawerProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: (updated: AdminOrder) => void;
}

const ALL_STATUSES: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "HANDCRAFTING",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
];

export function OrderDrawer({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
}: OrderDrawerProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("CONFIRMED");
  const [notes, setNotes] = useState("");
  const [carrier, setCarrier] = useState("Delhivery Express");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const updated = await AdminService.updateOrderStatus(order.id, {
        status: selectedStatus,
        notes: notes.trim() || undefined,
        carrier: carrier.trim() || undefined,
        tracking_number: trackingNumber.trim() || undefined,
      });
      onOrderUpdated(updated);
      setNotes("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to advance milestone");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-serif font-bold text-navy-950">
                  Order #{order.orderNumber}
                </h2>
                <OrderStatusBadge status={order.orderStatus} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Placed on {formatDate(order.createdAt)} • Internal ID: {order.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Package className="w-4 h-4 text-gold-500" />
                  Customer Details
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {order.shippingAddress.fullName}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {order.customerEmail}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {order.customerPhone}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  Atelier Shipping Destination
                </div>
                <div className="text-xs text-slate-800 font-medium">
                  {order.shippingAddress.streetAddress}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.postalCode}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {order.shippingAddress.country}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Garments Ordered ({order.items.length})
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {order.items.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center gap-4">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-14 h-18 object-cover rounded bg-slate-100 border border-slate-200"
                      />
                    ) : (
                      <div className="w-14 h-18 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                        Atelier
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {item.productTitle}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>Size: <strong className="text-slate-700">{item.selectedSize}</strong></span>
                        {item.selectedColor && (
                          <span className="flex items-center gap-1">
                            • Color:
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <strong className="text-slate-700">{item.selectedColor.name}</strong>
                          </span>
                        )}
                        <span>• Qty: <strong className="text-slate-700">{item.quantity}</strong></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">
                        {formatINR(item.totalPrice)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatINR(item.unitPrice)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials Breakdown */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Garment Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-600 font-medium">
                  <span>Promotional Privilege Discount</span>
                  <span>-{formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Estimated Luxury GST (5%)</span>
                <span>{formatINR(order.tax)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Insured White-Glove Shipping</span>
                <span>{order.shippingFee === 0 ? "Free Atelier Delivery" : formatINR(order.shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-navy-950">
                <span>Grand Total</span>
                <span className="text-base text-navy-950">{formatINR(order.total)}</span>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  Payment: {order.paymentMethod}
                </span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </div>

            {/* Delhivery Fulfillment Timeline */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-navy-900" />
                Delhivery Fulfillment Journey
              </h3>
              <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-4">
                {order.trackingNumber && (
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500">Carrier:</span>{" "}
                      <span className="font-semibold text-slate-800">{order.carrier || "Delhivery"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">AWB Tracking:</span>{" "}
                      <span className="font-mono font-semibold text-navy-950">{order.trackingNumber}</span>
                    </div>
                  </div>
                )}

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {order.trackingHistory && order.trackingHistory.length > 0 ? (
                    order.trackingHistory.map((milestone, idx) => (
                      <div key={idx} className="relative">
                        <div
                          className={cn(
                            "absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white",
                            milestone.isCompleted ? "bg-navy-900" : "bg-slate-300"
                          )}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                            {milestone.title}
                            <span className="text-[10px] font-normal text-slate-400">
                              {formatDate(milestone.timestamp)}
                            </span>
                          </div>
                          {milestone.description && (
                            <div className="text-xs text-slate-600 mt-0.5">
                              {milestone.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400">No milestone records yet.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Advance Milestone Action */}
            <div className="p-4 rounded-lg bg-navy-50/60 border border-navy-100">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-900 mb-3 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-navy-800" />
                Advance Order Milestone & Notify Delhivery
              </h3>

              {errorMsg && (
                <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdateStatus} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      New Status Milestone
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                      className="w-full text-xs rounded border border-slate-300 p-2 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Carrier Partner
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="e.g. Delhivery Express"
                      className="w-full text-xs rounded border border-slate-300 p-2 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Delhivery AWB / Tracking Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. DELHIVERY-DL-83921820"
                    className="w-full text-xs rounded border border-slate-300 p-2 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Atelier Handcrafting / Fulfillment Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Hand-embroidery completed. Quality check cleared at Jaipur atelier."
                    className="w-full text-xs rounded border border-slate-300 p-2 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? "Advancing..." : "Save Milestone & Sync"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
