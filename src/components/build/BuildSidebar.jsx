import { useCategories } from "@/hook/category/useCategory";
import { Cpu, Pencil, ShoppingCart, X } from "lucide-react";
import { Link } from "react-router";
import { getCategoryIcon } from "../auth/CatagorySidebar";

const ICON_BG_PALETTE = [
  "bg-rose-100 text-rose-500",
  "bg-amber-100 text-amber-500",
  "bg-green-100 text-green-500",
  "bg-teal-100 text-teal-500",
  "bg-sky-100 text-sky-500",
  "bg-blue-100 text-blue-500",
  "bg-cyan-100 text-cyan-500",
  "bg-purple-100 text-purple-500",
  "bg-pink-100 text-pink-500",
  "bg-lime-100 text-lime-500",
];

function getCategoryIconBg(index) {
  return ICON_BG_PALETTE[index % ICON_BG_PALETTE.length];
}

function formatPrice(amount) {
  return `${amount.toLocaleString()}.-`;
}

function SelectedPartRow({
  part,
  onRemove,
  onIncreaseQty,
  onSelectCategory,
  categoryId,
  isActive,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelectCategory?.(categoryId)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectCategory?.(categoryId);
        }
      }}
      className={`relative flex cursor-pointer gap-3 border-b border-l-4 border-neutral-100 border-l-[#f97316] p-3 last:border-b-0 ${
        isActive ? "bg-neutral-100" : "bg-white hover:bg-neutral-50"
      }`}
    >
      <button
        type="button"
        aria-label="นำออก"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.(part.id);
        }}
        className="absolute right-2 top-2 text-neutral-400 hover:text-[#dc2626]"
      >
        <X size={16} />
      </button>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-box bg-neutral-50">
        {part.imageUrl ? (
          <img
            src={part.imageUrl}
            alt={part.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <Cpu className="h-6 w-6 text-neutral-300" strokeWidth={1} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 pr-4">
        <p className="line-clamp-3 text-xs font-medium text-neutral-700">
          {part.title}
        </p>
        <p className="text-sm font-bold text-[#f97316]">
          {formatPrice(part.price)}
        </p>
        <div className="flex items-center justify-between">
          <Link
            to="#"
            onClick={(e) => e.stopPropagation()}
            className="hardware-label normal-case text-secondary hover:text-[#f97316]"
          >
            รายละเอียด
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIncreaseQty?.(part.id);
            }}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700"
          >
            จำนวน x {part.qty}
            <Pencil size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BuildSidebar({
  activeCategory,
  onSelectCategory,
  selectedParts = [],
  onRemovePart,
  onIncreaseQty,
  onAddAllToCart,
  isAddingAllToCart = false,
}) {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useCategories({ includeInactive: false });

  const total = selectedParts.reduce(
    (sum, part) => sum + part.price * part.qty,
    0,
  );

  return (
    <aside className="flex h-fit flex-col gap-4">
      <div className="hardware-surface flex items-center justify-between px-4 py-3">
        <span className="text-sm font-bold text-neutral-900">รวมทั้งหมด</span>
        <span className="text-xl font-bold text-[#f97316]">
          {formatPrice(total)}
        </span>
      </div>

      <nav className="hardware-surface flex flex-col overflow-hidden">
        {isLoading &&
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-neutral-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
            </div>
          ))}

        {isError && (
          <p className="px-4 py-3 text-sm text-[#dc2626]">
            โหลดหมวดหมู่ไม่สำเร็จ
          </p>
        )}

        {!isLoading &&
          !isError &&
          categories.map((category, index) => {
            const isActive = String(category.id) === String(activeCategory);

            const selectedPart = selectedParts.find(
              (part) => String(part.categoryId) === String(category.id),
            );

            if (selectedPart) {
              return (
                <SelectedPartRow
                  key={category.id}
                  part={selectedPart}
                  onRemove={onRemovePart}
                  onIncreaseQty={onIncreaseQty}
                  onSelectCategory={onSelectCategory}
                  categoryId={category.id}
                  isActive={isActive}
                />
              );
            }

            const Icon = getCategoryIcon(category.name);

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={`flex items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left text-sm font-medium last:border-b-0 ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getCategoryIconBg(index)}`}
                >
                  <Icon size={16} />
                </span>
                {category.name}
              </button>
            );
          })}
      </nav>

      <button
        type="button"
        onClick={() => onAddAllToCart?.()}
        disabled={selectedParts.length === 0 || isAddingAllToCart}
        className="btn btn-accent gap-2 text-sm text-white disabled:opacity-50"
      >
        <ShoppingCart size={16} />
        {isAddingAllToCart ? "กำลังเพิ่มลงตะกร้า..." : "เพิ่มทั้งหมดลงตะกร้า"}
      </button>
    </aside>
  );
}

export default BuildSidebar;
