"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  TicketPercent,
  Star,
  Users,
  SlidersHorizontal,
  Mail,
  LogOut,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAdminAuthStore } from "../../state/admin-auth.store";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Orders & Pipeline",
    href: "/orders",
    icon: ShoppingBag,
    badge: null,
  },
  {
    label: "Garment Inventory",
    href: "/inventory",
    icon: Layers,
    badge: "126 styles",
  },
  {
    label: "Promotions & Codes",
    href: "/coupons",
    icon: TicketPercent,
    badge: null,
  },
  {
    label: "Review Moderation",
    href: "/reviews",
    icon: Star,
    badge: null,
  },
  {
    label: "Customer Directory",
    href: "/customers",
    icon: Users,
    badge: null,
  },
  {
    label: "Storefront & CMS",
    href: "/storefront",
    icon: SlidersHorizontal,
    badge: "Live",
  },
  {
    label: "Newsletter Subscribers",
    href: "/subscribers",
    icon: Mail,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuthStore();

  return (
    <aside className="w-64 bg-navy-950 text-slate-200 flex flex-col flex-shrink-0 border-r border-navy-900 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-navy-900/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500" />
          <span className="font-serif text-2xl font-bold tracking-widest text-gold-400">
            SAVEE
          </span>
        </div>
        <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 mt-1">
          Brand Operations Portal
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group",
                isActive
                  ? "bg-gold-500/15 text-gold-300 font-semibold border-l-2 border-gold-500"
                  : "text-slate-400 hover:text-slate-100 hover:bg-navy-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-gold-400"
                      : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-900 text-slate-400 border border-navy-800">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status & Admin Profile */}
      <div className="p-4 border-t border-navy-900/80 bg-navy-950/60 space-y-3">
        {/* Backend Connectivity Status */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded bg-navy-900/60 border border-navy-800/80 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono">Backend :8000</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">ONLINE</span>
        </div>

        {/* Link to Consumer Store */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-400 hover:text-gold-400 transition-colors"
        >
          <span>View Customer Store</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* User Card & Logout */}
        <div className="pt-2 border-t border-navy-900 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="text-xs font-semibold text-slate-200 truncate">
              {admin?.name || "Operations Staff"}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {admin?.email || "admin@savee.in"}
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out of Savee"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-navy-900 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
