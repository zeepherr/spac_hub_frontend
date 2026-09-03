import { useAddCartItem } from "@/hook/cart/useCreateItem";
import useAuthStore from "@/stores/auth.store";
import { Cpu, ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router";

// แก้สแลชซ้อน (เช่น "r2.dev//listings/...") ที่เกิดจากฝั่ง backend ต่อ URL พลาด

// หารูปปกจาก listing.images (isCover ก่อน ถ้าไม่มีเอารูปแรก)
// backend คืน imageUrl เต็มมาให้อยู่แล้ว (แปลง imageKey เป็น URL ฝั่ง server แล้ว)
function getCoverImageUrl(listing) {
  const images = listing.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];
  return cover?.imageUrl;
}

// label ภาษาไทยของ estimatedCondition - เหมือนที่ทำไว้ใน ListingDetailPage.jsx / ProductCartCard.jsx
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

// หลอดคะแนนแบบย่อ (เหมือนใน ProductCartCard.jsx) สีไล่ตามช่วงคะแนน เขียว/ส้ม/แดง
function ConditionScoreBar({ score }) {
  const clamped = Math.min(100, Math.max(0, score));
  const barColor =
    clamped >= 80
      ? "bg-green-500"
      : clamped >= 50
        ? "bg-[#f97316]"
        : "bg-[#dc2626]";

  return (
    <div className="h-1.5 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-100">
      <div
        className={`h-full rounded-full ${barColor}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function ProductCard({ product }) {
  const imageUrl = getCoverImageUrl(product);
  const price = Number(product.price);
  const user = useAuthStore((store) => store.user);
  const navigate = useNavigate();
  const addCartItem = useAddCartItem();

  const conditionInfo = getConditionInfo(product.estimatedCondition);
  const estimatedScore =
    product.estimatedScore != null ? Number(product.estimatedScore) : null;

  const handleAddToCart = (e) => {
    // กันไม่ให้ <Link> ที่ครอบการ์ดอยู่ทำการ navigate ไปหน้า detail ตอนกดปุ่มนี้
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // ยังไม่ login เด้งไปหน้า login แทนการ add เลย
      navigate("/login");
      return;
    }

    // TODO: ปรับ payload ให้ตรงกับที่ addCartItem ต้องการจริงๆ
    // ตอนนี้เดาว่าส่งแค่ listingId เฉยๆ ถ้า backend ต้องการ shape อื่น (เช่น { listingId, qty }) ปรับตรงนี้
    addCartItem.mutate(product.id);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="hardware-surface flex flex-col p-4"
    >
      <span className="hardware-label mb-2 w-fit rounded-field bg-neutral-100 px-2 py-1 normal-case text-secondary">
        {product.brand}
      </span>

      <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-box bg-neutral-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <Cpu className="h-12 w-12 text-neutral-300" strokeWidth={1} />
        )}
      </div>

      <p className="mb-1 line-clamp-2 text-sm font-semibold text-neutral-900">
        {product.title}
      </p>
      <p className="mb-1 text-lg font-bold text-[#f97316]">
        {price.toLocaleString()}.-
      </p>

      {estimatedScore != null && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className={`hardware-label normal-case ${conditionInfo.color}`}>
            {conditionInfo.label}
          </span>
          <ConditionScoreBar score={estimatedScore} />
          <span className="hardware-label normal-case text-secondary">
            {estimatedScore}
          </span>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between">
        {/* schema ตอนนี้ยังไม่มี rating ผูกกับ Listing โดยตรง (Review อยู่บน Order)
            เว้นที่ไว้เผื่อทำสรุป rating ทีหลัง ถ้ายังไม่มีข้อมูลจะไม่โชว์แถวนี้ */}
        {product.rating ? (
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <Star size={14} className="fill-[#f97316] text-[#f97316]" />
            {product.rating} ({product.reviewCount})
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          aria-label="เพิ่มลงตะกร้า"
          onClick={handleAddToCart}
          disabled={user ? addCartItem.isPending : false}
          className="flex h-8 w-8 items-center justify-center rounded-field bg-[#f97316] text-white hover:bg-orange-600 disabled:opacity-50"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
