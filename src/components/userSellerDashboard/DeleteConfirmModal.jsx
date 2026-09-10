import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

// Modal ต้องทึบกว่าการ์ดปกติหน่อย เพราะลอยทับเนื้อหาเยอะ (เดียวกับ GLASS_MODAL ที่ใช้ใน OrderDetail.jsx)
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";
const DANGER_CTA_GLASS =
  "bg-red-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(239,68,68,0.3)] hover:bg-red-600";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  listingData,
}) {
  if (!isOpen || !listingData) return null;

  const coverImage =
    listingData.images?.find((img) => img.isCover) || listingData.images?.[0];
  let imageUrl = DEFAULT_IMAGE;
  if (coverImage?.imageUrl) {
    imageUrl = coverImage.imageUrl;
  } else if (coverImage?.imageKey) {
    imageUrl = coverImage.imageKey.startsWith("http")
      ? coverImage.imageKey
      : `${R2_PUBLIC_URL}/${coverImage.imageKey}`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] overflow-y-auto"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden ${GLASS_MODAL}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200/70 flex items-center justify-between bg-red-500/5">
          <div className="flex items-center gap-2.5 text-red-500">
            <div className="p-2 bg-red-500/10 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-neutral-900">
              Confirm Delete Listing
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-600 text-center">
            Are you sure you want to delete this listing? <br />
            <span className="text-xs text-red-500/80 font-medium">
              (This action cannot be undone.)
            </span>
          </p>

          {/* Product Card to be Deleted */}
          <div className="flex items-center gap-4 p-3.5 bg-white/40 backdrop-blur-sm border border-neutral-200/70 rounded-2xl">
            <div className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200/70">
              <img
                src={imageUrl}
                alt={listingData.title || "Product"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="font-bold text-sm text-neutral-900 truncate">
                {listingData.title || "Untitled Product"}
              </h4>
              <p className="text-base font-black text-orange-500">
                {listingData.price
                  ? `฿${Number(listingData.price).toLocaleString()}`
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200/70 bg-white/30 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold text-neutral-600 transition hover:bg-neutral-100/70 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${DANGER_CTA_GLASS}`}
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Confirm Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
