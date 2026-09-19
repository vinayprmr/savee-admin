import React from "react";
import { OrderStatus } from "../../domain/models";
import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  status: OrderStatus | string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: StatusBadgeProps) {
  const upper = (status || "").toUpperCase();

  switch (upper) {
    case "PLACED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200",
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
          Placed
        </span>
      );
    case "CONFIRMED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200",
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          Confirmed
        </span>
      );
    case "HANDCRAFTING":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-900 border border-purple-200",
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
          Handcrafting
        </span>
      );
    case "DISPATCHED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200",
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          Dispatched
        </span>
      );
    case "DELIVERED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200",
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          Delivered
        </span>
      );
    case "CANCELLED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200",
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
          Cancelled
        </span>
      );
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800",
            className
          )}
        >
          {status}
        </span>
      );
  }
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const upper = (status || "").toUpperCase();
  if (upper === "COMPLETED") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        Paid
      </span>
    );
  }
  if (upper === "FAILED") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      Pending
    </span>
  );
}

export function StockStatusBadge({ quantity }: { quantity: number }) {
  if (quantity <= 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
        Out of Stock
      </span>
    );
  }
  if (quantity <= 3) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
        Low Stock ({quantity})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      {quantity} in stock
    </span>
  );
}
