"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, ArrowRight, AlertCircle, KeyRound } from "lucide-react";
import { useAdminAuthStore } from "../../state/admin-auth.store";
import { SaveeVerticalLogo } from "../../components/brand/SaveeLogo";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error } = useAdminAuthStore();

  const [email, setEmail] = useState("admin@savee.in");
  const [password, setPassword] = useState("Savee@Atelier2026");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) {
      router.push("/");
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@savee.in");
    setPassword("Savee@Atelier2026");
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative z-10">
        {/* Atelier Monogram Header */}
        <div className="bg-navy-900 p-8 text-center border-b border-navy-800 flex flex-col items-center">
          <SaveeVerticalLogo variant="white" className="h-16 w-auto mb-1" />
          <p className="text-xs uppercase tracking-widest text-slate-300 mt-2 font-medium">
            Atelier & Brand Operations Portal
          </p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Internal Staff Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authorized personnel access to live fulfillment and catalog database.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@savee.in"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-navy-900 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs text-gold-600 hover:text-gold-700 font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-gold-500" />
                  <span>Fill Credentials</span>
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-navy-900 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group border border-navy-800 disabled:opacity-50 mt-2"
            >
              <span>{submitting ? "Authenticating..." : "Enter Brand Portal"}</span>
              <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>End-to-end encrypted session • Savee Luxury D2C</span>
          </div>
        </div>
      </div>
    </div>
  );
}
