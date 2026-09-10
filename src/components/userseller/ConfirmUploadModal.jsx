import React from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";

// เดียวกับ GLASS_MODAL/GLASS_IDLE/CTA_GLASS ที่ใช้ทั้งเว็บ
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";
const GLASS_IDLE =
  "border border-neutral-200/70 bg-white/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

export default function ConfirmUploadModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
      onClick={!loading ? onClose : undefined}
    >
      <div
        className={`rounded-3xl max-w-md w-full p-6 relative space-y-5 animate-in fade-in zoom-in-95 duration-200 ${GLASS_MODAL}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 absolute right-4 top-4"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-inner">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-neutral-900">
              Review Information Before Upload
            </h3>
            <p className="text-xs text-neutral-500">
              Important notice regarding product confirmation
            </p>
          </div>
        </div>

        {/* Info Alert Box */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-amber-700 text-xs leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            Once you click{" "}
            <span className="font-bold underline">Confirm & Upload Images</span>
            , basic details (Step 1) and condition assessment answers (Step 2)
            cannot be modified. Please review all information carefully before
            proceeding.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={`flex-1 cursor-pointer rounded-xl py-2.5 text-xs font-bold text-neutral-700 transition hover:border-orange-300 hover:bg-orange-50/70 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 ${GLASS_IDLE}`}
          >
            Cancel / Review
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 cursor-pointer rounded-xl py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${CTA_GLASS}`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Confirm & Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
