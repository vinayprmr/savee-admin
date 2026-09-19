"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "../../state/admin-auth.store";
import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAdminAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
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
    return null;
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
