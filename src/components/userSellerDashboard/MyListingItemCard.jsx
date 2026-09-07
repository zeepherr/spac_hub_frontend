import React from "react";
import { Edit3, Sparkles, Trash2 } from "lucide-react";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

export default function MyListingItemCard({
  item,
  onOpenDetail,
  onOpenEdit,
  onOpenDelete,
}) {
  const coverImage =
    item.images?.find((img) => img.isCover) || item.images?.[0];
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

  const renderStatusBadge = (status) => {
    const baseClass =
      "badge text-xs sm:text-sm font-bold shrink-0 min-w-[90px] py-3 text-center border-none shadow-xs";
    switch (status) {
      case "ACTIVE":
        return <span className={`${baseClass} badge-success text-white`}>Active</span>;
      case "RESERVED":
        return <span className={`${baseClass} badge-warning text-white`}>Reserved</span>;
      case "SOLD":
        return <span className={`${baseClass} badge-ghost`}>Sold</span>;
      case "DRAFT":
        return <span className={`${baseClass} badge-info text-white`}>Draft</span>;
      case "ARCHIVED":
        return <span className={`${baseClass} badge-error text-white`}>Archived</span>;
      default:
        return <span className={`${baseClass} badge-outline`}>{status || "General"}</span>;
    }
  };

  const formatCondition = (condition) => {
    const map = {
      LIKE_NEW: "Like New",
      GOOD: "Good Condition",
      FAIR: "Fair Condition",
      POOR: "Used / Worn",
    };
    return map[condition] ? `Condition: ${map[condition]}` : null;
  };

  return (
    <div
      onClick={() => onOpenDetail(item.id)}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-base-100 border border-base-200 rounded-2xl cursor-pointer hover:border-primary hover:shadow-[0_4px_16px_rgba(249,115,22,0.15)] transition-all duration-200 gap-5"
    >
      <div className="flex items-center gap-5 min-w-0 flex-1 w-full sm:w-auto">
        <div className="bg-base-300 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-base-200 w-[110px] h-[110px]">
          <img
            src={imageUrl}
            alt={item.title || "Product"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 space-y-2 flex-1">
          <p className="text-lg font-bold truncate text-base-content">
            {item.title || "Untitled Product"}
          </p>
          <p className="text-xl font-black text-primary">
            {item.price ? `฿${Number(item.price).toLocaleString()}` : "-"}
          </p>
          {formatCondition(item.estimatedCondition) && (
            <p className="text-sm text-base-content/70 font-medium">
              {formatCondition(item.estimatedCondition)}
            </p>
          )}
          {item.estimatedScore != null && (
            <div className="flex items-center gap-1.5 text-sm text-amber-500 font-bold pt-0.5">
              <Sparkles className="w-4 h-4 fill-amber-500/20" />
              <span>
                AI Score: {Number(item.estimatedScore).toFixed(1)}/100
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-base-200"
        onClick={(e) => e.stopPropagation()}
      >
        {renderStatusBadge(item.status)}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => onOpenEdit(e, item)}
            className="btn btn-ghost btn-circle btn-sm text-info hover:bg-info/10 transition-colors"
            title="Edit Listing"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => onOpenDelete(e, item)}
            className="btn btn-ghost btn-circle btn-sm text-error/70 hover:text-error hover:bg-error/10 transition-colors"
            title="Delete Listing"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}