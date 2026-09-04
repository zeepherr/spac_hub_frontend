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

export default function ListingDetailModal({ isOpen, onClose, listingId }) {
  const modalBodyRef = useRef(null);

  // State และ Ref สำหรับระบบแว่นขยาย (Image Zoom)
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [isZoomEnabled, setIsZoomEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [showZoom, setShowZoom] = useState(false);

  // คำนวณพิกัดให้ปลายเมาส์ตรงจุดโฟกัส 100%
  const [zoomData, setZoomData] = useState({
    lensX: 0,
    lensY: 0,
    bgX: 0,
    bgY: 0,
    imgWidth: 0,
    imgHeight: 0,
  });

  const {
    data: listing,
    isLoading,
  } = useListingDetail(listingId, {
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
      LIKE_NEW: "เหมือนใหม่",
      GOOD: "สภาพดี",
      FAIR: "สภาพปานกลาง",
      POOR: "สภาพใช้งาน",
    };
    return map[condition] || condition || "ไม่ระบุ";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-base-200 flex items-center justify-between bg-base-200/50">
          <div className="flex items-center gap-2 text-base-content">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">รายละเอียดประกาศ</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div ref={modalBodyRef} className="p-6 overflow-y-auto flex-1 space-y-6">
          {isLoading ? (
            <div className="space-y-4 py-8">
              <div className="skeleton h-64 w-full rounded-2xl" />
              <div className="skeleton h-8 w-3/4" />
              <div className="skeleton h-6 w-1/3" />
              <div className="skeleton h-20 w-full rounded-xl" />
            </div>
          ) : !listing ? (
            <div className="text-center py-12 text-error space-y-2">
              <p className="font-bold">ไม่สามารถโหลดข้อมูลสินค้าได้</p>
              <p className="text-xs text-base-content/60">
                โปรดตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง
              </p>
            </div>
          ) : (
            <>
              {/* 🔍 แถบเครื่องมือควบคุมแว่นขยาย (DaisyUI Toggle สไตล์มน สดใส) */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-base-200/80 rounded-2xl border border-base-300/80 shadow-xs">
                
                {/* DaisyUI Toggle Controller */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isZoomEnabled}
                    onChange={(e) => {
                      setIsZoomEnabled(e.target.checked);
                      if (!e.target.checked) setShowZoom(false);
                    }}
                    className="toggle toggle-success toggle-md shadow-xs"
                  />

                  <div className="flex items-center gap-2">
                    <ZoomIn className={`w-4 h-4 transition-colors ${isZoomEnabled ? "text-success" : "text-base-content/40"}`} />
                    <span className={`text-sm font-bold transition-colors ${isZoomEnabled ? "text-base-content" : "text-base-content/50"}`}>
                      แว่นขยายส่องภาพ
                    </span>
                    <span className={`badge badge-sm font-extrabold transition-all ${
                      isZoomEnabled ? "badge-success text-white shadow-xs" : "badge-ghost opacity-60"
                    }`}>
                      {isZoomEnabled ? "เปิด" : "ปิด"}
                    </span>
                  </div>
                </label>

                {/* ปุ่มเลือกกำลังขยาย x3, x7, x10 */}
                {isZoomEnabled && (
                  <div className="flex items-center gap-1.5 bg-base-100 p-1 rounded-xl border border-base-300 shadow-inner animate-in fade-in duration-200">
                    <span className="text-xs font-bold pl-2 pr-1 text-base-content/60">ขยาย:</span>
                    {[3, 7, 10].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setZoomLevel(level)}
                        className={`btn btn-xs rounded-lg px-2.5 font-extrabold border-none transition-all ${
                          zoomLevel === level
                            ? "bg-success text-white shadow-md scale-105"
                            : "btn-ghost text-base-content/70 hover:bg-base-200"
                        }`}
                      >
                        x{level}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 🔍 ส่วนแสดงรูปภาพหลัก */}
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setShowZoom(false)}
                className={`relative h-[300px] sm:h-[320px] w-full rounded-2xl overflow-hidden border border-base-200 bg-base-300/50 flex items-center justify-center group select-none ${
                  isZoomEnabled ? "cursor-crosshair" : "cursor-default"
                }`}
              >
                <img
                  ref={imgRef}
                  src={mainImageUrl}
                  alt={listing.title || "สินค้า"}
                  className="max-h-full max-w-full object-contain p-2"
                />

                {isZoomEnabled && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 opacity-80 group-hover:opacity-0 transition-opacity pointer-events-none">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>ชี้เมาส์ส่องขยาย x{zoomLevel}</span>
                  </div>
                )}

                {/* แว่นขยาย (พิกัดตรงเป๊ะตามปลายเมาส์) */}
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
                      boxShadow: "0 10px 28px rgba(0,0,0,0.45), inset 0 0 10px rgba(0,0,0,0.25)",
                    }}
                  />
                )}
              </div>

              {/* หัวข้อและราคา */}
              <div className="space-y-2 border-b border-base-200 pb-4">
                <h2 className="text-2xl font-bold text-base-content">
                  {listing.title || "ไม่มีชื่อสินค้า"}
                </h2>
                <p className="text-3xl font-black text-primary">
                  {listing.price
                    ? `฿${Number(listing.price).toLocaleString()}`
                    : "-"}
                </p>
              </div>

              {/* สเปก / คุณสมบัติสินค้า */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-base-200/60 rounded-xl space-y-1">
                  <span className="text-xs text-base-content/60 flex items-center gap-1 font-medium">
                    <Tag className="w-3.5 h-3.5 text-primary" /> แบรนด์ / รุ่น
                  </span>
                  <p className="font-bold text-base-content">
                    {listing.brand || "-"} {listing.model ? `/ ${listing.model}` : ""}
                  </p>
                </div>

                <div className="p-3 bg-base-200/60 rounded-xl space-y-1">
                  <span className="text-xs text-base-content/60 flex items-center gap-1 font-medium">
                    <Layers className="w-3.5 h-3.5 text-primary" /> หมวดหมู่
                  </span>
                  <p className="font-bold text-base-content">
                    {listing.category?.name || "ไม่ระบุ"}
                  </p>
                </div>

                <div className="p-3 bg-base-200/60 rounded-xl space-y-1">
                  <span className="text-xs text-base-content/60 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> สถานที่
                  </span>
                  <p className="font-bold text-base-content">
                    {listing.location || "ไม่ระบุ"}
                  </p>
                </div>

                <div className="p-3 bg-base-200/60 rounded-xl space-y-1">
                  <span className="text-xs text-base-content/60 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> สภาพสินค้า
                  </span>
                  <p className="font-bold text-base-content">
                    {formatCondition(listing.estimatedCondition)}
                  </p>
                </div>
              </div>

              {/* AI Score */}
              {listing.estimatedScore != null && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 fill-amber-500/20" />
                    ผลวิเคราะห์สภาพสินค้าโดย AI
                  </span>
                  <span className="badge badge-warning font-black text-xs">
                    {Number(listing.estimatedScore).toFixed(1)} / 100 คะแนน
                  </span>
                </div>
              )}

              {/* รายละเอียดเพิ่มเติม */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-base-content">
                  รายละเอียดสินค้า
                </h4>
                <p className="text-sm text-base-content/80 whitespace-pre-line leading-relaxed bg-base-200/40 p-4 rounded-2xl border border-base-200">
                  {listing.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-200 bg-base-200/40 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost font-bold text-sm rounded-xl px-6"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
}