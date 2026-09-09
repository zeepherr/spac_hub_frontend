import { useCartFlyAnimation } from "@/components/animation/CartFlyAnimationProvider";
import { useAddCartItem } from "@/hook/cart/useCreateItem";
import { usePublicListingDetail } from "@/hook/listing/usePublicListingDetail";
import useAuthStore from "@/stores/auth.store"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import {
  ChevronRight,
  Cpu,
  Eye,
  Gauge,
  Lock,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
  Thermometer,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
// ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-6">
      <div className="mb-4 h-4 w-64 rounded bg-neutral-200" />
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="hardware-surface aspect-square bg-neutral-100" />
        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 rounded bg-neutral-200" />
          <div className="h-32 rounded bg-neutral-100" />
          <div className="h-40 rounded bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

function DetailError() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-24 text-center">
      <p className="text-sm text-[#dc2626]">
        This product was not found, or it is no longer available.
      </p>
      <Link
        to="/"
        className="text-sm font-medium text-[#f97316] hover:text-orange-600"
      >
        Back to Home
      </Link>
    </div>
  );
}

const CONDITION_LABELS = {
  LIKE_NEW: { label: "Like New", color: "text-green-600" },
  GOOD: { label: "Good", color: "text-green-600" },
  FAIR: { label: "Fair", color: "text-[#f97316]" },
  POOR: { label: "Poor / Needs Repair", color: "text-[#dc2626]" },
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
    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
      <div
        className={`h-full rounded-full transition-all ${barColor}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const { data: listing, isLoading, isError } = usePublicListingDetail(id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const user = useAuthStore((store) => store.user);
  const navigate = useNavigate();
  const addCartItem = useAddCartItem();
  // อ้างอิงกล่องรูปสินค้าหลัก (ตัวใหญ่ด้านซ้าย) ไว้เป็นจุดเริ่มบินของแอนิเมชัน "บินเข้าตะกร้า"
  const productImageRef = useRef(null);
  const { flyToCart } = useCartFlyAnimation();

  if (isLoading) return <DetailSkeleton />;
  if (isError || !listing) return <DetailError />;

  const images = listing.images ?? [];
  const activeImage = images[activeImageIndex]?.imageUrl;
  const price = Number(listing.price);
  const originalPrice = listing.originalPrice
    ? Number(listing.originalPrice)
    : null;

  const conditionInfo = getConditionInfo(listing.estimatedCondition);
  const estimatedScore =
    listing.estimatedScore != null ? Number(listing.estimatedScore) : null;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    flyToCart(productImageRef.current, activeImage);
    addCartItem.mutate(listing.id);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/checkoutstep1", {
      state: {
        items: [
          {
            id: listing.id,
            listingId: listing.id,
            listing: {
              title: listing.title,
              price: listing.price,
            },
          },
        ],
        includeAssembly: false,
      },
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="hardware-label mb-4 flex flex-wrap items-center gap-2 normal-case text-secondary">
        <Link to="/" className="hover:text-[#f97316]">
          Home
        </Link>
        {listing.category?.name && (
          <>
            <ChevronRight size={14} />
            <Link
              to={`/products/categories/${listing.category.id}`}
              className="hover:text-[#f97316]"
            >
              {listing.category.name}
            </Link>
          </>
        )}
        {listing.brand && (
          <>
            <ChevronRight size={14} />
            <span>{listing.brand}</span>
          </>
        )}
        <ChevronRight size={14} />
        <span className="font-semibold text-neutral-900">{listing.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <div
            ref={productImageRef}
            className="hardware-surface relative mb-3 flex aspect-square items-center justify-center overflow-hidden bg-neutral-50"
          >
            <span className="hardware-shadow absolute left-3 top-3 flex items-center gap-1 rounded-field bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-700">
              <ShieldCheck size={14} className="text-[#f97316]" />
              Verified by SpecHub
            </span>
            {activeImage ? (
              <img
                src={activeImage}
                alt={listing.title}
                className="h-full w-full object-contain"
              />
            ) : (
              <Cpu className="h-20 w-20 text-neutral-300" strokeWidth={1} />
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id ?? i}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`hardware-surface flex aspect-square items-center justify-center overflow-hidden p-1 ${
                    i === activeImageIndex ? "ring-2 ring-[#f97316]" : ""
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {listing.grade && (
              <span className="hardware-label rounded-field bg-neutral-100 px-3 py-1 normal-case text-secondary">
                Grade {listing.grade}
              </span>
            )}
            <span className="hardware-label rounded-field bg-neutral-100 px-3 py-1 normal-case text-secondary">
              Used Item
            </span>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900">
            {listing.title}
          </h1>

          {listing.specSummary && (
            <p className="text-sm text-neutral-500">{listing.specSummary}</p>
          )}

          <div className="hardware-surface p-5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-900">
                ฿{price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  ฿{originalPrice.toLocaleString()} New Price
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={user ? addCartItem.isPending : false}
              className="btn btn-accent mt-4 w-full gap-2 disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="btn mt-2 w-full gap-2 border-none bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Buy Now
            </button>

            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-400">
              <Lock size={12} />
              Transaction protected by SpecHub Escrow
            </p>
          </div>

          {estimatedScore != null && (
            <div className="hardware-surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-neutral-900">
                  Condition Score
                </h2>
                <span
                  className={`text-xs font-semibold ${conditionInfo.color}`}
                >
                  {conditionInfo.label}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ConditionScoreBar score={estimatedScore} />
                <span className="shrink-0 text-sm font-bold text-neutral-900">
                  {estimatedScore}/100
                </span>
              </div>
            </div>
          )}

          {listing.inspection && (
            <div className="hardware-surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-neutral-900">
                  Inspection Summary
                </h2>
                <span className="text-xs font-medium text-[#f97316]">
                  View Full Report
                </span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-base-300 text-center">
                <div className="px-2">
                  <Eye size={18} className="mx-auto mb-1 text-neutral-500" />
                  <p className="hardware-label normal-case text-secondary">
                    Appearance
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">
                    Passed
                  </p>
                </div>
                <div className="px-2">
                  <Gauge size={18} className="mx-auto mb-1 text-neutral-500" />
                  <p className="hardware-label normal-case text-secondary">
                    Performance
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">
                    {listing.inspection.performanceScore ?? "-"}%
                  </p>
                </div>
                <div className="px-2">
                  <Thermometer
                    size={18}
                    className="mx-auto mb-1 text-neutral-500"
                  />
                  <p className="hardware-label normal-case text-secondary">
                    Temperature
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">
                    Normal
                  </p>
                </div>
              </div>
              {listing.inspection.note && (
                <p className="hardware-divider mt-4 pt-4 text-xs italic text-neutral-500">
                  “{listing.inspection.note}”
                </p>
              )}
            </div>
          )}

          {listing.seller && (
            <div className="hardware-surface flex items-center gap-3 p-4">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                {listing.seller.profileImageUrl && (
                  <img
                    src={listing.seller.profileImageUrl}
                    alt={listing.seller.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">
                  {listing.seller.name}
                </p>
                <p className="hardware-label normal-case text-secondary">
                  {listing.seller.rating && `★ ${listing.seller.rating}`}
                  {listing.seller.salesCount != null &&
                    ` (${listing.seller.salesCount} sold)`}
                </p>
              </div>
              <button
                type="button"
                aria-label="Chat with seller"
                className="text-neutral-400 hover:text-[#f97316]"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-4 text-lg font-bold text-neutral-900">
            Specifications
          </h2>
          <div className="hardware-surface divide-y divide-base-300">
            {(listing.specs ?? []).length > 0 ? (
              listing.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between px-4 py-3 text-sm"
                >
                  <span className="text-neutral-500">{spec.label}</span>
                  <span className="font-medium text-neutral-900">
                    {spec.value}
                  </span>
                </div>
              ))
            ) : (
              <>
                {listing.category?.name && (
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-neutral-500">Category</span>
                    <span className="font-medium text-neutral-900">
                      {listing.category.name}
                    </span>
                  </div>
                )}
                {listing.brand && (
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-neutral-500">Brand</span>
                    <span className="font-medium text-neutral-900">
                      {listing.brand}
                    </span>
                  </div>
                )}
                {listing.model && (
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-neutral-500">Model</span>
                    <span className="font-medium text-neutral-900">
                      {listing.model}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-bold text-neutral-900">
            Purchase Process
          </h2>
          <div className="matte flex flex-col gap-5 p-5 text-white">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-xs font-bold">
                1
              </span>
              <div>
                <p className="text-sm font-semibold">
                  Seller ships item to warehouse
                </p>
                <p className="text-xs text-neutral-400">
                  The item is sent for inspection at our center before reaching
                  you
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-xs font-bold">
                2
              </span>
              <div>
                <p className="text-sm font-semibold">Inspected by SpecHub</p>
                <p className="text-xs text-neutral-400">
                  Tested, cleaned, and verified to match the listed
                  specifications
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-xs font-bold">
                3
              </span>
              <div>
                <p className="text-sm font-semibold">Safely delivered</p>
                <p className="text-xs text-neutral-400">
                  Delivered to you only after passing inspection. If it doesn't
                  pass, you get a full refund immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
