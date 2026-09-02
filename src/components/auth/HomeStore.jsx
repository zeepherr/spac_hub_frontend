import { useListings } from "@/hook/listing/useListingForHomePage";
import { Headset, Percent, ShieldCheck, Truck, Wrench } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";
import ProductCard from "./ProductCard";

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

// สุ่มหยิบสินค้ามา n ชิ้นจากที่มีทั้งหมด (ไม่แก้ array เดิม)
function pickRandomProducts(list, count) {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
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

  // ล่าสุด - backend เรียง createdAt desc มาให้อยู่แล้ว เอา 5 ตัวแรกตรงๆ
  const newest = listings.slice(0, 5);

  // แนะนำ - สุ่มจากสินค้าทั้งหมดที่มี (ไม่ผูกกับ index ตายตัวแบบเดิม)
  // ใช้ useMemo ผูกกับ listings เพื่อไม่ให้สุ่มใหม่ทุกครั้งที่ re-render
  // (สุ่มใหม่เฉพาะตอนข้อมูล listings เปลี่ยนจริงๆ เช่น fetch เสร็จ/refetch)
  const featured = useMemo(() => pickRandomProducts(listings, 5), [listings]);

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
