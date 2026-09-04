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
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

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
        ไม่พบสินค้านี้ หรือสินค้าถูกปิดการขายไปแล้ว
      </p>
      <Link
        to="/"
        className="text-sm font-medium text-[#f97316] hover:text-orange-600"
      >
        กลับไปหน้าแรก
      </Link>
    </div>
  );
}

// label ภาษาไทยของ estimatedCondition - schema ยืนยันเจอค่า "FAIR" จริงจาก backend
// ค่าอื่นเป็นการเดาตามรูปแบบทั่วไป (LIKE_NEW/GOOD/FAIR/POOR) ถ้าใช้ enum คนละชื่อปรับ key ตรงนี้ให้ตรง
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

// สีของหลอดคะแนนไล่ตามช่วงคะแนน (เขียว/ส้ม/แดง) ให้เห็นภาพเร็วๆ ว่าสภาพสินค้าอยู่ระดับไหน
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

  if (isLoading) return <DetailSkeleton />;
  if (isError || !listing) return <DetailError />;

  const images = listing.images ?? [];
  const activeImage = images[activeImageIndex]?.imageUrl;
  const price = Number(listing.price);
  // schema ยังไม่ยืนยัน field ราคาเดิม/originalPrice ตรงๆ เว้นไว้เผื่อมี ถ้าไม่มีจะไม่โชว์ราคาขีดฆ่า
  const originalPrice = listing.originalPrice
    ? Number(listing.originalPrice)
    : null;

  const conditionInfo = getConditionInfo(listing.estimatedCondition);
  const estimatedScore =
    listing.estimatedScore != null ? Number(listing.estimatedScore) : null;

  // เหมือนปุ่ม "เพิ่มลงตะกร้า" ใน ProductCard.jsx เป๊ะ: ไม่ login เด้งไป /login แทนการ add เลย
  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    addCartItem.mutate(listing.id);
  };

  // "ซื้อเลย" - ข้ามตะกร้าไปหน้า checkout ตรงๆ เลย ไม่ต้อง add เข้าตะกร้าก่อน
  // CheckoutStep1Page.jsx อ่าน items จาก location.state โดยคาดหวัง shape เดียวกับ cart item จริง
  // ({ id, listingId, listing: { title, price, ... } }) เพราะปกติมันมาจาก useMyCart() ตอนมาจากหน้าตะกร้า
  // ตรงนี้เลยต้องประกอบ object หลอกให้ตรง shape เดียวกันเอง (ไม่ได้มาจาก useMyCart จริงๆ)
  // (เปลี่ยนจาก /cart/checkout เป็น /checkoutstep1 เพราะแยก step 1/3 ออกเป็น route จริงคนละหน้าแล้ว)
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
      {/* Breadcrumb */}
      <nav className="hardware-label mb-4 flex flex-wrap items-center gap-2 normal-case text-secondary">
        <Link to="/" className="hover:text-[#f97316]">
          หน้าแรก
        </Link>
        {listing.category?.name && (
          <>
            <ChevronRight size={14} />
            <Link
              to={`/categories/${listing.category.id}`}
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
        {/* LEFT: รูปสินค้า */}
        <div>
          <div className="hardware-surface relative mb-3 flex aspect-square items-center justify-center overflow-hidden bg-neutral-50">
            <span className="hardware-shadow absolute left-3 top-3 flex items-center gap-1 rounded-field bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-700">
              <ShieldCheck size={14} className="text-[#f97316]" />
              ตรวจสอบแล้วโดย SpecHub
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

        {/* RIGHT: ข้อมูล + ซื้อ */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {/* field เกรดสภาพสินค้ายังไม่ยืนยันชื่อจริงจาก backend ปรับ listing.grade ให้ตรงถ้าใช้ชื่ออื่น */}
            {listing.grade && (
              <span className="hardware-label rounded-field bg-neutral-100 px-3 py-1 normal-case text-secondary">
                เกรด {listing.grade}
              </span>
            )}
            <span className="hardware-label rounded-field bg-neutral-100 px-3 py-1 normal-case text-secondary">
              สินค้ามือสอง
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
                  ฿{originalPrice.toLocaleString()} ราคาใหม่
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
              เพิ่มลงตะกร้า
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="btn mt-2 w-full gap-2 border-none bg-neutral-900 text-white hover:bg-neutral-800"
            >
              ซื้อเลย
            </button>

            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-400">
              <Lock size={12} />
              คุ้มครองการซื้อขายโดย SpecHub Escrow
            </p>
          </div>

          {/* คะแนนประเมินสภาพสินค้า - estimatedScore/estimatedCondition มาจาก listing จริง (ยืนยันจาก response แล้ว) */}
          {estimatedScore != null && (
            <div className="hardware-surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-neutral-900">
                  คะแนนประเมินสภาพสินค้า
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

          {/* สรุปผลตรวจสอบ - อิงจาก Inspection model ใน schema ปรับชื่อ field ตามจริง */}
          {listing.inspection && (
            <div className="hardware-surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-neutral-900">
                  สรุปผลการตรวจสอบ
                </h2>
                <span className="text-xs font-medium text-[#f97316]">
                  ดูรายงานฉบับเต็ม
                </span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-base-300 text-center">
                <div className="px-2">
                  <Eye size={18} className="mx-auto mb-1 text-neutral-500" />
                  <p className="hardware-label normal-case text-secondary">
                    รูปลักษณ์
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">ผ่าน</p>
                </div>
                <div className="px-2">
                  <Gauge size={18} className="mx-auto mb-1 text-neutral-500" />
                  <p className="hardware-label normal-case text-secondary">
                    ประสิทธิภาพ
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
                    ความร้อน
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">ปกติ</p>
                </div>
              </div>
              {listing.inspection.note && (
                <p className="hardware-divider mt-4 pt-4 text-xs italic text-neutral-500">
                  “{listing.inspection.note}”
                </p>
              )}
            </div>
          )}

          {/* ผู้ขาย */}
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
                    ` (${listing.seller.salesCount} ขายแล้ว)`}
                </p>
              </div>
              <button
                type="button"
                aria-label="แชทกับผู้ขาย"
                className="text-neutral-400 hover:text-[#f97316]"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ข้อมูลจำเพาะ + ขั้นตอนการซื้อขาย */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-4 text-lg font-bold text-neutral-900">
            ข้อมูลจำเพาะ
          </h2>
          <div className="hardware-surface divide-y divide-base-300">
            {/* schema ยังไม่ยืนยันว่าสเปคมาเป็น array แบบไหน ปรับ listing.specs ให้ตรงจริง
                ระหว่างนี้ fallback ไปโชว์ brand/model ที่มีอยู่แน่ๆ ก่อน */}
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
                    <span className="text-neutral-500">หมวดหมู่</span>
                    <span className="font-medium text-neutral-900">
                      {listing.category.name}
                    </span>
                  </div>
                )}
                {listing.brand && (
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-neutral-500">ยี่ห้อ</span>
                    <span className="font-medium text-neutral-900">
                      {listing.brand}
                    </span>
                  </div>
                )}
                {listing.model && (
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-neutral-500">รุ่น</span>
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
            ขั้นตอนการซื้อขาย
          </h2>
          <div className="matte flex flex-col gap-5 p-5 text-white">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-xs font-bold">
                1
              </span>
              <div>
                <p className="text-sm font-semibold">ผู้ขายส่งสินค้าเข้าคลัง</p>
                <p className="text-xs text-neutral-400">
                  สินค้าถูกส่งไปตรวจสอบที่ศูนย์ก่อนถึงมือคุณ
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-xs font-bold">
                2
              </span>
              <div>
                <p className="text-sm font-semibold">ตรวจสอบโดย SpecHub</p>
                <p className="text-xs text-neutral-400">
                  ทดสอบ ทำความสะอาด และตรวจสอบสเปคให้ตรงตามที่ประกาศ
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-xs font-bold">
                3
              </span>
              <div>
                <p className="text-sm font-semibold">จัดส่งอย่างปลอดภัย</p>
                <p className="text-xs text-neutral-400">
                  ผ่านการตรวจแล้วจึงจัดส่งถึงคุณ หากไม่ผ่านคืนเงินเต็มจำนวนทันที
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
