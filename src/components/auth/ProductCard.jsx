import { useCartFlyAnimation } from "@/components/animation/CartFlyAnimationProvider";
import { useAddCartItem } from "@/hook/cart/useCreateItem";
import useAuthStore from "@/stores/auth.store";
import { Cpu, ShoppingCart, Star } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router";

const GLASS_PANEL =
  "bg-white/50 backdrop-blur-xl border border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

function getCoverImageUrl(listing) {
  const images = listing.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];
  return cover?.imageUrl;
}

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
  const productImageRef = useRef(null);
  const { flyToCart } = useCartFlyAnimation();

  const conditionInfo = getConditionInfo(product.estimatedCondition);
  const estimatedScore =
    product.estimatedScore != null ? Number(product.estimatedScore) : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    flyToCart(productImageRef.current, imageUrl);
    addCartItem.mutate(product.id);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className={`flex flex-col rounded-2xl p-4 transition hover:bg-white/70 ${GLASS_PANEL}`}
    >
      <span className="mb-2 w-fit text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        {product.brand}
      </span>

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

      <p className="line-clamp-2 text-sm font-medium text-neutral-900">
        {product.title}
      </p>

      {product.seller?.name && (
        <p className="mb-1 truncate text-[11px] text-neutral-400">
          ขายโดย {product.seller.firstName}
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

      {product.rating ? (
        <span className="mb-1 flex items-center gap-1 text-xs text-neutral-500">
          <Star size={14} className="fill-[#f97316] text-[#f97316]" />
          {product.rating} ({product.reviewCount})
        </span>
      ) : null}

      <div className="mt-auto flex items-center justify-between">
        <p className="text-lg font-bold text-[#f97316]">
          {price.toLocaleString()}.-
        </p>
        <button
          type="button"
          aria-label="Add to Cart"
          onClick={handleAddToCart}
          disabled={user ? addCartItem.isPending : false}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f97316] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] transition hover:bg-orange-600 disabled:opacity-50"
        >
          <ShoppingCart size={15} />
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
