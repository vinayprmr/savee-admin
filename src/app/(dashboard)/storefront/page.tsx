"use client";

import React, { useEffect, useState } from "react";
import {
  SlidersHorizontal,
  Save,
  Check,
  RefreshCw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Plus,
  X,
  AlertCircle,
  HelpCircle,
  Search,
  Quote,
} from "lucide-react";
import { StorefrontSettings } from "../../../domain/models";
import { AdminService } from "../../../services/admin.service";

export default function StorefrontCMSPage() {
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New trending search input
  const [newTag, setNewTag] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.getStorefrontSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load storefront settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError(null);
    try {
      const updated = await AdminService.updateStorefrontSettings(settings);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || "Failed to save storefront settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !settings) return;
    const clean = newTag.trim();
    if (settings.trending_searches.includes(clean)) {
      setNewTag("");
      return;
    }
    setSettings({
      ...settings,
      trending_searches: [...settings.trending_searches, clean],
    });
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      trending_searches: settings.trending_searches.filter((t) => t !== tagToRemove),
    });
  };

  if (loading || !settings) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gold-500 mb-2" />
        Loading storefront content configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner & Save Action */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Storefront Content & Marketing CMS</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-navy-950 mt-1">
            Dynamic Storefront Controls
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify homepage banners, toggle experimental features, and update live trending tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSettings}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reload from server"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-navy-900" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2 ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-navy-950 hover:bg-navy-900 text-white"
            } disabled:opacity-50`}
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving Changes..." : saved ? "Published Live!" : "Publish to Store"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Feature Flags & Site Controls */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-gold-500" />
          <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">
            1. Feature Flags & Site Visibility
          </h3>
        </div>

        {/* Concierge Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">
                Styling Concierge Feature
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                  settings.enable_concierge
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {settings.enable_concierge ? "Visible to Customers" : "Hidden / Inactive"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Controls the visibility of the Concierge drawer on the customer storefront.
              Keep this <strong>OFF</strong> to hide it from shoppers while preserving all code for future activation.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setSettings({
                ...settings,
                enable_concierge: !settings.enable_concierge,
              })
            }
            className={`p-1 rounded transition-colors ${
              settings.enable_concierge
                ? "text-emerald-600 hover:text-emerald-700"
                : "text-slate-400 hover:text-slate-500"
            }`}
          >
            {settings.enable_concierge ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Announcement Bar Toggle & Text */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">
                  Top Announcement Ticker
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    settings.announcement_active
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {settings.announcement_active ? "Ticker Active" : "Ticker Disabled"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Displays promotional messages, shipping notices, or sale alerts at the very top of the customer store.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  announcement_active: !settings.announcement_active,
                })
              }
              className={`p-1 rounded transition-colors ${
                settings.announcement_active
                  ? "text-emerald-600 hover:text-emerald-700"
                  : "text-slate-400 hover:text-slate-500"
              }`}
            >
              {settings.announcement_active ? (
                <ToggleRight className="w-8 h-8" />
              ) : (
                <ToggleLeft className="w-8 h-8" />
              )}
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Announcement Message
            </label>
            <input
              type="text"
              value={settings.announcement_text}
              onChange={(e) =>
                setSettings({ ...settings, announcement_text: e.target.value })
              }
              placeholder="e.g. Free Shipping Across India On Orders Above ₹2,999 • Express Delivery"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
          </div>
        </div>
      </div>

      {/* 2. Hero Billboard (Homepage Header) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-gold-500" />
          <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">
            2. Hero Showcase Billboard
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Main Headline
            </label>
            <input
              type="text"
              value={settings.hero_headline}
              onChange={(e) =>
                setSettings({ ...settings, hero_headline: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Subheadline / Brand Copy
            </label>
            <textarea
              rows={2}
              value={settings.hero_subheadline}
              onChange={(e) =>
                setSettings({ ...settings, hero_subheadline: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <span className="text-[11px] font-semibold uppercase text-slate-700">
              Primary Button (CTA)
            </span>
            <input
              type="text"
              placeholder="Button Label"
              value={settings.hero_primary_cta_text}
              onChange={(e) =>
                setSettings({ ...settings, hero_primary_cta_text: e.target.value })
              }
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
            />
            <input
              type="text"
              placeholder="Target Link (e.g. /shop)"
              value={settings.hero_primary_cta_link}
              onChange={(e) =>
                setSettings({ ...settings, hero_primary_cta_link: e.target.value })
              }
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <span className="text-[11px] font-semibold uppercase text-slate-700">
              Secondary Button (CTA)
            </span>
            <input
              type="text"
              placeholder="Button Label"
              value={settings.hero_secondary_cta_text}
              onChange={(e) =>
                setSettings({ ...settings, hero_secondary_cta_text: e.target.value })
              }
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
            />
            <input
              type="text"
              placeholder="Target Link (e.g. /collection/festive-edit)"
              value={settings.hero_secondary_cta_link}
              onChange={(e) =>
                setSettings({ ...settings, hero_secondary_cta_link: e.target.value })
              }
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
            />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-2">
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Hero Trust Badges (3 Pillars)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={settings.hero_badge_1}
              onChange={(e) =>
                setSettings({ ...settings, hero_badge_1: e.target.value })
              }
              placeholder="Badge 1"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white"
            />
            <input
              type="text"
              value={settings.hero_badge_2}
              onChange={(e) =>
                setSettings({ ...settings, hero_badge_2: e.target.value })
              }
              placeholder="Badge 2"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white"
            />
            <input
              type="text"
              value={settings.hero_badge_3}
              onChange={(e) =>
                setSettings({ ...settings, hero_badge_3: e.target.value })
              }
              placeholder="Badge 3"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Trending Searches Manager */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Search className="w-4 h-4 text-gold-500" />
          <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">
            3. Trending Searches Tags (Search Modal)
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          These keyword tags appear immediately when customers open the search modal on the store.
        </p>

        {/* Existing Tags Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {settings.trending_searches.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="p-0.5 text-slate-400 hover:text-rose-600 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add Tag Form */}
        <div className="flex items-center gap-2 pt-2 sm:w-96">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Type a new search term (e.g. Kurta Sets)..."
            className="flex-1 px-3 py-2 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded border border-slate-300 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tag</span>
          </button>
        </div>
      </div>

      {/* 4. Brand Manifesto & Featured Collection */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Quote className="w-4 h-4 text-gold-500" />
          <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">
            4. Editorial Quote & Featured Collection
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Editorial Brand Quote
            </label>
            <textarea
              rows={3}
              value={settings.manifesto_quote}
              onChange={(e) =>
                setSettings({ ...settings, manifesto_quote: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Featured Collection Slug (Homepage Banner)
            </label>
            <input
              type="text"
              value={settings.featured_collection_slug}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  featured_collection_slug: e.target.value,
                })
              }
              placeholder="e.g. banaras-heritage or festive-edit"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-mono focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Controls which collection the "Featured Collection" banner links to on the homepage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
