"use client";

import React, { useEffect, useState, useRef } from "react";
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
  Trash2,
  Upload,
  Image as ImageIcon,
  Compass,
  Camera,
  Mail,
  Phone,
  Truck,
  Globe,
  Loader2,
} from "lucide-react";
import {
  StorefrontSettings,
  OccasionCMSItem,
  CommunityGalleryCMSItem,
  NavItemCMSItem,
} from "../../../domain/models";
import { AdminService } from "../../../services/admin.service";

export default function StorefrontCMSPage() {
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<{ section: "occasion" | "community"; index: number } | null>(null);

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

  // Occasions Handlers
  const handleAddOccasion = () => {
    if (!settings) return;
    const current = settings.occasions || [];
    setSettings({
      ...settings,
      occasions: [
        ...current,
        {
          title: "New Occasion",
          subtitle: "Curated Edits",
          image: "/brand/garment-placeholder.svg",
          href: "/shop",
        },
      ],
    });
  };

  const handleUpdateOccasion = (index: number, patch: Partial<OccasionCMSItem>) => {
    if (!settings) return;
    const current = [...(settings.occasions || [])];
    current[index] = { ...current[index], ...patch };
    setSettings({ ...settings, occasions: current });
  };

  const handleRemoveOccasion = (index: number) => {
    if (!settings) return;
    const current = [...(settings.occasions || [])];
    current.splice(index, 1);
    setSettings({ ...settings, occasions: current });
  };

  // Navigation Links Handlers
  const handleAddNavItem = () => {
    if (!settings) return;
    const current = settings.nav_items || [];
    setSettings({
      ...settings,
      nav_items: [
        ...current,
        {
          label: "New Link",
          href: "/shop",
          badge: "",
          highlight: false,
        },
      ],
    });
  };

  const handleUpdateNavItem = (index: number, patch: Partial<NavItemCMSItem>) => {
    if (!settings) return;
    const current = [...(settings.nav_items || [])];
    current[index] = { ...current[index], ...patch };
    setSettings({ ...settings, nav_items: current });
  };

  const handleRemoveNavItem = (index: number) => {
    if (!settings) return;
    const current = [...(settings.nav_items || [])];
    current.splice(index, 1);
    setSettings({ ...settings, nav_items: current });
  };

  // Reset to Skeleton Handler
  const [resetting, setResetting] = useState(false);
  const handleResetSkeleton = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all storefront settings to a clean blank canvas? All template text, headlines, and starter occasions will be cleared."
      )
    ) {
      return;
    }
    try {
      setResetting(true);
      const clean = await AdminService.resetStorefrontSettings();
      setSettings(clean);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      alert("Storefront settings have been reset to a 100% clean skeleton!");
    } catch (err: any) {
      alert(err.message || "Failed to reset storefront settings");
    } finally {
      setResetting(false);
    }
  };

  const handleOccasionImageUpload = async (index: number, file: File) => {
    if (!settings) return;
    try {
      setUploadingIndex({ section: "occasion", index });
      const res = await AdminService.uploadMedia(file);
      handleUpdateOccasion(index, { image: res.url });
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setUploadingIndex(null);
    }
  };

  // Community Gallery Handlers
  const handleAddCommunityItem = () => {
    if (!settings) return;
    const current = settings.community_gallery || [];
    setSettings({
      ...settings,
      community_gallery: [
        ...current,
        {
          image: "/brand/garment-placeholder.svg",
          caption: "Savee Heritage Silk",
          link: "https://instagram.com",
        },
      ],
    });
  };

  const handleUpdateCommunityItem = (index: number, patch: Partial<CommunityGalleryCMSItem>) => {
    if (!settings) return;
    const current = [...(settings.community_gallery || [])];
    current[index] = { ...current[index], ...patch };
    setSettings({ ...settings, community_gallery: current });
  };

  const handleRemoveCommunityItem = (index: number) => {
    if (!settings) return;
    const current = [...(settings.community_gallery || [])];
    current.splice(index, 1);
    setSettings({ ...settings, community_gallery: current });
  };

  const handleCommunityImageUpload = async (index: number, file: File) => {
    if (!settings) return;
    try {
      setUploadingIndex({ section: "community", index });
      const res = await AdminService.uploadMedia(file);
      handleUpdateCommunityItem(index, { image: res.url });
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setUploadingIndex(null);
    }
  };

  if (loading && !settings) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gold-500 mb-2" />
        Loading storefront content configuration...
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white border border-rose-200 rounded-xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Failed to Load Storefront Settings</h3>
          <p className="text-xs text-rose-600 mt-1">{error}</p>
        </div>
        <button
          onClick={fetchSettings}
          className="px-4 py-2 bg-navy-950 text-white rounded-lg text-xs font-medium hover:bg-navy-900 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white border border-slate-200 rounded-xl shadow-xs text-center space-y-4">
        <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
        <p className="text-xs text-slate-600">No storefront configuration found.</p>
        <button
          onClick={fetchSettings}
          className="px-4 py-2 bg-navy-950 text-white rounded-lg text-xs font-medium hover:bg-navy-900 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
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
            onClick={handleResetSkeleton}
            disabled={resetting || saving}
            className="px-3.5 py-2.5 rounded-lg text-xs font-semibold border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
            title="Wipe all template content and reset to empty skeleton"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{resetting ? "Resetting..." : "Reset to Blank Canvas"}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || resetting}
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

      {/* 2. Custom Header Navigation Links (CMS Managed) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gold-500" />
            <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">
              2. Custom Header Navigation Links
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddNavItem}
            className="px-3 py-1.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Nav Link</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Configure custom links in your top storefront navigation bar (e.g. &ldquo;New In&rdquo;, &ldquo;Collections&rdquo;, &ldquo;Sale&rdquo;). Garment categories automatically display alongside these.
        </p>

        {(!settings.nav_items || settings.nav_items.length === 0) ? (
          <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">No custom navigation links configured</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click &ldquo;Add Nav Link&rdquo; to add custom links, or rely solely on dynamic garment categories.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {settings.nav_items.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-[10px] font-semibold uppercase text-slate-600 mb-0.5">Link Label</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateNavItem(idx, { label: e.target.value })}
                    placeholder="e.g. New Arrivals"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                  />
                </div>
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-[10px] font-semibold uppercase text-slate-600 mb-0.5">Target URL</label>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => handleUpdateNavItem(idx, { href: e.target.value })}
                    placeholder="e.g. /shop?isNewArrival=true or /sale"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div className="w-full sm:w-28">
                  <label className="block text-[10px] font-semibold uppercase text-slate-600 mb-0.5">Badge (Optional)</label>
                  <input
                    type="text"
                    value={item.badge || ""}
                    onChange={(e) => handleUpdateNavItem(idx, { badge: e.target.value })}
                    placeholder="e.g. Hot"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                  />
                </div>
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 pt-4 sm:pt-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.highlight || false}
                      onChange={(e) => handleUpdateNavItem(idx, { highlight: e.target.checked })}
                      className="rounded border-slate-300 text-navy-950 focus:ring-navy-900"
                    />
                    <span className="text-[11px]">Highlight</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveNavItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Remove link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Hero Showcase Billboard */}
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
              Eyebrow Tagline
            </label>
            <input
              type="text"
              value={settings.hero_eyebrow || ""}
              onChange={(e) =>
                setSettings({ ...settings, hero_eyebrow: e.target.value })
              }
              placeholder="e.g. Festive Elegance & Modern Heritage"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
          </div>

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
            <div className="space-y-1">
              <input
                type="text"
                value={settings.hero_badge_1}
                onChange={(e) =>
                  setSettings({ ...settings, hero_badge_1: e.target.value })
                }
                placeholder="Pillar 1 Title (e.g. 100% Pure Handloom)"
                className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-medium"
              />
              <input
                type="text"
                value={settings.hero_badge_1_subtitle || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_badge_1_subtitle: e.target.value })
                }
                placeholder="Pillar 1 Subtitle (e.g. Certified Silk Mark)"
                className="w-full px-3 py-1.5 text-[11px] rounded border border-slate-200 bg-slate-50 text-slate-600"
              />
            </div>
            <div className="space-y-1">
              <input
                type="text"
                value={settings.hero_badge_2}
                onChange={(e) =>
                  setSettings({ ...settings, hero_badge_2: e.target.value })
                }
                placeholder="Pillar 2 Title (e.g. Bespoke Tailoring)"
                className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-medium"
              />
              <input
                type="text"
                value={settings.hero_badge_2_subtitle || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_badge_2_subtitle: e.target.value })
                }
                placeholder="Pillar 2 Subtitle (e.g. Custom fit on demand)"
                className="w-full px-3 py-1.5 text-[11px] rounded border border-slate-200 bg-slate-50 text-slate-600"
              />
            </div>
            <div className="space-y-1">
              <input
                type="text"
                value={settings.hero_badge_3}
                onChange={(e) =>
                  setSettings({ ...settings, hero_badge_3: e.target.value })
                }
                placeholder="Pillar 3 Title (e.g. Pan-India Express)"
                className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-medium"
              />
              <input
                type="text"
                value={settings.hero_badge_3_subtitle || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_badge_3_subtitle: e.target.value })
                }
                placeholder="Pillar 3 Subtitle (e.g. Complimentary on ₹2,999+)"
                className="w-full px-3 py-1.5 text-[11px] rounded border border-slate-200 bg-slate-50 text-slate-600"
              />
            </div>
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

      {/* 5. Brand Occasions Showcase */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-gold-500" />
            <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">
              5. Occasions & Curated Edits Showcase
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddOccasion}
            className="px-3 py-1.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Occasion</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Curated visual cards that appear on the storefront homepage under the "Shop by Occasion" section.
        </p>

        {(!settings.occasions || settings.occasions.length === 0) ? (
          <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">No occasions configured</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Occasion" to create custom curation tiles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.occasions.map((occ, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Occasion #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOccasion(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Remove occasion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-slate-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={occ.title}
                      onChange={(e) => handleUpdateOccasion(idx, { title: e.target.value })}
                      placeholder="e.g. Royal Weddings"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-slate-600 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={occ.subtitle}
                      onChange={(e) => handleUpdateOccasion(idx, { subtitle: e.target.value })}
                      placeholder="e.g. Bridal & Ceremonial"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-600 mb-1">Target Link (href)</label>
                  <input
                    type="text"
                    value={occ.href}
                    onChange={(e) => handleUpdateOccasion(idx, { href: e.target.value })}
                    placeholder="/shop?occasion=wedding"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-600 mb-1">Cover Image</label>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden flex-shrink-0">
                      {occ.image ? (
                        <img src={occ.image} alt={occ.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400 m-auto mt-3.5" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={occ.image}
                      onChange={(e) => handleUpdateOccasion(idx, { image: e.target.value })}
                      placeholder="Image URL or upload..."
                      className="flex-1 px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                    <label className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 shrink-0">
                      {uploadingIndex?.section === "occasion" && uploadingIndex?.index === idx ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-600" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-gold-600" />
                      )}
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleOccasionImageUpload(idx, file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Community Gallery & Social Proof */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-gold-500" />
            <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">
              6. Community Gallery / #SaveeWomen
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  community_gallery_active: !settings.community_gallery_active,
                })
              }
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                settings.community_gallery_active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}
            >
              {settings.community_gallery_active ? (
                <ToggleRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-slate-400" />
              )}
              <span>{settings.community_gallery_active ? "Section Visible" : "Section Hidden"}</span>
            </button>

            <button
              type="button"
              onClick={handleAddCommunityItem}
              className="px-3 py-1.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Post</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Authentic styling photos featuring patrons draped in Savee couture. Shows up as the Instagram editorial gallery on the homepage.
        </p>

        {(!settings.community_gallery || settings.community_gallery.length === 0) ? (
          <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">No community posts configured</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Post" to feature patrons and real clients.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {settings.community_gallery.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Post #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCommunityItem(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Remove post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt="Community" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-5 h-5 text-slate-400 m-auto mt-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => handleUpdateCommunityItem(idx, { image: e.target.value })}
                      placeholder="Image URL..."
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                    />
                    <label className="w-full py-1 bg-white border border-slate-300 rounded text-center text-[11px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1">
                      {uploadingIndex?.section === "community" && uploadingIndex?.index === idx ? (
                        <Loader2 className="w-3 h-3 animate-spin text-gold-600" />
                      ) : (
                        <Upload className="w-3 h-3 text-gold-600" />
                      )}
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCommunityImageUpload(idx, file);
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-600 mb-1">Caption / Patron Handle</label>
                  <input
                    type="text"
                    value={item.caption || ""}
                    onChange={(e) => handleUpdateCommunityItem(idx, { caption: e.target.value })}
                    placeholder="e.g. @ananya.s in Banarasi Katan"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-600 mb-1">Social Post Link</label>
                  <input
                    type="text"
                    value={item.link || ""}
                    onChange={(e) => handleUpdateCommunityItem(idx, { link: e.target.value })}
                    placeholder="https://instagram.com/p/..."
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono text-[11px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Store Coordinates & Support Channels */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="w-4 h-4 text-gold-500" />
          <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">
            7. Brand Coordinates & Support Channels
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          Displayed dynamically across the storefront footer, contact page, order confirmations, and customer care drawers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Support Email
            </label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={settings.support_email || ""}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                placeholder="concierge@savee.in"
                className="flex-1 px-3 py-2 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Support Phone / Helpline
            </label>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={settings.support_phone || ""}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="flex-1 px-3 py-2 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              WhatsApp Concierge
            </label>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500" />
              <input
                type="text"
                value={settings.support_whatsapp || ""}
                onChange={(e) => setSettings({ ...settings, support_whatsapp: e.target.value })}
                placeholder="+91 98765 43210"
                className="flex-1 px-3 py-2 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Registered Atelier / Studio Address
            </label>
            <input
              type="text"
              value={settings.support_address || ""}
              onChange={(e) => setSettings({ ...settings, support_address: e.target.value })}
              placeholder="Savee Enterprises, Mumbai, India"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={settings.social_instagram || ""}
              onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
              placeholder="https://instagram.com/savee"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-mono text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* 8. Delivery & Checkout Thresholds */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Truck className="w-4 h-4 text-gold-500" />
          <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">
            8. Delivery & Checkout Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Free Shipping Order Threshold (₹)
            </label>
            <input
              type="number"
              value={settings.free_shipping_threshold ?? 2999}
              onChange={(e) =>
                setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Orders with cart value equal to or above this amount qualify for zero delivery fee.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Standard Shipping Fee (₹)
            </label>
            <input
              type="number"
              value={settings.standard_shipping_fee ?? 199}
              onChange={(e) =>
                setSettings({ ...settings, standard_shipping_fee: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Standard delivery fee added at checkout for carts below the threshold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
