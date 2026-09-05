import ProductCard from "./ProductCard"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useListings } from "@/hook/listing/useListingForHomePage";

function AllProduct() {
  const { data: listings = [], isLoading, isError } = useListings();

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-neutral-900">All Products</h1>

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
          <p className="text-sm text-neutral-400">No product information available</p>
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

export default AllProduct;
