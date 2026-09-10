import React, { useState, useEffect } from "react";
import { Package, Truck, X, Sparkles } from "lucide-react";
import CarrierSelect from "./CarrierSelect";
import { useShipOrderToAdmin } from "@/hook/order/useShipOrderToAdmin";
// import { useShipOrderToAdmin } from "@/hooks/useShipOrderToAdmin"; // ปรับ Path ตามโปรเจกต์ของคุณ

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

// เดียวกับ GLASS_MODAL/GLASS_INPUT/CTA_GLASS ที่ใช้ทั้งเว็บ
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";
const GLASS_INPUT =
  "w-full rounded-xl border border-neutral-300 bg-white/70 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

export default function ShipOrderModal({ isOpen, onClose, order }) {
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const { mutate: shipOrder, isPending } = useShipOrderToAdmin();

  useEffect(() => {
    if (isOpen) {
      setCarrier("");
      setTrackingNumber("");
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const isReadyToShip = order.status === "PAID";

  const coverImage =
    order.listing?.images?.find((img) => img.isCover) ||
    order.listing?.images?.[0];

  let imageUrl = DEFAULT_IMAGE;
  const rawUrl = coverImage?.imageUrl || coverImage?.url;
  const rawKey = coverImage?.imageKey || coverImage?.key;

  if (rawUrl) {
    imageUrl = rawUrl;
  } else if (rawKey) {
    imageUrl = rawKey.startsWith("http")
      ? rawKey
      : `${R2_PUBLIC_URL}/${rawKey}`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!carrier.trim()) {
      return;
    }
    if (!trackingNumber.trim()) {
      return;
    }

    const payload = {
      carrier: carrier.trim(),
      trackingNumber: trackingNumber.trim(),
    };

    shipOrder(
      { orderId: order.id, payload },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
      onClick={!isPending ? onClose : undefined}
    >
      <div
        className={`max-w-lg w-full p-6 rounded-3xl space-y-5 relative ${GLASS_MODAL}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 absolute right-4 top-4"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-200/70 pb-4">
          <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              Notify Warehouse Shipment (SPEC CHECK)
            </h3>
            <p className="text-xs font-semibold text-neutral-500">
              Order ID: #{order.orderNumber || order.id}
            </p>
          </div>
        </div>

        {/* Section 1: Item to Ship Information */}
        <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-neutral-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
              <Package className="w-4 h-4" /> Ordered Item
            </span>
            <span className="rounded-full bg-amber-500 text-white text-xs font-bold py-2 px-3">
              Awaiting Shipment
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200/70 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={order.listing?.title || "Product"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-bold truncate text-neutral-900">
                {order.listing?.title || "Untitled Product"}
              </p>
              <p className="text-base font-black text-orange-500">
                ฿
                {Number(order.agreedPrice || order.price || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Shipping Details Form */}
        {isReadyToShip ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="p-4 bg-white/30 backdrop-blur-sm rounded-2xl border border-neutral-200/70 space-y-4">
              <p className="text-xs font-bold text-neutral-600 border-b border-neutral-200/70 pb-2">
                Shipping Details
              </p>

              {/* Field 1: Carrier Dropdown */}
              <CarrierSelect
                value={carrier}
                onChange={setCarrier}
                disabled={isPending}
              />

              {/* Field 2: Tracking Number Input */}
              <div className="space-y-2">
                <label className="label text-sm font-bold text-neutral-900 p-0">
                  Tracking Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. TH123456789"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={isPending}
                  required
                  className={`${GLASS_INPUT} tracking-wide`}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="cursor-pointer rounded-xl px-4 py-2 text-sm font-bold text-neutral-600 transition hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !carrier || !trackingNumber}
                className={`cursor-pointer rounded-xl px-6 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${CTA_GLASS}`}
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Confirm Shipment"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 text-xs font-semibold text-red-500">
            This order is not ready for shipment.
          </div>
        )}
      </div>
    </div>
  );
}
