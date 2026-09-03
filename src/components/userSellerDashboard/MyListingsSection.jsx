import React from "react";
import { useNavigate } from "react-router";
import { ChevronRight, PackageX, Sparkles } from "lucide-react";
import { useMyListings } from "@/hook/listing/useMyListings";

// Domain สำหรับรูปภาพ R2 Storage (ปรับตาม environment ของคุณ)
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/100x100?text=No+Image";

export default function MyListingsSection() {
  const navigate = useNavigate();
  const { data: listings, isLoading, isError } = useMyListings();

  if (isLoading) {
    return <MyListingsSectionSkeleton />;
  }

  // แปลง Enum ListingStatus จาก Prisma Schema เป็น Badge แสดงผล
  const renderStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <span className="badge badge-success text-[10px] font-bold text-white shrink-0">กำลังขาย</span>;
      case "RESERVED":
        return <span className="badge badge-warning text-[10px] font-bold text-white shrink-0">ถูกจอง</span>;
      case "SOLD":
        return <span className="badge badge-ghost text-[10px] font-bold shrink-0">ขายแล้ว</span>;
      case "DRAFT":
        return <span className="badge badge-info text-[10px] font-bold text-white shrink-0">แบบร่าง</span>;
      case "ARCHIVED":
        return <span className="badge badge-error text-[10px] font-bold text-white shrink-0">ปิดประกาศ</span>;
      default:
        return <span className="badge badge-outline text-[10px] font-bold shrink-0">{status || "ทั่วไป"}</span>;
    }
  };

  // แปลง Enum ConditionGrade จาก Prisma Schema
  const formatCondition = (condition) => {
    const map = {
      LIKE_NEW: "เหมือนใหม่",
      GOOD: "สภาพดี",
      FAIR: "สภาพปานกลาง",
      POOR: "สภาพใช้งาน",
    };
    return map[condition] ? `สภาพ ${map[condition]}` : null;
  };

  return (
    <div className="card hardware-surface p-5 space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
        <h3 className="font-bold text-base text-base-content">ประกาศขายของฉัน</h3>
        <button
          type="button"
          onClick={() => navigate("/user/sell/listings")}
          className="text-xs text-base-content/70 hover:text-accent font-semibold flex items-center gap-1 transition-colors"
        >
          ดูประกาศทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Item List */}
      <div className="space-y-3">
        {isError ? (
          <div className="text-center py-6 text-xs text-error">
            ไม่สามารถโหลดข้อมูลประกาศได้
          </div>
        ) : !listings || listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-base-content/50 space-y-2">
            <PackageX className="w-8 h-8 stroke-1" />
            <p className="text-xs">ยังไม่มีรายการประกาศขาย</p>
          </div>
        ) : (
          listings.slice(0, 5).map((item) => {
            // ดึง image จาก ListingImage relation (หา cover ก่อน ถ้าไม่มีใช้ภาพแรก)
            const coverImage = item.images?.find((img) => img.isCover) || item.images?.[0];
            
            // ตรวจสอบ URL รูปภาพ
            let imageUrl = DEFAULT_IMAGE;
            if (coverImage?.imageUrl) {
              imageUrl = coverImage.imageUrl; // ดึงจาก imageUrl โดยตรงถ้ามี
            } else if (coverImage?.imageKey) {
              imageUrl = coverImage.imageKey.startsWith("http")
                ? coverImage.imageKey
                : `${R2_PUBLIC_URL}/${coverImage.imageKey}`;
            }

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/listings/${item.id}`)}
                className="flex items-center justify-between p-2.5 bg-base-100 border border-base-200 rounded-xl hover:border-accent/40 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 bg-base-300 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt={item.title || "สินค้า"}
                      className="w-full h-full object-cover"
                      /* ป้องกันกรณีรูปภาพโหลดไม่ได้ ให้สลับเป็นภาพสำรองอัตโนมัติ */
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-base-content">
                      {item.title || "ไม่มีชื่อสินค้า"}
                    </p>
                    <p className="text-[11px] text-base-content/60">
                      {formatCondition(item.estimatedCondition) || (item.price ? `฿${Number(item.price).toLocaleString()}` : "-")}
                    </p>
                    {item.estimatedScore && (
                      <div className="flex items-center gap-1 text-[10px] text-accent mt-0.5 font-semibold">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Score: {Number(item.estimatedScore).toFixed(1)}/100</span>
                      </div>
                    )}
                  </div>
                </div>

                {renderStatusBadge(item.status)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function MyListingsSectionSkeleton() {
  return (
    <div className="card hardware-surface p-5 space-y-4 h-full">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton h-4 w-24" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-2.5 border border-base-200 rounded-xl">
            <div className="flex items-center gap-3 w-full">
              <div className="skeleton w-12 h-12 rounded-lg shrink-0" />
              <div className="space-y-2 w-full">
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-3 w-1/4" />
              </div>
            </div>
            <div className="skeleton h-5 w-16 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}