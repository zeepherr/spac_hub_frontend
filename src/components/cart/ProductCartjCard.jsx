import { removeCartItem } from "@/api/cart.api";
import { useRemoveCartItem } from "@/hook/cart/useRemoveCartItem";
import { Heart, Trash2 } from "lucide-react";

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

// แก้สแลชซ้อน (เช่น "r2.dev//listings/...") เหมือนที่ทำไว้ใน ProductCard.jsx

// หารูปปกจาก listing.images (isCover ก่อน ถ้าไม่มีเอารูปแรก)
function getCoverImageUrl(listing) {
  const images = listing?.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];
  return cover?.imageUrl;
}

// item ที่ได้จาก useMyCart() จริงมี shape:
// { id, listingId, createdAt, listing: { title, price, images, estimatedCondition, ... } }
// ข้อมูลสินค้าจริงๆ อยู่ใต้ item.listing ทั้งหมด ไม่ได้แบนอยู่ที่ item ตรงๆ
function ProductCartCard({ item, selected, onToggleSelect }) {
  const listing = item.listing;
  const imageUrl = getCoverImageUrl(listing);
  const price = Number(listing.price);
  const removeCartItem = useRemoveCartItem();

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

        <p className="hardware-label mt-1 normal-case text-secondary">
          สภาพ: {listing.estimatedCondition} • จำนวน: 1
        </p>

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
