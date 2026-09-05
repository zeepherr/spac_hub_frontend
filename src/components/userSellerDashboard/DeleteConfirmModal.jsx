import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-base-200 flex items-center justify-between bg-error/5">
          <div className="flex items-center gap-2.5 text-error">
            <div className="p-2 bg-error/10 rounded-full">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <h3 className="font-bold text-lg text-base-content">
              Confirm Delete Listing
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-base-content/80 text-center">
            Are you sure you want to delete this listing? <br />
            <span className="text-xs text-error/80 font-medium">
              (This action cannot be undone.)
            </span>
          </p>

          {/* Product Card to be Deleted */}
          <div className="flex items-center gap-4 p-3.5 bg-base-200/60 border border-base-300 rounded-2xl">
            <div className="w-16 h-16 rounded-xl bg-base-300 overflow-hidden shrink-0 border border-base-200">
              <img
                src={imageUrl}
                alt={listingData.title || "Product"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="font-bold text-sm text-base-content truncate">
                {listingData.title || "Untitled Product"}
              </h4>
              <p className="text-base font-black text-primary">
                {listingData.price
                  ? `฿${Number(listingData.price).toLocaleString()}`
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-200 bg-base-200/40 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn btn-ghost font-bold text-sm rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn btn-error text-white font-bold px-5 rounded-xl shadow-sm gap-2"
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