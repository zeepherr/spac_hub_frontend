import { Cpu, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router";

// แก้สแลชซ้อน (เช่น "r2.dev//listings/...") ที่เกิดจากฝั่ง backend ต่อ URL พลาด
function normalizeUrl(url) {
  return url?.replace(/([^:])\/{2,}/g, "$1/");
}

// หารูปปกจาก listing.images (isCover ก่อน ถ้าไม่มีเอารูปแรก)
// backend คืน imageUrl เต็มมาให้อยู่แล้ว (แปลง imageKey เป็น URL ฝั่ง server แล้ว)
function getCoverImageUrl(listing) {
  const images = listing.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];
  return normalizeUrl(cover?.imageUrl);
}

function ProductCard({ product }) {
  const imageUrl = getCoverImageUrl(product);
  const price = Number(product.price);

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
      <p className="mb-2 text-lg font-bold text-[#f97316]">
        {price.toLocaleString()}.-
      </p>

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
          onClick={(e) => e.preventDefault()}
          className="flex h-8 w-8 items-center justify-center rounded-field bg-[#f97316] text-white hover:bg-orange-600"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
