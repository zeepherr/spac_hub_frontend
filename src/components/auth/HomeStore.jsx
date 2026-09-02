import { useListings } from "@/hook/listing/useListingForHomePage";
import {
  Cpu,
  Headset,
  Percent,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { Link } from "react-router";

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "ของแท้ 100%",
    subtitle: "รับประกันศูนย์ไทยทุกชิ้น",
  },
  { icon: Truck, title: "จัดส่งทั่วประเทศ", subtitle: "รวดเร็วทันใจ" },
  { icon: Wrench, title: "ประกันหลังการขาย", subtitle: "มั่นใจทุกการใช้งาน" },
  { icon: Percent, title: "ผ่อนชำระ 0%", subtitle: "สูงสุด 10 เดือน" },
  { icon: Headset, title: "บริการหลังการขาย", subtitle: "ดูแลตลอดการใช้งาน" },
];

// หารูปปกจาก listing.images (isCover ก่อน ถ้าไม่มีเอารูปแรก)
// backend คืน imageUrl เต็มมาให้อยู่แล้ว (แปลง imageKey เป็น URL ฝั่ง server แล้ว)
function getCoverImageUrl(listing) {
  const images = listing.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];
  console.log(cover.imageUrl);
  return cover?.imageUrl;
}

function HeroBanner() {
  // TODO: fetch แบนเนอร์จาก backend แล้ว .map() แทน placeholder นี้
  const slides = [];

  return (
    <div className="hardware-surface flex h-72 items-center justify-center overflow-hidden">
      {slides.length === 0 ? (
        <p className="text-sm text-neutral-400">ยังไม่มีข้อมูลแบนเนอร์</p>
      ) : (
        slides.map((slide) => (
          <div key={slide.id}>{/* render banner slide */}</div>
        ))
      )}
    </div>
  );
}

function PromoCards() {
  // TODO: fetch โปรโมชัน/ทางลัดจาก backend แล้ว .map() แทน placeholder นี้
  const cards = [];

  return (
    <div className="flex flex-col gap-4">
      {cards.length === 0 ? (
        <div className="hardware-surface flex h-72 items-center justify-center">
          <p className="text-sm text-neutral-400">ยังไม่มีข้อมูลโปรโมชัน</p>
        </div>
      ) : (
        cards.map((card) => (
          <div key={card.id} className="hardware-surface p-5">
            {/* render promo card */}
          </div>
        ))
      )}
    </div>
  );
}

function TrustBar() {
  return (
    <div className="hardware-surface grid grid-cols-2 divide-x divide-base-300 sm:grid-cols-5">
      {TRUST_ITEMS.map(({ icon: Icon, title, subtitle }) => (
        <div
          key={title}
          className="flex items-center gap-3 px-4 py-5 first:pl-6"
        >
          <Icon
            className="h-8 w-8 shrink-0 text-[#f97316]"
            strokeWidth={1.75}
          />
          <div className="leading-tight">
            <p className="text-sm font-bold text-neutral-900">{title}</p>
            <p className="hardware-label normal-case text-secondary">
              {subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  console.log(product);
  const imageUrl = getCoverImageUrl(product);
  const price = Number(product.price);

  return (
    <Link
      to={`/listings/${product.id}`}
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

function ProductSection({ title, products = [], isLoading, isError }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="hardware-label flex items-center gap-2 text-base normal-case text-neutral-900">
          <span className="h-4 w-1 rounded-full bg-[#f97316]" />
          {title}
        </h2>
        <Link
          to="/products"
          className="text-sm font-medium text-[#f97316] hover:text-orange-600"
        >
          ดูสินค้าทั้งหมด &gt;
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="hardware-surface aspect-[3/4] animate-pulse bg-neutral-100"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="hardware-surface flex h-40 items-center justify-center">
          <p className="text-sm text-[#dc2626]">โหลดสินค้าไม่สำเร็จ</p>
        </div>
      ) : products.length === 0 ? (
        <div className="hardware-surface flex h-40 items-center justify-center">
          <p className="text-sm text-neutral-400">ยังไม่มีข้อมูลสินค้า</p>
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
    <div className="hardware-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-neutral-900">บทความ / รีวิว</h2>
        <Link
          to="/articles"
          className="text-xs font-medium text-[#f97316] hover:text-orange-600"
        >
          ดูทั้งหมด &gt;
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-400">
          ยังไม่มีบทความ
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

  // ยังไม่มี endpoint แยก "แนะนำ" กับ "ใหม่ล่าสุด" ตอนนี้ backend ส่งมาชุดเดียว
  // (orderBy createdAt desc) เลยตัดโชว์คนละช่วงไปก่อน พอมี endpoint แยกจริงค่อยเปลี่ยน
  const featured = listings.slice(0, 5);
  const newest = listings.slice(5, 10);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <HeroBanner />
        <TrustBar />
        <ProductSection
          title="สินค้าแนะนำ"
          products={featured}
          isLoading={isLoading}
          isError={isError}
        />
        <ProductSection
          title="สินค้าใหม่ล่าสุด"
          products={newest}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <div className="flex flex-col gap-6">
        <PromoCards />
        <ArticleSection />
      </div>
    </div>
  );
}
