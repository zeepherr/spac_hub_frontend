import { useAddCartItem } from "@/hook/cart/useCreateItem";
import { useCategories } from "@/hook/category/useCategory";
import { ChevronRight, Search, SlidersHorizontal, Trophy } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import useAuthStore from "@/stores/auth.store";
import BuildSidebar from "@/components/build/BuildSidebar";
import PartPickerCard from "@/components/build/PartPickerCard";
import { useListingsByCategory } from "@/hook/listing/useListingByCategory";

// เดียวกับ GLASS_PANEL ที่ใช้ใน BuildSidebar.jsx/CategorySidebar.jsx/MainNav.jsx - จางเท่ากันทั้งเว็บ
const GLASS_PANEL =
  "bg-white/50 backdrop-blur-xl border border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

const SELECT_CLASS =
  "rounded-lg border border-neutral-200/70 bg-white/60 px-3 py-1.5 text-sm text-neutral-700 outline-none transition focus:border-neutral-400";

function getCoverImageUrl(product) {
  const images = product.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];
  return cover?.imageUrl ?? null;
}

export default function BuildPcPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get("category");
  const user = useAuthStore((store) => store.user);
  const navigate = useNavigate();
  const addCartItem = useAddCartItem();

  const { data: categories = [] } = useCategories({ includeInactive: false });

  const activeCategoryId = categoryIdFromUrl ?? categories[0]?.id ?? null;
  const activeCategory = categories.find(
    (c) => String(c.id) === String(activeCategoryId),
  );

  const handleSelectCategory = (categoryId) => {
    setSearchParams({ category: String(categoryId) });
  };

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useListingsByCategory(activeCategoryId);

  const [selectedParts, setSelectedParts] = useState([]);

  const handleAddToBuild = (product) => {
    setSelectedParts((prev) => {
      const existingInCategory = prev.find(
        (part) => String(part.categoryId) === String(activeCategoryId),
      );

      const newPart = {
        id: product.id,
        categoryId: activeCategoryId,
        title: product.title,
        price: product.price,
        qty:
          existingInCategory?.id === product.id
            ? existingInCategory.qty + 1
            : 1,
        imageUrl: getCoverImageUrl(product),
      };

      if (existingInCategory) {
        return prev.map((part) =>
          String(part.categoryId) === String(activeCategoryId) ? newPart : part,
        );
      }

      return [...prev, newPart];
    });

    toast.success(`Added "${product.title}" to your build`, {
      position: "top-right",
    });
  };

  const handleRemovePart = (partId) => {
    setSelectedParts((prev) => prev.filter((part) => part.id !== partId));
  };

  const handleIncreaseQty = (partId) => {
    setSelectedParts((prev) =>
      prev.map((part) =>
        part.id === partId ? { ...part, qty: part.qty + 1 } : part,
      ),
    );
  };

  const handleAddAllToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (selectedParts.length === 0) return;

    try {
      for (const part of selectedParts) {
        for (let i = 0; i < part.qty; i++) {
          await addCartItem.mutateAsync(part.id);
        }
      }
      toast.success("All parts added to cart", {
        position: "top-right",
      });
      setSelectedParts([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <div className="mb-4 flex items-center gap-1.5 text-xs text-neutral-400">
        <Link to="/" className="hover:text-[#f97316]">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="font-medium text-neutral-700">Build PC</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <BuildSidebar
          activeCategory={activeCategoryId}
          onSelectCategory={handleSelectCategory}
          selectedParts={selectedParts}
          onRemovePart={handleRemovePart}
          onIncreaseQty={handleIncreaseQty}
          onAddAllToCart={handleAddAllToCart}
          isAddingAllToCart={addCartItem.isPending}
        />

        <div className="flex flex-col gap-4">
          <div className={`flex flex-col gap-3 rounded-2xl p-4 ${GLASS_PANEL}`}>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-neutral-200/70 bg-white/40 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-[#f97316] hover:text-[#f97316]"
              >
                <Trophy size={16} className="text-[#f97316]" />
                Build Rankings
              </button>

              <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-neutral-200/70 bg-white/40 px-3 py-2">
                <Search size={16} className="text-neutral-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeCategory?.name ?? ""}`}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                />
              </div>
              <button
                type="button"
                className="rounded-lg border border-neutral-200/70 bg-white/40 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-[#f97316] hover:text-[#f97316]"
              >
                Search
              </button>

              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-[#f97316]"
                >
                  <SlidersHorizontal size={16} />
                  filter
                </button>
                <select className={SELECT_CLASS}>
                  <option>Sort by</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">
                  Brand
                </label>
                <select className={`${SELECT_CLASS} w-full`}>
                  <option>Please select</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">
                  Series
                </label>
                <select className={`${SELECT_CLASS} w-full`}>
                  <option>Please select</option>
                </select>
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-400">
            All '{activeCategory?.name ?? ""}': {products.length} items
          </p>

          {isLoadingProducts ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-2xl border border-neutral-100 bg-neutral-50"
                />
              ))}
            </div>
          ) : isErrorProducts ? (
            <div
              className={`flex h-40 items-center justify-center rounded-2xl ${GLASS_PANEL}`}
            >
              <p className="text-sm text-[#dc2626]">Failed to load products</p>
            </div>
          ) : products.length === 0 ? (
            <div
              className={`flex h-40 items-center justify-center rounded-2xl ${GLASS_PANEL}`}
            >
              <p className="text-sm text-neutral-400">
                No products in this category yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <PartPickerCard
                  key={product.id}
                  product={product}
                  onAddToBuild={handleAddToBuild}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
