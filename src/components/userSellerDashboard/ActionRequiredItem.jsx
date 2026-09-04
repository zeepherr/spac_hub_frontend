import React from "react";
import { Truck, ChevronRight } from "lucide-react";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

export function ActionRequiredItem({ order, onOpenModal }) {
  // Logic ดึง URL รูปภาพ
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
    <div className="flex items-center justify-between p-3 bg-base-100 hover:bg-base-200/50 rounded-2xl border border-base-200 gap-3 transition-colors shadow-sm">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* รูปภาพสินค้า */}
        <div className="w-12 h-12 bg-base-300 rounded-xl overflow-hidden shrink-0 border border-base-200 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={order.listing?.title || "สินค้า"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* รายละเอียดสินค้า + กรอบ Order ID */}
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-bold text-base-content truncate">
            ส่ง {order.listing?.title || "สินค้า"} ให้ศูนย์ตรวจสอบ
          </p>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-base-200/80 border border-base-300/60">
            <Truck className="w-3 h-3 text-orange-500 shrink-0" />
            <span className="text-[10px] font-semibold text-base-content/70 tracking-tight">
              #{order.orderNumber || order.id}
            </span>
          </div>
        </div>
      </div>

      {/* ปุ่มดำเนินการ */}
      <button
        type="button"
        onClick={() => onOpenModal(order)}
        className="btn btn-sm btn-primary text-white text-xs font-bold shrink-0 rounded-xl shadow-sm px-3"
      >
        กรอกเลขพัสดุ <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
      </button>
    </div>
  );
}