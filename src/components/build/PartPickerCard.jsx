import { Cpu } from "lucide-react";
import { Link } from "react-router";

// การ์ดสินค้าเวอร์ชันหน้า "จัดสเปค" - ต่างจาก ProductCard.jsx ทั่วไป (ที่มีปุ่มเพิ่มลงตะกร้าไอคอนเดียว) ตรงที่มี
// ปุ่ม "จัดชุดสเปค" (เพิ่มเข้ารายการที่เลือกไว้ฝั่งซ้าย) กับ "รายละเอียด" (ไปหน้า product detail) แยกกันชัดเจน

// หารูปปกจาก listing.images (isCover ก่อน ถ้าไม่มีเอารูปแรก) - เหมือน getCoverImageUrl ใน ProductCard.jsx
// (backend คืน imageUrl เต็มมาให้อยู่แล้ว) ตอนเป็น mock ใช้ field product.imageUrl ตรงๆ แต่ listing จริงจาก
// useListingsByCategory ไม่มี field นี้ มีแต่ images[] แทน
function getCoverImageUrl(product) {
  const images = product.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];
  return cover?.imageUrl;
}

function formatPrice(amount) {
  return `${Number(amount).toLocaleString()}.-`;
}

function PartPickerCard({ product, onAddToBuild }) {
  const imageUrl = getCoverImageUrl(product);

  return (
    <div className="hardware-surface flex flex-col p-4 text-center">
      <span className="mb-1 text-left text-sm font-bold text-[#f97316]">
        {product.brand}
      </span>
      <p className="mb-3 line-clamp-2 text-left text-sm font-bold text-neutral-900">
        {product.title}
      </p>

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

      <span className="hardware-label normal-case text-secondary">ราคา</span>
      <p className="mb-4 text-xl font-bold text-[#f97316]">
        {formatPrice(product.price)}
      </p>

      <div className="mt-auto flex gap-2">
        <button
          type="button"
          onClick={() => onAddToBuild?.(product)}
          className="btn btn-accent flex-1 text-xs text-white sm:text-sm"
        >
          จัดชุดสเปค
        </button>
        <Link
          to={`/products/${product.id}`}
          className="btn flex-1 border-none bg-blue-600 text-xs text-white hover:bg-blue-700 sm:text-sm"
        >
          รายละเอียด
        </Link>
      </div>
    </div>
  );
}

export default PartPickerCard;
