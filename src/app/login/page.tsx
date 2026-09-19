"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, ArrowRight, AlertCircle, KeyRound } from "lucide-react";
import { useAdminAuthStore } from "../../state/admin-auth.store";

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
        <div className="bg-navy-900 p-8 text-center border-b border-navy-800">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-widest text-gold-400">
            SAVEE
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-300 mt-1 font-medium">
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
                Atelier Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@savee.in"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-950 focus:border-navy-950"
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
                  className="text-[11px] text-gold-600 hover:text-gold-700 font-medium inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  Fill Credentials
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-950 focus:border-navy-950"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-navy-950 hover:bg-navy-900 text-white rounded-lg text-sm font-medium transition-colors shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>{submitting ? "Authenticating..." : "Enter Atelier Portal"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
