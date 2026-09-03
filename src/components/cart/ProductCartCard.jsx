import { useRemoveCartItem } from "@/hook/cart/useRemoveCartItem"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { Heart, Trash2 } from "lucide-react";

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

// แก้สแลชซ้อน (เช่น "r2.dev//listings/...") เหมือนที่ทำไว้ใน ProductCard.jsx
function normalizeUrl(url) {
  return url?.replace(/([^:])\/{2,}/g, "$1/");
}

// หารูปปกจาก listing.images (isCover ก่อน ถ้าไม่มีเอารูปแรก)
function getCoverImageUrl(listing) {
  const images = listing?.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];
  return normalizeUrl(cover?.imageUrl);
}

// label ภาษาไทยของ estimatedCondition - เหมือนที่ทำไว้ใน ListingDetailPage.jsx
// ยืนยันจริงแค่ "FAIR" ตัวเดียวจาก response ที่เคย log ดู ค่าอื่นเป็นการเดาตามรูปแบบทั่วไป
const CONDITION_LABELS = {
  LIKE_NEW: { label: "เหมือนใหม่", color: "text-green-600" },
  GOOD: { label: "สภาพดี", color: "text-green-600" },
  FAIR: { label: "สภาพปานกลาง", color: "text-[#f97316]" },
  POOR: { label: "สภาพต้องซ่อมแซม", color: "text-[#dc2626]" },
};

function getConditionInfo(condition) {
  return (
    CONDITION_LABELS[condition] ?? {
      label: condition,
      color: "text-neutral-700",
    }
  );
}

// หลอดคะแนนแบบย่อ (เล็กกว่าของ ListingDetailPage.jsx เพราะพื้นที่การ์ดจำกัด) สีไล่ตามช่วงคะแนนเหมือนกัน
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

// item ที่ได้จาก useMyCart() จริงมี shape:
// { id, listingId, createdAt, listing: { title, price, images, estimatedCondition, estimatedScore, ... } }
// ข้อมูลสินค้าจริงๆ อยู่ใต้ item.listing ทั้งหมด ไม่ได้แบนอยู่ที่ item ตรงๆ
//
// หน้า CartPage.jsx ตอนนี้ต้อง login ถึงจะเข้าถึงได้ (ไม่ login โดนเด้งไป /login ตั้งแต่แรก)
// การ์ดนี้เลยไม่ต้องรองรับ guest cart แล้ว ใช้ useRemoveCartItem() ยิงลบที่ backend ได้ตรงๆ
//
// selected / onToggleSelect ควบคุมจาก CartPage.jsx (parent) เพราะสรุปยอด
// ต้องรู้ว่าตอนนี้เลือกชิ้นไหนอยู่บ้างเพื่อเอาไปจ่ายเงิน
function ProductCartCard({ item, selected, onToggleSelect }) {
  const listing = item.listing;
  const imageUrl = getCoverImageUrl(listing);
  const price = Number(listing.price);
  const removeCartItem = useRemoveCartItem();

  const conditionInfo = getConditionInfo(listing.estimatedCondition);
  const estimatedScore =
    listing.estimatedScore != null ? Number(listing.estimatedScore) : null;

  const handleRemove = () => {
    removeCartItem.mutate(item.listingId);
  };

  return (
    <div className="flex gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
      <div className="flex items-start pt-1 ">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          aria-label={`เลือก ${listing.title}`}
          className="checkbox checkbox-sm text-[#f97316] inset-shadow-sm/25 flex my-auto"
        />
      </div>

      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-box bg-neutral-50">
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
        <div className="flex items-start justify-between gap-4">
          <p className="line-clamp-1 font-semibold text-neutral-900">
            {listing.title}
          </p>
          <p className="shrink-0 text-xl font-bold text-neutral-900">
            {formatPrice(price)}
          </p>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`hardware-label normal-case ${conditionInfo.color}`}>
            {conditionInfo.label}
          </span>
          {estimatedScore != null && (
            <>
              <ConditionScoreBar score={estimatedScore} />
              <span className="hardware-label normal-case text-secondary">
                {estimatedScore}/100
              </span>
            </>
          )}
          <span className="hardware-label normal-case text-secondary">
            • จำนวน: 1
          </span>
        </div>

        {/* TODO: response ตอนนี้มีแค่ listing.sellerId (UUID) ไม่มีชื่อ/สถานะยืนยันตัวตนผู้ขายมาด้วย
            พอ backend เพิ่ม listing.seller = { name, isVerified } เข้ามา ค่อยเอา badge นี้กลับมาโชว์ เช่น:
            <span className="mt-2 flex w-fit items-center gap-1 rounded-field bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              <ShieldCheck size={12} />
              ผู้ขายยืนยันตัวตนแล้ว: {listing.seller.name}
            </span> */}

        <div className="mt-auto flex items-center gap-4 pt-3">
          <button
            type="button"
            onClick={handleRemove}
            disabled={removeCartItem.isPending}
            className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#dc2626]"
          >
            <Trash2 size={14} />
            ลบ
          </button>
          <span className="text-neutral-200">|</span>
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#f97316]"
          >
            <Heart size={14} />
            บันทึกไว้ก่อน
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCartCard;
