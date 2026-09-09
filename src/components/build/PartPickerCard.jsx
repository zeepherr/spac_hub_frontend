import { Cpu } from "lucide-react";
import { Link } from "react-router";

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
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 text-center transition hover:border-neutral-300">
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
          className="flex-1 rounded-lg bg-[#f97316] py-2 text-xs font-semibold text-white transition hover:bg-orange-600 sm:text-sm"
        >
          Add to Build
        </button>
        <Link
          to={`/products/${product.id}`}
          className="flex flex-1 items-center justify-center rounded-lg border border-neutral-200 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-300 sm:text-sm"
        >
          Details
        </Link>
      </div>
    </div>
  );
}

export default PartPickerCard;
