"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuthStore } from "../../state/admin-auth.store";
import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";
import { Sparkles, ArrowRight } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAdminAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace("/login");
      const timer = setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-200">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-gold-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 font-serif text-lg tracking-widest text-gold-300">SAVEE</div>
        <div className="text-xs text-slate-400 tracking-wider mt-1">Connecting to Atelier Core...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-200 p-4">
        <div className="text-center max-w-sm">
          <div className="font-serif text-xl tracking-widest text-gold-300 mb-2">SAVEE OPERATIONS</div>
          <p className="text-xs text-slate-400 mb-4">Authentication required to access operations.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-navy-950 font-medium text-xs rounded-lg transition-colors"
          >
            <span>Go to Staff Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
