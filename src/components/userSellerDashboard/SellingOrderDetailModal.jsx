import { useEffect, useState } from "react";

import SellerOrderSupport from "@/hook/support/SellerOrderSupport";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquareText,
  Package,
  PackageSearch,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

// ดึง Public URL จาก Environment Variable
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

// Modal ต้องทึบกว่าการ์ดปกติหน่อย เพราะลอยทับเนื้อหาเยอะ (เดียวกับ GLASS_MODAL ที่ใช้ใน OrderDetail.jsx)
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";
const GLASS_IDLE =
  "border border-neutral-200/70 bg-white/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)]";

export default function SellingOrderDetailModal({
  isOpen,
  onClose,
  onOpenShip,
  order,
  hasUnreadSupport = false,
}) {
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
    }
  }, [isOpen, order?.id]);

  if (!isOpen || !order) return null;

  const item = order.listing || order.product || {};

  // Logic การดึงและสร้าง Image URL
  const coverImage =
    item.images?.find((img) => img.isCover) || item.images?.[0];

  let imageUrl = DEFAULT_IMAGE;

  if (typeof coverImage === "string") {
    imageUrl = coverImage;
  } else if (coverImage) {
    const rawUrl = coverImage.imageUrl || coverImage.url;
    const rawKey = coverImage.imageKey || coverImage.key;

    if (rawUrl) {
      imageUrl = rawUrl;
    } else if (rawKey) {
      imageUrl = rawKey.startsWith("http")
        ? rawKey
        : `${R2_PUBLIC_URL}/${rawKey}`;
    }
  }

  // Status mapping
  const getStatusBadge = (status) => {
    switch (status) {
      case "SELLER_SHIPPING":
        return {
          label: "Shipping to Admin",
          color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          icon: Truck,
        };
      case "INSPECTION_PENDING":
      case "INSPECTING":
      case "NEEDS_REVIEW":
        return {
          label: "Admin Verification Pending",
          color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          icon: ShieldCheck,
        };
      case "VERIFIED":
      case "SHIPPING_TO_BUYER":
        return {
          label: "Shipping to Buyer",
          color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
          icon: Package,
        };
      case "COMPLETED":
        return {
          label: "Completed",
          color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          icon: CheckCircle2,
        };
      case "REJECTED":
      case "CANCELLED":
        return {
          label: "Rejected / Cancelled",
          color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          color: "bg-neutral-100 text-neutral-600 border-neutral-300",
          icon: Clock,
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`relative flex h-[min(680px,92vh)] w-full max-w-4xl flex-col gap-4 overflow-hidden rounded-3xl p-6 ${GLASS_MODAL}`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-neutral-200/70 pb-4">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
            Order Details
          </span>
          <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
            Order #{order.orderNumber || order.id}
          </h3>
        </div>
        <div
          role="tablist"
          className={`grid grid-cols-2 rounded-xl p-1 ${GLASS_PANEL}`}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "details"}
            onClick={() => setActiveTab("details")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === "details"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <PackageSearch className="h-4 w-4" />
            Details
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "support"}
            onClick={() => setActiveTab("support")}
            className={`relative flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === "support"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <MessageSquareText className="h-4 w-4" />
            Support
            {hasUnreadSupport && activeTab !== "support" && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
              </span>
            )}
          </button>
        </div>
        {activeTab === "details" ? (
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-1">
            {/* Current Status Badge Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3.5 ${statusInfo.color}`}
            >
              <div className="p-2.5 rounded-xl bg-white/40 shrink-0">
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase opacity-80 block">
                  Current Status
                </span>
                <span className="text-base font-bold block">
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Product Details Card */}
            <div className="flex gap-4 p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-neutral-200/70">
              <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200/70 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={item.title || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-bold text-sm text-neutral-900 truncate">
                  {item.title || "Untitled Product"}
                </h4>
                <p className="text-xs text-neutral-500">
                  Category: {item.category?.name || "General"}
                </p>
                <p className="text-sm font-black text-orange-500">
                  ฿
                  {Number(
                    order.agreedPrice || order.totalPrice || item.price || 0,
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Order Information Grid */}
            <div className="space-y-2 text-xs bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-neutral-200/70">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order Date:</span>
                <span className="font-semibold text-neutral-900">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("th-TH")
                    : "-"}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tracking Number:</span>
                  <span className="font-mono font-bold text-orange-500">
                    {order.trackingNumber}
                  </span>
                </div>
              )}
              {order.courier && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Courier:</span>
                  <span className="font-semibold text-neutral-900">
                    {order.courier}
                  </span>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="mt-auto flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`cursor-pointer rounded-xl px-5 py-3 font-bold transition ${
                  order.status === "PAID"
                    ? `flex-1 text-neutral-700 hover:bg-white/80 ${GLASS_IDLE}`
                    : `w-full ${CTA_GLASS}`
                }`}
              >
                Close
              </button>

              {order.status === "PAID" && (
                <button
                  type="button"
                  onClick={onOpenShip}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition ${CTA_GLASS}`}
                >
                  <Truck className="h-4 w-4" />
                  Ship to Admin
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-hidden rounded-2xl">
            <SellerOrderSupport order={order} />
          </div>
        )}
      </div>
    </div>
  );
}
