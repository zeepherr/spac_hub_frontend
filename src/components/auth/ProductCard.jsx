import { useCartFlyAnimation } from "@/components/animation/CartFlyAnimationProvider";
import { useAddCartItem } from "@/hook/cart/useCreateItem";
import useAuthStore from "@/stores/auth.store";
import { isListingOwnedBy } from "@/utils/listing/listingOwnership";
import { Cpu, ShoppingCart, Star } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

// แก้สแลชซ้อน (เช่น "r2.dev//listings/...") ที่เกิดจากฝั่ง backend ต่อ URL พลาด

// เดียวกับ GLASS_PANEL ที่ใช้ใน PartPickerCard.jsx/CategorySidebar.jsx/MainNav.jsx - จางเท่ากันทั้ง
// เว็บ (ตัด hardware-surface ที่หลุดกลับมาออกด้วย เพราะเป็น class ทึบไม่อยู่ใน @layer จะไปทับ
// bg-white/50 กับ shadow ของ glass จนหายหมด)
const GLASS_PANEL =
  "bg-white/50 backdrop-blur-xl border border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

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
  LIKE_NEW: { label: "Like New", color: "text-green-600" },
  GOOD: { label: "Good Condition", color: "text-green-600" },
  FAIR: { label: "Fair Condition", color: "text-[#f97316]" },
  POOR: { label: "Needs Repair", color: "text-[#dc2626]" },
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
    <div className="h-1 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
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
  // อ้างอิงกล่องรูปสินค้าในการ์ดนี้ไว้เป็นจุดเริ่มบินของแอนิเมชัน "บินเข้าตะกร้า"
  const productImageRef = useRef(null);
  const { flyToCart } = useCartFlyAnimation();

  const conditionInfo = getConditionInfo(product.estimatedCondition);
  const estimatedScore =
    product.estimatedScore != null ? Number(product.estimatedScore) : null;
  const isOwner = isListingOwnedBy(product, user?.id);

  const handleAddToCart = (e) => {
    // กันไม่ให้ <Link> ที่ครอบการ์ดอยู่ทำการ navigate ไปหน้า detail ตอนกดปุ่มนี้
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // ยังไม่ login เด้งไปหน้า login แทนการ add เลย
      navigate("/login");
      return;
    }

    if (isOwner) return;

    addCartItem.mutate(product.id, {
      onSuccess: () => {
        flyToCart(productImageRef.current, imageUrl);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to add to cart", {
          position: "top-right",
        });
      },
    });
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className={`flex flex-col rounded-2xl p-4 transition hover:bg-white/70 hardware-surface ${GLASS_PANEL}`}
    >
      <span className="mb-2 w-fit text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        {product.brand}
      </span>

      {/* เปลี่ยนเป็น object-cover แทน object-contain ให้รูปเต็มกรอบ aspect-square เท่ากันทุกการ์ด
          ไม่ว่ารูปต้นฉบับจะสัดส่วนอะไรก็ตาม (ข้อแลกเปลี่ยนคือรูปที่ไม่ใช่สี่เหลี่ยมจัตุรัสอาจโดนครอบตัด
          ขอบบน-ล่างหรือซ้าย-ขวาบางส่วน แต่ขนาด/ฟีลของรูปจะเท่ากันทุกใบจริงๆ) */}
      <div
        ref={productImageRef}
        className="mb-3 aspect-square overflow-hidden rounded-xl bg-neutral-50"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Cpu className="h-12 w-12 text-neutral-300" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* เปลี่ยนจาก line-clamp-2 เป็น truncate ตัดบรรทัดเดียวแทนการขึ้นบรรทัดที่ 2 */}
      <p className="truncate text-sm font-medium text-neutral-900">
        {product.title}
      </p>

      {/* ชื่อคนขาย + ที่ตั้ง - ยังเดา path จาก product.seller อยู่ ปรับให้ตรงกับ field จริงที่ backend
          ส่งมา (เช่น product.seller?.location หรือ product.location) ถ้ายังไม่ออกลอง
          console.log(product) ดูก่อนว่า object จริงมี key ชื่ออะไรกันแน่ - เป็นไปได้ว่า endpoint
          รายการสินค้า (list) ไม่ได้ join ข้อมูล seller มาด้วยเลย (ต่างจาก endpoint detail) เลย
          product.seller เป็น undefined ตั้งแต่ต้น ไม่ใช่แค่ field ชื่อผิด */}
      {product.location && (
        <p className="mb-1 truncate text-[11px] text-neutral-400">
          {product.location}
        </p>
      )}

      {estimatedScore != null && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className={`text-[11px] font-medium ${conditionInfo.color}`}>
            {conditionInfo.label}
          </span>
          <ConditionScoreBar score={estimatedScore} />
          <span className="text-[11px] text-neutral-400">{estimatedScore}</span>
        </div>
      )}

      {/* schema ตอนนี้ยังไม่มี rating ผูกกับ Listing โดยตรง (Review อยู่บน Order)
          เว้นที่ไว้เผื่อทำสรุป rating ทีหลัง ถ้ายังไม่มีข้อมูลจะไม่โชว์แถวนี้ */}
      {product.rating ? (
        <span className="mb-1 flex items-center gap-1 text-xs text-neutral-500">
          <Star size={14} className="fill-[#f97316] text-[#f97316]" />
          {product.rating} ({product.reviewCount})
        </span>
      ) : null}

      {/* ราคาย้ายมาอยู่บรรทัดเดียวกับปุ่มตะกร้าแล้ว (เดิมแยกคนละบรรทัด) */}
      <div className="mt-auto flex items-center justify-between">
        <p className="text-lg font-bold text-[#f97316]">
          {price.toLocaleString()}.-
        </p>
        <button
          type="button"
          aria-label="Add to Cart"
          onClick={handleAddToCart}
          disabled={isOwner || (user ? addCartItem.isPending : false)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f97316] text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          <ShoppingCart size={15} />
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
