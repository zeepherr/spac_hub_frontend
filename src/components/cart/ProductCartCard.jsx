import { useRemoveCartItem } from "@/hook/cart/useRemoveCartItem";
import { Heart, Trash2 } from "lucide-react";

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

function normalizeUrl(url) {
  return url?.replace(/([^:])\/{2,}/g, "$1/");
}

function getCoverImageUrl(listing) {
  const images = listing?.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];

  return normalizeUrl(cover?.imageUrl);
}

const CONDITION_LABELS = {
  LIKE_NEW: {
    label: "Like New",
    color: "text-green-600",
  },
  GOOD: {
    label: "Good",
    color: "text-green-600",
  },
  FAIR: {
    label: "Fair",
    color: "text-[#f97316]",
  },
  POOR: {
    label: "Poor / Needs Repair",
    color: "text-[#dc2626]",
  },
};

const AVAILABILITY_MESSAGES = {
  RESERVED: "Temporarily reserved by another buyer",
  SOLD: "This item has been sold",
  ARCHIVED: "This item is no longer available",
  REJECTED: "This item is no longer available",
  DRAFT: "This item is not available for purchase",
};

function getConditionInfo(condition) {
  return (
    CONDITION_LABELS[condition] ?? {
      label: condition ?? "Unknown condition",
      color: "text-neutral-700",
    }
  );
}

function ConditionScoreBar({ score }) {
  const clamped = Math.min(100, Math.max(0, score));

  const barColor =
    clamped >= 80
      ? "bg-green-500"
      : clamped >= 50
        ? "bg-[#f97316]"
        : "bg-[#dc2626]";

  return (
    <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-100">
      <div
        className={`h-full rounded-full ${barColor}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function ProductCartCard({ item, selected, onToggleSelect }) {
  const listing = item.listing;

  const isUnavailable = listing.status !== "ACTIVE";

  const availabilityMessage =
    AVAILABILITY_MESSAGES[listing.status] ??
    "This item is currently unavailable";

  const imageUrl = getCoverImageUrl(listing);
  const price = Number(listing.price);

  const conditionInfo = getConditionInfo(listing.estimatedCondition);

  const estimatedScore =
    listing.estimatedScore != null ? Number(listing.estimatedScore) : null;

  const removeCartItem = useRemoveCartItem();

  const handleRemove = () => {
    removeCartItem.mutate(item.listingId);
  };

  return (
    <div className="flex gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
      {/* Only the selection checkbox is disabled */}
      <div className="flex items-start pt-1">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          disabled={isUnavailable}
          aria-label={`Select ${listing.title}`}
          className="checkbox checkbox-sm my-auto accent-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
        />
      </div>

      {/* Fade only the product image */}
      <div
        className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-neutral-50 ${
          isUnavailable ? "opacity-50 grayscale" : ""
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        {/* Fade product information, not the action buttons */}
        <div
          className={`flex items-start justify-between gap-4 ${
            isUnavailable ? "opacity-60" : ""
          }`}
        >
          <p className="line-clamp-1 font-semibold text-neutral-900">
            {listing.title}
          </p>

          <p className="shrink-0 text-xl font-bold text-neutral-900">
            {formatPrice(price)}
          </p>
        </div>

        {/* Keep availability message clearly visible */}
        {isUnavailable && (
          <span
            className={`mt-1.5 w-fit rounded-full px-2 py-1 text-xs font-medium ${
              listing.status === "RESERVED"
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {availabilityMessage}
          </span>
        )}

        <div
          className={`mt-1.5 flex flex-wrap items-center gap-2 ${
            isUnavailable ? "opacity-60" : ""
          }`}
        >
          <span
            className={`text-xs font-bold normal-case ${conditionInfo.color}`}
          >
            {conditionInfo.label}
          </span>

          {estimatedScore != null && (
            <>
              <ConditionScoreBar score={estimatedScore} />

              <span className="text-xs font-bold normal-case text-neutral-500">
                {estimatedScore}/100
              </span>
            </>
          )}

          <span className="text-xs font-bold normal-case text-neutral-500">
            • Quantity: 1
          </span>
        </div>

        {/* Action buttons remain active */}
        <div className="mt-auto flex items-center gap-4 pt-3">
          <button
            type="button"
            onClick={handleRemove}
            disabled={removeCartItem.isPending}
            className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={14} />

            {removeCartItem.isPending ? "Removing..." : "Remove"}
          </button>

          <span className="text-neutral-200">|</span>

          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#f97316]"
          >
            <Heart size={14} />
            Save for Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCartCard;
