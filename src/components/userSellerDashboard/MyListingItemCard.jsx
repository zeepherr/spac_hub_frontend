import React from "react";
import { Edit3, Trash2 } from "lucide-react";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/300x300?text=No+Image";

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

  const formatCondition = (condition) => {
    const map = {
      LIKE_NEW: "LIKE NEW",
      GOOD: "GOOD CONDITION",
      FAIR: "FAIR CONDITION",
      POOR: "NEEDS REPAIR",
    };
    return map[condition] || condition || "GOOD CONDITION";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-rose-500";
  };

  // 🟢 ฟังก์ชันสำหรับสไตล์ Status Badge
  const renderStatusBadge = (status) => {
    const baseClass = "text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-2xs";
    switch (status) {
      case "ACTIVE":
        return <span className={`${baseClass} bg-emerald-100 text-emerald-700`}>Active</span>;
      case "RESERVED":
        return <span className={`${baseClass} bg-amber-100 text-amber-700`}>Reserved</span>;
      case "SOLD":
        return <span className={`${baseClass} bg-neutral-200 text-neutral-600`}>Sold</span>;
      case "DRAFT":
        return <span className={`${baseClass} bg-sky-100 text-sky-700`}>Draft</span>;
      case "ARCHIVED":
        return <span className={`${baseClass} bg-rose-100 text-rose-700`}>Archived</span>;
      default:
        return <span className={`${baseClass} bg-neutral-100 text-neutral-500`}>{status || "GENERAL"}</span>;
    }
  };

  return (
    <div
      onClick={() => onOpenDetail(item.id)}
      className="group relative flex flex-col justify-between bg-white border border-neutral-200/90 rounded-2xl p-3.5 cursor-pointer hover:shadow-lg transition-all duration-200 w-full min-h-[310px]"
    >
      {/* ส่วนบน: Brand + Status + Image + Title + Price */}
      <div className="space-y-2">
        {/* 1. Header บรรทัดบนสุด: Brand อยู่ซ้าย | Status Badge อยู่ขวา */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase truncate">
            {item.brand || "SPECHUB"}
          </span>
          {/* 🟢 แสดง Status Badge ตรงนี้ */}
          {renderStatusBadge(item.status)}
        </div>

        {/* 2. รูปภาพสินค้า */}
        <div className="relative w-full aspect-square bg-neutral-100 rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={imageUrl}
            alt={item.title || "Product"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 3. ชื่อสินค้า & ราคา */}
        <div className="pt-1 space-y-1">
          <h3 className="text-xs font-bold text-neutral-800 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors h-[2.25rem]">
            {item.title || "Untitled Product"}
          </h3>

          <div className="text-sm font-black text-orange-500">
            {item.price ? `${Number(item.price).toLocaleString()}.-` : "-"}
          </div>
        </div>
      </div>

      {/* ส่วนล่าง: สภาพสินค้า + Progress bar + Action Buttons */}
      <div className="mt-3 pt-2 flex items-end justify-between gap-1.5 border-t border-neutral-100">
        <div className="flex-1 min-w-0 space-y-1">
          <span className="text-[8.5px] font-extrabold text-neutral-400 uppercase tracking-tight block truncate leading-none">
            {formatCondition(item.estimatedCondition)}
          </span>

          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-10 sm:w-12 bg-neutral-200/70 rounded-full overflow-hidden shrink-0">
              <div
                className={`h-full rounded-full ${getScoreColor(item.estimatedScore || 70)}`}
                style={{ width: `${Math.min(item.estimatedScore || 70, 100)}%` }}
              />
            </div>
            <span className="text-[9.5px] font-bold text-neutral-400 leading-none">
              {item.estimatedScore ? Math.round(item.estimatedScore) : "70"}
            </span>
          </div>
        </div>

        {/* ปุ่มจัดการ */}
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => onOpenEdit(e, item)}
            className="h-7 w-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-xs"
            title="Edit Listing"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => onOpenDelete(e, item)}
            className="h-7 w-7 rounded-lg bg-neutral-100 hover:bg-red-50 text-neutral-500 hover:text-red-500 flex items-center justify-center transition-colors"
            title="Delete Listing"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}