"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Clock, ShieldCheck } from "lucide-react";

const TITLE_MAP: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Atelier Executive Dashboard",
    subtitle: "Real-time metrics, revenue performance, and active order flow",
  },
  "/orders": {
    title: "Orders & Fulfillment Pipeline",
    subtitle: "Track handcrafted orders, advance Delhivery milestones, and inspect invoices",
  },
  "/inventory": {
    title: "Catalog & Variant Inventory Control",
    subtitle: "Manage stock levels across all 126 luxury styles and sizing variations",
  },
  "/coupons": {
    title: "Promotions & Privilege Codes",
    subtitle: "Configure seasonal discounts, order value thresholds, and active privileges",
  },
  "/reviews": {
    title: "Customer Review Moderation",
    subtitle: "Inspect, approve, and curate verified patron reviews for public display",
  },
  "/customers": {
    title: "Customer Directory & Patronage",
    subtitle: "Lifetime spending, order frequency, and registered luxury patron accounts",
  },
};

export function Header() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const meta = TITLE_MAP[pathname] || {
    title: "Savee Atelier Portal",
    subtitle: "Administrative Operations",
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-base font-semibold text-slate-900 leading-none">
          {meta.title}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {meta.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* IST Clock */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime || "IST Live"}</span>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gold-50 text-gold-900 border border-gold-200 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
          <span>Admin Authenticated</span>
        </div>
      </div>
    </header>
  );
}
