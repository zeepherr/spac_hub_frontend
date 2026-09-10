import React, { useRef, useEffect, useState } from "react";
import {
  X,
  MapPin,
  Tag,
  Sparkles,
  Calendar,
  Layers,
  ShoppingBag,
  ZoomIn,
} from "lucide-react";
import { useListingDetail } from "@/hook/listing/useListingDetail";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image";

// Modal ต้องทึบกว่าการ์ดปกติหน่อย เพราะลอยทับเนื้อหาเยอะ (เดียวกับ GLASS_MODAL ที่ใช้ใน OrderDetail.jsx)
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";

export default function ListingDetailModal({ isOpen, onClose, listingId }) {
  const modalBodyRef = useRef(null);

  // State and Ref for Image Zoom system
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [isZoomEnabled, setIsZoomEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [showZoom, setShowZoom] = useState(false);

  // Calculate coordinates to keep cursor at 100% focus point
  const [zoomData, setZoomData] = useState({
    lensX: 0,
    lensY: 0,
    bgX: 0,
    bgY: 0,
    imgWidth: 0,
    imgHeight: 0,
  });

  const { data: listing, isLoading } = useListingDetail(listingId, {
    enabled: Boolean(isOpen && listingId),
  });

  useEffect(() => {
    if (isOpen && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
    setShowZoom(false);
  }, [isOpen, listingId]);

  const handleMouseMove = (e) => {
    if (!isZoomEnabled || !containerRef.current || !imgRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imgRef.current.getBoundingClientRect();

    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    const imgX = e.clientX - imgRect.left;
    const imgY = e.clientY - imgRect.top;

    if (imgX < 0 || imgY < 0 || imgX > imgRect.width || imgY > imgRect.height) {
      setShowZoom(false);
      return;
    }

    const bgX = imgX * zoomLevel - 70;
    const bgY = imgY * zoomLevel - 70;

    setZoomData({
      lensX: mouseX,
      lensY: mouseY,
      bgX,
      bgY,
      imgWidth: imgRect.width,
      imgHeight: imgRect.height,
    });
    setShowZoom(true);
  };

  if (!isOpen) return null;

  const images = listing?.images || [];
  const coverImage = images.find((img) => img.isCover) || images[0];

  let mainImageUrl = DEFAULT_IMAGE;
  const rawUrl = coverImage?.imageUrl || coverImage?.url;
  const rawKey = coverImage?.imageKey || coverImage?.key;

  if (rawUrl) {
    mainImageUrl = rawUrl;
  } else if (rawKey) {
    mainImageUrl = rawKey.startsWith("http")
      ? rawKey
      : `${R2_PUBLIC_URL}/${rawKey}`;
  }

  const formatCondition = (condition) => {
    const map = {
      LIKE_NEW: "Like New",
      GOOD: "Good Condition",
      FAIR: "Fair Condition",
      POOR: "Used / Worn",
    };
    return map[condition] || condition || "Unspecified";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] overflow-y-auto"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden ${GLASS_MODAL}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200/70 flex items-center justify-between bg-white/30">
          <div className="flex items-center gap-2 text-neutral-900">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-lg">Listing Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          ref={modalBodyRef}
          className="p-6 overflow-y-auto flex-1 space-y-6"
        >
          {isLoading ? (
            <div className="space-y-4 py-8">
              <div className="skeleton h-64 w-full rounded-2xl" />
              <div className="skeleton h-8 w-3/4" />
              <div className="skeleton h-6 w-1/3" />
              <div className="skeleton h-20 w-full rounded-xl" />
            </div>
          ) : !listing ? (
            <div className="text-center py-12 text-red-500 space-y-2">
              <p className="font-bold">Unable to load product details</p>
              <p className="text-xs text-neutral-500">
                Please check your network connection and try again.
              </p>
            </div>
          ) : (
            <>
              {/* 🔍 Image Magnifier Control Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-neutral-200/70">
                {/* Zoom Toggle Controller */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isZoomEnabled}
                    onChange={(e) => {
                      setIsZoomEnabled(e.target.checked);
                      if (!e.target.checked) setShowZoom(false);
                    }}
                    className="toggle toggle-success toggle-md"
                  />

                  <div className="flex items-center gap-2">
                    <ZoomIn
                      className={`w-4 h-4 transition-colors ${isZoomEnabled ? "text-emerald-500" : "text-neutral-400"}`}
                    />
                    <span
                      className={`text-sm font-bold transition-colors ${isZoomEnabled ? "text-neutral-900" : "text-neutral-500"}`}
                    >
                      Image Magnifier
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-all ${
                        isZoomEnabled
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {isZoomEnabled ? "ON" : "OFF"}
                    </span>
                  </div>
                </label>

                {/* Zoom Level Selectors x3, x7, x10 */}
                {isZoomEnabled && (
                  <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-neutral-200/70">
                    <span className="text-xs font-bold pl-2 pr-1 text-neutral-500">
                      Zoom:
                    </span>
                    {[3, 7, 10].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setZoomLevel(level)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-extrabold transition-all cursor-pointer ${
                          zoomLevel === level
                            ? "bg-emerald-500 text-white shadow-md scale-105"
                            : "text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        x{level}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 🔍 Main Image Container */}
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setShowZoom(false)}
                className={`relative h-[300px] sm:h-[320px] w-full rounded-2xl overflow-hidden border border-neutral-200/70 bg-neutral-100/50 flex items-center justify-center group select-none ${
                  isZoomEnabled ? "cursor-crosshair" : "cursor-default"
                }`}
              >
                <img
                  ref={imgRef}
                  src={mainImageUrl}
                  alt={listing.title || "Product"}
                  className="max-h-full max-w-full object-contain p-2"
                />

                {isZoomEnabled && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 opacity-80 group-hover:opacity-0 transition-opacity pointer-events-none">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Hover to zoom x{zoomLevel}</span>
                  </div>
                )}

                {/* Lens */}
                {isZoomEnabled && showZoom && (
                  <div
                    className="absolute rounded-full border-2 border-white pointer-events-none z-20 overflow-hidden"
                    style={{
                      width: "140px",
                      height: "140px",
                      top: `${zoomData.lensY - 70}px`,
                      left: `${zoomData.lensX - 70}px`,
                      backgroundImage: `url(${mainImageUrl})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${zoomData.imgWidth * zoomLevel}px ${zoomData.imgHeight * zoomLevel}px`,
                      backgroundPosition: `-${zoomData.bgX}px -${zoomData.bgY}px`,
                      boxShadow:
                        "0 10px 28px rgba(0,0,0,0.45), inset 0 0 10px rgba(0,0,0,0.25)",
                    }}
                  />
                )}
              </div>

              {/* Title & Price */}
              <div className="space-y-2 border-b border-neutral-200/70 pb-4">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {listing.title || "Untitled Product"}
                </h2>
                <p className="text-3xl font-black text-orange-500">
                  {listing.price
                    ? `฿${Number(listing.price).toLocaleString()}`
                    : "-"}
                </p>
              </div>

              {/* Product Specifications / Attributes */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-white/40 backdrop-blur-sm border border-neutral-200/50 rounded-xl space-y-1">
                  <span className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
                    <Tag className="w-3.5 h-3.5 text-orange-500" /> Brand /
                    Model
                  </span>
                  <p className="font-bold text-neutral-900">
                    {listing.brand || "-"}{" "}
                    {listing.model ? `/ ${listing.model}` : ""}
                  </p>
                </div>

                <div className="p-3 bg-white/40 backdrop-blur-sm border border-neutral-200/50 rounded-xl space-y-1">
                  <span className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
                    <Layers className="w-3.5 h-3.5 text-orange-500" /> Category
                  </span>
                  <p className="font-bold text-neutral-900">
                    {listing.category?.name || "Unspecified"}
                  </p>
                </div>

                <div className="p-3 bg-white/40 backdrop-blur-sm border border-neutral-200/50 rounded-xl space-y-1">
                  <span className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" /> Location
                  </span>
                  <p className="font-bold text-neutral-900">
                    {listing.location || "Unspecified"}
                  </p>
                </div>

                <div className="p-3 bg-white/40 backdrop-blur-sm border border-neutral-200/50 rounded-xl space-y-1">
                  <span className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />{" "}
                    Condition
                  </span>
                  <p className="font-bold text-neutral-900">
                    {formatCondition(listing.estimatedCondition)}
                  </p>
                </div>
              </div>

              {/* AI Score */}
              {listing.estimatedScore != null && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 fill-amber-500/20" />
                    AI Condition Analysis
                  </span>
                  <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-black text-white">
                    {Number(listing.estimatedScore).toFixed(1)} / 100 PTS
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-neutral-900">
                  Product Description
                </h4>
                <p className="text-sm text-neutral-600 whitespace-pre-line leading-relaxed bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-neutral-200/70">
                  {listing.description || "No additional description provided."}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200/70 bg-white/30 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl px-6 py-2.5 text-sm font-bold text-neutral-600 transition hover:bg-neutral-100/70"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
