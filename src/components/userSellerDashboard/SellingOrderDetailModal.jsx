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
          color: "bg-base-200 text-base-content/70 border-base-300",
          icon: Clock,
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="modal modal-open bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="modal-box relative flex h-[min(680px,92vh)] w-full max-w-4xl flex-col gap-4 overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/60 hover:text-base-content"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-base-200 pb-4">
          <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider block">
            Order Details
          </span>
          <h3 className="text-lg font-bold text-base-content mt-0.5">
            Order #{order.orderNumber || order.id}
          </h3>
        </div>
        <div
          role="tablist"
          className="grid grid-cols-2 rounded-xl bg-base-200/70 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "details"}
            onClick={() => setActiveTab("details")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === "details"
                ? "bg-base-100 text-primary shadow-sm"
                : "text-base-content/60 hover:text-base-content"
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
                ? "bg-base-100 text-primary shadow-sm"
                : "text-base-content/60 hover:text-base-content"
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
              <div className="p-2.5 rounded-xl bg-white/40 dark:bg-black/20 shrink-0">
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
            <div className="flex gap-4 p-3 bg-base-200/50 rounded-2xl border border-base-200">
              <div className="w-20 h-20 bg-base-300 rounded-xl overflow-hidden shrink-0 border border-base-200 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={item.title || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-bold text-sm text-base-content truncate">
                  {item.title || "Untitled Product"}
                </h4>
                <p className="text-xs text-base-content/60">
                  Category: {item.category?.name || "General"}
                </p>
                <p className="text-sm font-black text-primary">
                  ฿
                  {Number(
                    order.agreedPrice || order.totalPrice || item.price || 0,
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Order Information Grid */}
            <div className="space-y-2 text-xs bg-base-200/30 p-4 rounded-2xl border border-base-200">
              <div className="flex justify-between">
                <span className="text-base-content/60">Order Date:</span>
                <span className="font-semibold text-base-content">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("th-TH")
                    : "-"}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-base-content/60">Tracking Number:</span>
                  <span className="font-mono font-bold text-primary">
                    {order.trackingNumber}
                  </span>
                </div>
              )}
              {order.courier && (
                <div className="flex justify-between">
                  <span className="text-base-content/60">Courier:</span>
                  <span className="font-semibold text-base-content">
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
                className={`btn rounded-xl font-bold ${
                  order.status === "PAID"
                    ? "flex-1 btn-outline"
                    : "w-full btn-primary text-white"
                }`}
              >
                Close
              </button>

              {order.status === "PAID" && (
                <button
                  type="button"
                  onClick={onOpenShip}
                  className="btn btn-primary flex-1 rounded-xl font-bold text-white"
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
