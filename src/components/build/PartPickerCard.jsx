import { Cpu } from "lucide-react";
import { Link } from "react-router";

// เดียวกับ GLASS_PANEL ที่ใช้ใน CategorySidebar.jsx/MainNav.jsx/HomeStore.jsx - จางเท่ากันทั้งเว็บ
const GLASS_PANEL =
  "bg-white/50 backdrop-blur-xl border border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

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
    <div
      className={`flex flex-col rounded-2xl p-4 text-center transition hover:bg-white/70 ${GLASS_PANEL}`}
    >
      <span className="mb-1 text-left text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        {product.brand}
      </span>
      <p className="mb-3 line-clamp-2 text-left text-sm font-medium text-neutral-900">
        {product.title}
      </p>

      <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-neutral-50">
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

      <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        Price
      </span>
      <p className="mb-4 text-xl font-bold text-[#f97316]">
        {formatPrice(product.price)}
      </p>

      <div className="mt-auto flex gap-2">
        <button
          type="button"
          onClick={() => onAddToBuild?.(product)}
          className="flex-1 rounded-lg bg-[#f97316] py-2 text-xs font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] transition hover:bg-orange-600 sm:text-sm"
        >
          Add to Build
        </button>
        <Link
          to={`/products/${product.id}`}
          className="flex flex-1 items-center justify-center rounded-lg border border-neutral-200/70 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-white/60 sm:text-sm"
        >
          Details
        </Link>
      </div>
    </div>
  );
}

export default PartPickerCard;
