"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  Film,
  Volume2,
  Upload,
  Loader2,
} from "lucide-react";
import { CreateImagePayload } from "../../domain/models";
import { AdminService } from "../../services/admin.service";

interface GarmentMediaSectionProps {
  images: CreateImagePayload[];
  onChange: (images: CreateImagePayload[]) => void;
  title?: string;
  onError?: (msg: string) => void;
}

export function GarmentMediaSection({
  images,
  onChange,
  title = "",
  onError,
}: GarmentMediaSectionProps) {
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newThumbnailUrl, setNewThumbnailUrl] = useState("");
  const [newHasAudio, setNewHasAudio] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingMedia(true);

    try {
      const uploaded: CreateImagePayload[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await AdminService.uploadMedia(file);
        const isVid = res.mediaType === "video";
        uploaded.push({
          url: res.url,
          altText: title || file.name.replace(/\.[^/.]+$/, ""),
          isPrimary: images.length === 0 && uploaded.length === 0,
          mediaType: isVid ? "video" : "image",
          hasAudio: isVid ? newHasAudio : false,
        });
      }
      onChange([...images, ...uploaded]);
    } catch (err: any) {
      console.error("Failed to upload media:", err);
      if (onError) {
        onError(err?.message || "Failed to upload file. Please try again.");
      }
    } finally {
      setIsUploadingMedia(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddImage = () => {
    const trimmedUrl = newImageUrl.trim();
    if (!trimmedUrl) return;

    const isVideo = mediaType === "video" || /\.(mp4|webm|mov)(\?.*)?$/i.test(trimmedUrl);
    const posterUrl = newThumbnailUrl.trim() || undefined;

    onChange([
      ...images,
      {
        url: trimmedUrl,
        altText: title || (isVideo ? "Product Video" : "Product Image"),
        isPrimary: images.length === 0,
        mediaType: isVideo ? "video" : "image",
        thumbnailUrl: isVideo
          ? posterUrl ||
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
          : undefined,
        hasAudio: isVideo ? newHasAudio : false,
      },
    ]);

    setNewImageUrl("");
    setNewThumbnailUrl("");
    setNewHasAudio(false);
    setMediaType("image");
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onChange(copy);
  };

  const handleSetPrimaryImage = (index: number) => {
    onChange(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((img) => img.isPrimary)) {
      next[0].isPrimary = true;
    }
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gold-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            High-Resolution Visual Assets & Video
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          {images.length} {images.length === 1 ? "asset" : "assets"} linked
        </span>
      </div>

      {/* Media Type Switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg max-w-xs">
        <button
          type="button"
          onClick={() => setMediaType("image")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
            mediaType === "image"
              ? "bg-white text-navy-950 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Still Photo</span>
        </button>
        <button
          type="button"
          onClick={() => setMediaType("video")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
            mediaType === "video"
              ? "bg-white text-gold-600 shadow-2xs font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Video Drape</span>
        </button>
      </div>

      {/* Input Fields */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingMedia}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isUploadingMedia ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-600" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-gold-600" />
            )}
            <span>{isUploadingMedia ? "Uploading..." : "Upload from Device"}</span>
          </button>

          <div className="flex-1 flex gap-2">
            <input
              type="url"
              placeholder={
                mediaType === "video"
                  ? "Or paste video URL (.mp4, .webm)..."
                  : "Or paste high-res image URL..."
              }
              value={newImageUrl}
              onChange={(e) => {
                const val = e.target.value;
                setNewImageUrl(val);
                if (/\.(mp4|webm|mov)(\?.*)?$/i.test(val)) {
                  setMediaType("video");
                }
              }}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {mediaType === "video" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <input
              type="url"
              placeholder="Poster / Cover Image URL (displayed on cards & thumbnail)..."
              value={newThumbnailUrl}
              onChange={(e) => setNewThumbnailUrl(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
            />
            <label className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={newHasAudio}
                onChange={(e) => setNewHasAudio(e.target.checked)}
                className="rounded border-slate-300 text-gold-500 focus:ring-gold-500"
              />
              <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Video includes sound / audio track</span>
            </label>
          </div>
        )}
      </div>

      {/* Thumbnails preview & sequence management */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.length === 0 ? (
          <div className="col-span-full py-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">No media assets added yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Upload photos or videos from your computer, or paste public URLs above.
            </p>
          </div>
        ) : (
          images.map((img, idx) => {
            const isVid = img.mediaType === "video";
            const coverSrc = isVid ? img.thumbnailUrl || img.url : img.url;

            return (
              <div
                key={idx}
                className={`relative rounded-xl border overflow-hidden group transition-all ${
                  img.isPrimary
                    ? "ring-2 ring-gold-500 border-gold-500 shadow-xs"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                {/* Image / Video thumbnail */}
                <div className="relative w-full h-24 bg-slate-900 overflow-hidden">
                  <img
                    src={coverSrc}
                    alt={img.altText || `Garment asset ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isVid && (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-gold-400 text-[10px] font-semibold flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      <span>Video</span>
                      {img.hasAudio && <Volume2 className="w-2.5 h-2.5 text-white/80" />}
                    </div>
                  )}
                  <div className="absolute top-1.5 right-1.5 px-1 rounded bg-black/60 text-white text-[9px] font-mono">
                    #{idx + 1}
                  </div>
                </div>

                {/* Card Controls */}
                <div className="p-1.5 bg-white/95 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-0.5">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, "left")}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                        title="Move Earlier"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, "right")}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                        title="Move Later"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSetPrimaryImage(idx)}
                    className={`font-semibold flex items-center gap-1 ${
                      img.isPrimary
                        ? "text-gold-600 font-bold"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {img.isPrimary && <Check className="w-3 h-3" />}
                    {img.isPrimary ? "Primary" : "Set Primary"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-slate-300 hover:text-rose-600 transition-colors p-0.5"
                    title="Remove media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
