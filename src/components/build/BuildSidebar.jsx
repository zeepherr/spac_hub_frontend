import { useCategories } from "@/hook/category/useCategory";
import { Cpu, Pencil, ShoppingCart, X } from "lucide-react";
import { Link } from "react-router";
import { getCategoryIcon } from "../auth/CatagorySidebar";

// เดียวกับ GLASS_PANEL/ITEM_ACTIVE/ITEM_IDLE ที่ใช้ใน CategorySidebar.jsx/MainNav.jsx - จางเท่ากัน
// ทั้งเว็บ ไม่ใช่แก้วคนละความเข้ม แถวหมวดหมู่ที่ active เปลี่ยนจากเส้น border-l เดิมมาเป็น pill สีส้ม
// ทึบลอยขึ้นมาแทน ให้เข้าธีมเดียวกับ CategorySidebar.jsx
const GLASS_PANEL =
  "bg-white/50 backdrop-blur-xl border border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const ITEM_ACTIVE =
  "bg-[#f97316] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(249,115,22,0.35)]";
const ITEM_IDLE = "text-neutral-700 hover:bg-white/40";
const CTA_GLASS =
  "bg-[#f97316] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

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
      aria-current={isActive ? "true" : undefined}
      className={`relative flex cursor-pointer gap-3 rounded-xl p-3 transition-colors duration-150 ${
        isActive
          ? "bg-[#f97316]/15 border border-orange-200/70"
          : "border border-transparent hover:bg-white/40"
      }`}
    >
      <button
        type="button"
        aria-label="Remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.(part.id);
        }}
        className="absolute right-2 top-2 text-neutral-300 hover:text-[#dc2626]"
      >
        <X size={16} />
      </button>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-50">
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
            className="text-[11px] font-medium text-neutral-400 hover:text-[#f97316]"
          >
            Details
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIncreaseQty?.(part.id);
            }}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700"
          >
            Qty x {part.qty}
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
      <div
        className={`flex items-center justify-between rounded-2xl px-4 py-3 ${GLASS_PANEL}`}
      >
        <span className="text-sm font-semibold text-neutral-900">Total</span>
        <span className="text-xl font-bold text-[#f97316]">
          {formatPrice(total)}
        </span>
      </div>

      <nav className={`flex flex-col gap-1 rounded-2xl p-2 ${GLASS_PANEL}`}>
        {isLoading &&
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-neutral-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
            </div>
          ))}

        {isError && (
          <p className="px-4 py-3 text-sm text-[#dc2626]">
            Failed to load categories
          </p>
        )}

        {!isLoading &&
          !isError &&
          categories.map((category) => {
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
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors duration-150 ${
                  isActive ? ITEM_ACTIVE : ITEM_IDLE
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
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
        className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition disabled:opacity-50 ${CTA_GLASS}`}
      >
        <ShoppingCart size={16} />
        {isAddingAllToCart ? "Adding to cart..." : "Add All to Cart"}
      </button>
    </aside>
  );
}

export default BuildSidebar;
