import React, { useState, useEffect } from "react";
import { Package, Truck, X, Sparkles } from "lucide-react";
import CarrierSelect from "./CarrierSelect";
import { useShipOrderToAdmin } from "@/hook/order/useShipOrderToAdmin";
// import { useShipOrderToAdmin } from "@/hooks/useShipOrderToAdmin"; // ปรับ Path ตามโปรเจกต์ของคุณ

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

export default function ShipOrderModal({ isOpen, onClose, order }) {
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const { mutate: shipOrder, isPending } = useShipOrderToAdmin();

  // Reset ฟอร์มเมื่อเปิด Modal
  useEffect(() => {
    if (isOpen) {
      setCarrier("");
      setTrackingNumber("");
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  // ตรวจสอบว่าเป็น Order สถานะ "รอผู้ขายจัดส่ง" (PAID) หรือไม่
  const isReadyToShip = order.status === "PAID";

  // ดึงรูปภาพ cover
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

    // ยิง Mutation อัปเดตสถานะและข้อมูลจัดส่ง
    shipOrder(
      { orderId: order.id, payload },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="modal modal-open flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="modal-box hardware-surface max-w-lg w-full p-6 rounded-3xl space-y-5 border border-base-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/60 hover:text-base-content"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-base-200 pb-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-base-content">
              แจ้งจัดส่งสินค้าไปที่คลัง (SPEC CHECK)
            </h3>
            <p className="text-xs font-semibold text-base-content/60">
              Order ID: #{order.orderNumber || order.id}
            </p>
          </div>
        </div>

        {/* Section 1: ข้อมูลสินค้าที่ต้องจัดส่ง */}
        <div className="p-4 bg-base-100 rounded-2xl border border-base-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 flex items-center gap-1">
              <Package className="w-4 h-4" /> สินค้าในคำสั่งซื้อ
            </span>
            <span className="badge badge-warning text-white text-xs font-bold py-2">
              รอผู้ขายจัดส่ง
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-base-300 rounded-xl overflow-hidden shrink-0 border border-base-200 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={order.listing?.title || "สินค้า"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-bold truncate text-base-content">
                {order.listing?.title || "ไม่มีชื่อสินค้า"}
              </p>
              <p className="text-base font-black text-primary">
                ฿{Number(order.agreedPrice || order.price || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 (ด้านล่างสุด): ฟอร์มกรอกรายละเอียดการจัดส่ง */}
        {isReadyToShip ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="p-4 bg-base-200/50 rounded-2xl border border-base-200 space-y-4">
              <p className="text-xs font-bold text-base-content/80 border-b border-base-200 pb-2">
                รายละเอียดการจัดส่ง
              </p>

              {/* Field 1: Carrier Dropdown */}
              <CarrierSelect
                value={carrier}
                onChange={setCarrier}
                disabled={isPending}
              />

              {/* Field 2: Tracking Number Input */}
              <div className="space-y-2">
                <label className="label text-sm font-bold text-base-content p-0">
                  หมายเลขติดตามพัสดุ (Tracking Number){" "}
                  <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="เช่น TH123456789"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={isPending}
                  required
                  className="input input-bordered w-full rounded-xl bg-base-100 focus:border-primary text-sm font-semibold tracking-wide"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="btn btn-ghost rounded-xl text-sm font-bold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isPending || !carrier || !trackingNumber}
                className="btn btn-primary text-white rounded-xl text-sm font-bold px-6 shadow-md shadow-primary/20"
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "ยืนยันการจัดส่ง"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 text-xs font-semibold text-error">
            รายการนี้ไม่อยู่ในสถานะที่สามารถจัดส่งได้
          </div>
        )}
      </div>
    </div>
  );
}