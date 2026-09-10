import { useListings } from "@/hook/listing/useListingForHomePage";
import { Headset, Percent, ShieldCheck, Truck, Wrench } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";
import ProductCard from "./ProductCard";
import { useWebAssets } from "@/hook/webAsset/useWebAssets";

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    subtitle: "Official Warranty on Every Item",
  },
  { icon: Truck, title: "Nationwide Delivery", subtitle: "Fast and Reliable" },
  {
    icon: Wrench,
    title: "After-Sales Warranty",
    subtitle: "Confidence in Every Use",
  },
  { icon: Percent, title: "0% Installment Plan", subtitle: "Up to 10 Months" },
  {
    icon: Headset,
    title: "After-Sales Support",
    subtitle: "Support Throughout Your Usage",
  },
];

// สุ่มหยิบสินค้ามา n ชิ้นจากที่มีทั้งหมด (ไม่แก้ array เดิม)
function pickRandomProducts(list, count) {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function HeroBanner({ data }) {
  // ดึงรูปแบนเนอร์จริงจาก backend - เดิม data อาจยัง undefined ตอนโหลดไม่เสร็จ ใช้ ?. กันแอปพัง
  // (ของเดิมเรียก data.coverImageUrl ตรงๆ ไม่ใส่ optional chaining จะ throw ตอน data ยังไม่มา)
  const bannerImageUrl = data?.coverImageUrl;

  return (
    <div
      className={`flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-neutral-50 ${
        bannerImageUrl
          ? "border border-neutral-200"
          : "border border-dashed border-neutral-200"
      }`}
    >
      {bannerImageUrl ? (
        <img
          src={bannerImageUrl}
          alt="Promotional banner"
          className="h-full w-full object-cover"
        />
      ) : (
        <p className="text-sm text-neutral-400">no banner data available</p>
      )}
    </div>
  );
}

function PromoCards({ data }) {
  // TODO: fetch โปรโมชัน/ทางลัดจาก backend แล้ว .map() แทน placeholder นี้
  const cards = [];

  // ดึงรูปโปรโมชันจริงจาก backend เหมือนกับ HeroBanner - ใช้ ?. กัน data ยัง undefined ตอนโหลดไม่เสร็จ
  const promotionImageUrl = data?.promotionImageUrl;

  return (
    <div className="flex flex-col gap-4">
      {cards.length === 0 ? (
        promotionImageUrl ? (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <img
              src={promotionImageUrl}
              alt="Promotion"
              className="h-64 w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50">
            <p className="text-sm text-neutral-400">
              no promotion data available
            </p>
          </div>
        )
      ) : (
        cards.map((card) => (
          <div
            key={card.id}
            className="rounded-2xl border border-neutral-200 bg-white p-5"
          >
            {/* render promo card */}
          </div>
        ))
      )}
    </div>
  );
}

function TrustBar() {
  const GLASS_PANEL =
    "bg-white/50 backdrop-blur-xl border border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

  return (
    <div
      className={`grid grid-cols-2 gap-y-5 rounded-2xl px-6 py-6 sm:grid-cols-5 sm:gap-x-4 ${GLASS_PANEL}`}
    >
      {TRUST_ITEMS.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="flex items-center gap-3">
          <Icon
            className="h-6 w-6 shrink-0 text-[#f97316]"
            strokeWidth={1.75}
          />
          <div className="leading-tight">
            <p className="text-xs font-semibold text-neutral-900">{title}</p>
            <p className="text-[11px] text-neutral-500">{subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductSection({ title, products = [], isLoading, isError }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <span className="h-3.5 w-1 rounded-full bg-[#f97316]" />
          {title}
        </h2>
        <Link
          to="/products"
          className="text-xs font-medium text-neutral-500 hover:text-[#f97316]"
        >
          View All Products &gt;
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl border border-neutral-100 bg-neutral-50"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50">
          <p className="text-sm text-[#dc2626]">Failed to load products</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50">
          <p className="text-sm text-neutral-400">No product data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function LatestProductSection({ title, products = [], isLoading, isError }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <span className="h-3.5 w-1 rounded-full bg-[#f97316]" />
          {title}
        </h2>
        <Link
          to="/products/lastestProducts"
          className="text-xs font-medium text-neutral-500 hover:text-[#f97316]"
        >
          View All Products &gt;
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl border border-neutral-100 bg-neutral-50"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50">
          <p className="text-sm text-[#dc2626]">Failed to load products</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50">
          <p className="text-sm text-neutral-400">No product data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ArticleSection() {
  // TODO: fetch บทความ/รีวิวจาก backend แล้ว .map() แทน placeholder นี้
  const articles = [];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">
          Articles / Reviews
        </h2>
        <Link
          to="/articles"
          className="text-xs font-medium text-neutral-500 hover:text-[#f97316]"
        >
          View All &gt;
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-400">
          No articles available
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {articles.map((article) => (
            <li key={article.id} className="flex gap-3">
              {/* render article row */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HomeStore() {
  const { data: listings = [], isLoading, isError } = useListings();
  const { data: images } = useWebAssets();

  // ล่าสุด - backend เรียง createdAt desc มาให้อยู่แล้ว เอา 5 ตัวแรกตรงๆ
  const newest = listings.slice(0, 5);

  // แนะนำ - สุ่มจากสินค้าทั้งหมดที่มี (ไม่ผูกกับ index ตายตัวแบบเดิม)
  // ใช้ useMemo ผูกกับ listings เพื่อไม่ให้สุ่มใหม่ทุกครั้งที่ re-render
  // (สุ่มใหม่เฉพาะตอนข้อมูล listings เปลี่ยนจริงๆ เช่น fetch เสร็จ/refetch)
  const featured = useMemo(() => pickRandomProducts(listings, 5), [listings]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-8">
        <HeroBanner data={images} />
        <TrustBar />
        <ProductSection
          title="Recommended Products"
          products={featured}
          isLoading={isLoading}
          isError={isError}
        />
        <LatestProductSection
          title="Latest Products"
          products={newest}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <div className="flex flex-col gap-8">
        <PromoCards data={images} />
        <ArticleSection />
      </div>
    </div>
  );
}
