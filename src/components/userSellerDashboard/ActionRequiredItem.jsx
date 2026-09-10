import React from "react";
import { Truck, ChevronRight } from "lucide-react";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

// เดียวกับ CTA_GLASS ที่ใช้ทั้งเว็บ
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

export function ActionRequiredItem({ order, onOpenModal }) {
  // Logic to get image URL
  const coverImage =
    order.listing?.images?.find((img) => img.isCover) ||
    order.listing?.images?.[0];

  const rawUrl = coverImage?.imageUrl || coverImage?.url;
  const rawKey = coverImage?.imageKey || coverImage?.key;

  let imageUrl = DEFAULT_IMAGE;
  if (rawUrl) {
    imageUrl = rawUrl;
  } else if (rawKey) {
    imageUrl = rawKey.startsWith("http")
      ? rawKey
      : `${R2_PUBLIC_URL}/${rawKey}`;
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white/40 backdrop-blur-sm hover:bg-white/60 rounded-2xl border border-neutral-200/70 gap-3 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Product Image */}
        <div className="w-12 h-12 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200/70 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={order.listing?.title || "Product"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details + Order ID Badge */}
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-bold text-neutral-900 truncate">
            Ship {order.listing?.title || "Item"} to Inspection Center
          </p>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100/80 border border-neutral-200/70">
            <Truck className="w-3 h-3 text-orange-500 shrink-0" />
            <span className="text-[10px] font-semibold text-neutral-500 tracking-tight">
              #{order.orderNumber || order.id}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => onOpenModal(order)}
        className={`inline-flex cursor-pointer items-center text-xs font-bold shrink-0 rounded-xl px-3 py-2 transition ${CTA_GLASS}`}
      >
        Enter Tracking Number <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
      </button>
    </div>
  );
}
