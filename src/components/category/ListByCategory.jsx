import { useListingsByCategory } from "@/hook/listing/useListingByCategory";

import { useParams } from "react-router";
import ProductCard from "../auth/ProductCard";

export default function CategoryListingPage() {
  // ตั้งชื่อ param เป็น categoryId (ไม่ใช้ "id") เพื่อไม่ให้ชนกับ
  // useParams().id ที่ ListingPage ใช้เช็คว่าอยู่หน้า product detail อยู่หรือเปล่า
  const { categoryId } = useParams();
  const {
    data: listings = [],
    isLoading,
    isError,
  } = useListingsByCategory(categoryId);

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-neutral-900">
        สินค้าในหมวดหมู่นี้
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="hardware-surface aspect-[3/4] animate-pulse bg-neutral-100"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="hardware-surface flex h-40 items-center justify-center">
          <p className="text-sm text-[#dc2626]">Failed to load products</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="hardware-surface flex h-40 items-center justify-center">
          <p className="text-sm text-neutral-400">
            No products in this category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {listings.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
