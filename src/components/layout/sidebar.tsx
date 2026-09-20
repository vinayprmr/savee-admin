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
import { SaveeHorizontalLogo } from "../brand/SaveeLogo";

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
        <Link href="/" className="block">
          <SaveeHorizontalLogo variant="white" className="h-8 w-auto" />
        </Link>
        <div className="text-[10px] uppercase font-semibold tracking-widest text-gold-400/90 mt-2">
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
                  ? "bg-gold-500/15 text-gold-300 font-semibold border-l-2 border-gold-400"
                  : "text-slate-300 hover:text-white hover:bg-navy-900/90"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-gold-400"
                      : "text-slate-400 group-hover:text-gold-400"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors",
                    isActive
                      ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
                      : "bg-navy-900 text-slate-300 border border-navy-800"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status & Admin Profile */}
      <div className="p-4 border-t border-navy-900/80 bg-navy-950/80 space-y-3">
        {/* Backend Connectivity Status */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-navy-900/80 border border-navy-800 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 font-mono">Backend :8000</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold tracking-wider">ONLINE</span>
        </div>

        {/* Link to Consumer Store */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] text-slate-300 hover:text-gold-400 hover:bg-navy-900/60 transition-all font-medium"
        >
          <span>View Customer Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-gold-500" />
        </a>

        {/* User Card & Logout */}
        <div className="pt-2.5 border-t border-navy-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-navy-900 to-navy-800 border border-gold-500/40 text-gold-400 flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-xs">
              {(admin?.name || "V")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-100 truncate">
                {admin?.name || "Operations Staff"}
              </div>
              <div className="text-[10px] text-slate-400 truncate font-mono">
                {admin?.email || "admin@savee.in"}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out of Savee"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-navy-900 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
