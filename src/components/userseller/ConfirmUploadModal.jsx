import React from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";

export default function ConfirmUploadModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="modal-box bg-base-100 border border-base-300 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/60 hover:text-base-content"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-inner">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-base-content">
              Review Information Before Upload
            </h3>
            <p className="text-xs text-base-content/60">
              Important notice regarding product confirmation
            </p>
          </div>
        </div>

        {/* Info Alert Box */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            Once you click <span className="font-bold underline">Confirm & Upload Images</span>, basic details (Step 1) and condition assessment answers (Step 2) cannot be modified. Please review all information carefully before proceeding.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn btn-ghost flex-1 rounded-xl text-xs font-bold border border-base-300 hover:bg-base-200"
          >
            Cancel / Review
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="btn btn-primary text-white flex-1 rounded-xl text-xs font-bold shadow-md shadow-primary/20"
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