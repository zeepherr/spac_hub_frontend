import useAuthStore from "@/stores/auth.store";

import { ArrowLeft, ArrowRight, Info, Lock, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

import ProductCartCard from "@/components/cart/ProductCartCard";
import { useMyCart } from "@/hook/cart/useMyCart";
import { useCheckoutQuote } from "@/hook/checkout/useCheckoutQuote";

const ASSEMBLY_SERVICE_FEE = 400;

const REQUIRED_ASSEMBLY_CATEGORIES = [
  "CPU",
  "Mainboard",
  "RAM",
  "Storage",
  "Power Supply",
  "Case",
];

function getMissingAssemblyCategories(items) {
  const presentNames = new Set(
    items.map((item) => item.listing?.category?.name).filter(Boolean),
  );
  return REQUIRED_ASSEMBLY_CATEGORIES.filter((name) => !presentNames.has(name));
}

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

function OrderSummary({
  itemCount,
  quote,
  isQuoteLoading,
  isQuoteError,
  quoteError,
  includeAssembly,
  onToggleAssembly,
  missingAssemblyCategories = [],
  onCheckout,
  checkoutDisabled,
}) {
  const isAssemblyLocked = missingAssemblyCategories.length > 0;
  const hasSelection = itemCount > 0;
  const isPending = hasSelection && (isQuoteLoading || !quote);
  const grandTotal = hasSelection ? (quote?.grandTotal ?? 0) : 0;

  return (
    <div className="hardware-surface p-5">
      <h2 className="mb-4 text-base font-bold text-neutral-900">
        Order Summary
      </h2>

      {hasSelection && isQuoteError ? (
        <p className="mb-4 text-sm text-[#dc2626]">
          {quoteError?.response?.data?.message ||
            "Failed to calculate total. Please try again."}
        </p>
      ) : (
        <div className="flex flex-col gap-6 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">
              Items total ({itemCount} items)
            </span>
            <span className="font-medium text-neutral-900">
              {isPending ? "..." : formatPrice(quote?.subtotal ?? 0)}
            </span>
          </div>

          {hasSelection &&
            !isPending &&
            (quote?.feeLines ?? []).map((fee) => (
              <div key={fee.code}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-neutral-500">
                    {fee.label}
                    {fee.code === "PRODUCT_CHECKING" && (
                      <Info size={12} className="text-neutral-300" />
                    )}
                  </span>
                  <span className="font-medium text-neutral-900">
                    {formatPrice(fee.amount)}
                  </span>
                </div>
              </div>
            ))}

          <label
            className={`hardware-surface flex items-start gap-3 p-3! ${
              isAssemblyLocked
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              checked={includeAssembly}
              onChange={onToggleAssembly}
              disabled={isAssemblyLocked}
              className="checkbox checkbox-sm text-[#f97316] inset-shadow-sm/25 mt-0.5 disabled:cursor-not-allowed"
            />
            <span className="flex-1">
              <span className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">
                  Assembly Service
                </span>
                <span className="font-medium text-neutral-900">
                  +{formatPrice(ASSEMBLY_SERVICE_FEE)}
                </span>
              </span>
              <span className="hardware-label block normal-case text-secondary">
                Professional assembly + tidy cable management
              </span>
              {isAssemblyLocked && (
                <span className="mt-1 block text-xs text-[#dc2626]">
                  Requires items in the following categories first:{" "}
                  {missingAssemblyCategories.join(", ")}
                </span>
              )}
            </span>
          </label>
        </div>
      )}

      <div className="hardware-divider my-4" />

      <div className="mb-4 flex items-end justify-between">
        <span className="text-base font-bold text-neutral-900">Total</span>
        <span className="text-right">
          <span className="block text-2xl font-bold text-neutral-900">
            {isPending ? "..." : formatPrice(grandTotal)}
          </span>
          <span className="hardware-label normal-case text-secondary">
            VAT included
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={checkoutDisabled}
        className="btn btn-accent w-full gap-2 text-white disabled:opacity-50"
      >
        Proceed to Checkout{itemCount > 0 && ` (${itemCount})`}
        <ArrowRight size={18} />
      </button>

      <p className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-400">
        <Lock size={12} />
        End-to-end encrypted
      </p>
    </div>
  );
}

export default function CartPage() {
  const user = useAuthStore((store) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const {
    data: items = [],
    isLoading: isLoadingCart,
    isError: isErrorCart,
    refetch: refetchCart,
  } = useMyCart();

  const [includeAssembly, setIncludeAssembly] = useState(false);
  const [deselectedIds, setDeselectedIds] = useState(() => new Set());

  const isAvailable = (item) => item.listing?.status === "ACTIVE";

  const isSelected = (item) => isAvailable(item) && !deselectedIds.has(item.id);

  const toggleSelect = (item) => {
    if (!isAvailable(item)) return;

    setDeselectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }

      return next;
    });
  };

  const selectableItems = items.filter((item) => isAvailable(item));

  const allSelected =
    selectableItems.length > 0 &&
    selectableItems.every((item) => isSelected(item));

  const toggleSelectAll = () => {
    setDeselectedIds((prev) => {
      const next = new Set(prev);

      for (const item of selectableItems) {
        if (allSelected) {
          next.add(item.id);
        } else {
          next.delete(item.id);
        }
      }

      return next;
    });
  };

  const selectedItems = items.filter((item) => isSelected(item));

  const missingAssemblyCategories = useMemo(
    () => getMissingAssemblyCategories(selectedItems),
    [selectedItems],
  );

  useEffect(() => {
    if (includeAssembly && missingAssemblyCategories.length > 0) {
      setIncludeAssembly(false);
    }
  }, [includeAssembly, missingAssemblyCategories]);

  const listingIds = useMemo(
    () =>
      items
        .filter(
          (item) =>
            item.listing?.status === "ACTIVE" && !deselectedIds.has(item.id),
        )
        .map((item) => item.listingId),
    [items, deselectedIds],
  );

  const quoteQuery = useCheckoutQuote(listingIds, includeAssembly);
  const quote = quoteQuery.data;

  useEffect(() => {
    if (quoteQuery.error?.response?.status !== 409) return;

    void refetchCart();
  }, [quoteQuery.error, refetchCart]);

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;

    navigate("/checkoutstep1", {
      state: { items: selectedItems, includeAssembly },
    });
  };

  const checkoutDisabled =
    selectedItems.length === 0 ||
    (selectedItems.length > 0 && (quoteQuery.isLoading || quoteQuery.isError));

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between border-b border-neutral-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Shopping Cart</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {items.length} items pending review
          </p>
        </div>
        <Link
          to="/products"
          className="hardware-label flex items-center gap-1 normal-case text-secondary hover:text-[#f97316]"
        >
          <ArrowLeft size={14} />
          Continue Shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {isLoadingCart ? (
            <div className="hardware-surface h-40 animate-pulse bg-neutral-100" />
          ) : isErrorCart ? (
            <div className="hardware-surface flex h-40 items-center justify-center">
              <p className="text-sm text-[#dc2626]">Failed to load cart</p>
            </div>
          ) : items.length === 0 ? (
            <div className="hardware-surface flex h-40 items-center justify-center">
              <p className="text-sm text-neutral-400">Your cart is empty</p>
            </div>
          ) : (
            <div className="hardware-surface flex flex-col gap-4 p-4">
              <label className="flex items-center gap-2 border-b border-neutral-100 pb-3 text-sm font-medium text-neutral-700">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  disabled={selectableItems.length === 0}
                  className="checkbox checkbox-sm text-[#f97316] inset-shadow-sm/25 disabled:cursor-not-allowed disabled:opacity-40"
                />
                Select all ({selectedItems.length}/{selectableItems.length})
              </label>

              {items.map((item) => (
                <ProductCartCard
                  key={item.id}
                  item={item}
                  selected={isSelected(item)}
                  onToggleSelect={() => toggleSelect(item)}
                />
              ))}
            </div>
          )}

          <Link
            to="/products"
            className="flex items-center justify-center gap-2 rounded-box border border-dashed border-neutral-200 py-5 text-sm font-medium text-neutral-500 hover:border-[#f97316] hover:text-[#f97316]"
          >
            <Plus size={18} />
            Add products from marketplace
          </Link>
        </div>

        <div>
          <OrderSummary
            itemCount={selectedItems.length}
            quote={quote}
            isQuoteLoading={quoteQuery.isLoading}
            isQuoteError={quoteQuery.isError}
            quoteError={quoteQuery.error}
            includeAssembly={includeAssembly}
            onToggleAssembly={() => setIncludeAssembly((prev) => !prev)}
            missingAssemblyCategories={missingAssemblyCategories}
            onCheckout={handleCheckout}
            checkoutDisabled={checkoutDisabled}
          />
        </div>
      </div>
    </div>
  );
}
