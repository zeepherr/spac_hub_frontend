import useAuthStore from "@/stores/auth.store";

import { ArrowLeft, ArrowRight, Info, Lock, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

import ProductCartCard from "@/components/cart/ProductCartCard";
import { useMyCart } from "@/hook/cart/useMyCart";
import { useCheckoutQuote } from "@/hook/checkout/useCheckoutQuote";

// ค่าบริการประกอบเครื่องยังไม่มีใน feeLines ที่ backend ส่งมา (POST /api/checkouts/quote ตอนนี้มีแค่
// PRODUCT_CHECKING กับ DELIVERY เท่านั้น) เลยเก็บไว้เป็นค่าคงที่ฝั่ง frontend บวกแยกต่างหากไปก่อน
// TODO: ถ้า backend เพิ่ม field นี้เข้า feeLines เมื่อไหร่ ให้เอาค่าคงที่นี้ออกแล้วใช้จาก quote อย่างเดียว
const ASSEMBLY_SERVICE_FEE = 400;

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
  onCheckout,
  checkoutDisabled,
}) {
  const hasSelection = itemCount > 0;
  // ตอนยังไม่มีของที่เลือกเลย ไม่ต้องรอ quote (ไม่มีอะไรให้คำนวณ) โชว์ 0 ไปเลย
  const isPending = hasSelection && (isQuoteLoading || !quote);
  const grandTotal = hasSelection ? (quote?.grandTotal ?? 0) : 0;

  return (
    <div className="hardware-surface p-5">
      <h2 className="mb-4 text-base font-bold text-neutral-900">
        สรุปคำสั่งซื้อ
      </h2>

      {hasSelection && isQuoteError ? (
        // โชว์ message จริงจาก backend แทน (เช่น 409 "listing X is no longer available")
        // เพราะบอกสาเหตุตรงๆ ว่าติดที่ชิ้นไหน ดีกว่าข้อความ generic ที่เดาสาเหตุไม่ได้
        <p className="mb-4 text-sm text-[#dc2626]">
          {quoteError?.response?.data?.message ||
            "คำนวณยอดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"}
        </p>
      ) : (
        <div className="flex flex-col gap-6 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">
              ยอดรวมสินค้า ({itemCount} ชิ้น)
            </span>
            <span className="font-medium text-neutral-900">
              {isPending ? "..." : formatPrice(quote?.subtotal ?? 0)}
            </span>
          </div>

          {/* feeLines มาจาก POST /api/checkouts/quote ตรงๆ (PRODUCT_CHECKING, DELIVERY ตอนนี้)
              ไม่ได้คำนวณเองฝั่ง frontend แล้ว ตาม contract ที่ backend ให้มา */}
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

          <label className="hardware-surface flex cursor-pointer items-start gap-3 p-3!">
            <input
              type="checkbox"
              checked={includeAssembly}
              onChange={onToggleAssembly}
              className="checkbox checkbox-sm text-[#f97316] inset-shadow-sm/25 mt-0.5"
            />
            <span className="flex-1">
              <span className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">
                  บริการประกอบเครื่อง
                </span>
                <span className="font-medium text-neutral-900">
                  +{formatPrice(ASSEMBLY_SERVICE_FEE)}
                </span>
              </span>
              <span className="hardware-label block normal-case text-secondary">
                ประกอบโดยช่างมืออาชีพ + จัดสายไฟให้เรียบร้อย
              </span>
            </span>
          </label>
        </div>
      )}

      <div className="hardware-divider my-4" />

      <div className="mb-4 flex items-end justify-between">
        <span className="text-base font-bold text-neutral-900">รวมทั้งหมด</span>
        <span className="text-right">
          <span className="block text-2xl font-bold text-neutral-900">
            {isPending ? "..." : formatPrice(grandTotal)}
          </span>
          <span className="hardware-label normal-case text-secondary">
            รวม VAT แล้ว
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={checkoutDisabled}
        className="btn btn-accent w-full gap-2 text-white disabled:opacity-50"
      >
        ดำเนินการชำระเงิน{itemCount > 0 && ` (${itemCount})`}
        <ArrowRight size={18} />
      </button>

      <p className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-400">
        <Lock size={12} />
        เข้ารหัสข้อมูลตลอดเส้นทาง
      </p>
    </div>
  );
}

// เอา isChildRoute/<Outlet /> ที่เคยใช้ตอน "cart/checkout" เป็น nested route ของหน้านี้ออกแล้ว (checkout
// แยกเป็น route จริง /checkoutstep1, /checkoutstep3 อยู่นอก "cart" ไปแล้ว ไม่ได้ซ้อนอยู่ใต้ path นี้อีกต่อไป
// ดู App.route.jsx) เลยไม่มี children route ให้ Outlet render อีกแล้ว
export default function CartPage() {
  const user = useAuthStore((store) => store.user);
  const navigate = useNavigate();

  // ตอนนี้ "เข้าหน้าตะกร้า" ต้อง login เท่านั้น (icon บน header ก็เด้งไป /login ให้แล้วถ้ายังไม่ login)
  // useEffect กันไว้อีกชั้น เผื่อมีคนพิมพ์ URL /cart ตรงๆ โดยไม่ได้กดผ่าน icon
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

  // เก็บเป็น "id ที่ถูกเอาออกจากตัวเลือก" แทนที่จะเก็บ "id ที่ถูกเลือก"
  // ข้อดีคือของใหม่ที่เพิ่งเพิ่มเข้าตะกร้าจะถูกเลือกไว้ให้อัตโนมัติโดยไม่ต้อง sync state ทุกครั้งที่ items เปลี่ยน
  const [includeAssembly, setIncludeAssembly] = useState(false);

  const [deselectedIds, setDeselectedIds] = useState(() => new Set());

  // Only ACTIVE listings are available for checkout.
  const isAvailable = (item) => item.listing?.status === "ACTIVE";

  // Unavailable items stay in the cart but cannot be selected.
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

  // Send only ACTIVE listings to the quote API.
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

  // Another buyer may reserve a listing after this cart was loaded.
  // Keep the item in the cart and refresh its latest status.
  useEffect(() => {
    if (quoteQuery.error?.response?.status !== 409) return;

    void refetchCart();
  }, [quoteQuery.error, refetchCart]);

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;

    // quote ด้านบนแค่ประมาณราคาให้ดูก่อน ไม่ได้ล็อกสต็อกหรือสร้างอะไรใน backend เลย (ตามที่ระบุไว้ใน spec)
    // การสร้างคำสั่งซื้อจริง (POST /api/checkouts) รวมถึงคำนวณ/ตรวจสอบราคาซ้ำ เกิดขึ้นที่หน้า /checkoutstep3
    // ตอนกดยืนยันที่ /checkoutstep1 แล้ว (เปลี่ยนจาก /cart/checkout เป็น /checkoutstep1 เพราะแยก step 1/3
    // ออกเป็น route จริงคนละหน้าแล้ว - ดู CheckoutStep1Page.jsx / CheckoutStep3Page.jsx)
    navigate("/checkoutstep1", {
      state: { items: selectedItems, includeAssembly },
    });
  };

  const checkoutDisabled =
    selectedItems.length === 0 ||
    (selectedItems.length > 0 && (quoteQuery.isLoading || quoteQuery.isError));

  // ยังไม่ login: useEffect ด้านบนกำลังเด้งไป /login อยู่ ไม่ต้อง render เนื้อหาหน้านี้เลย
  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between border-b border-neutral-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">ตะกร้าสินค้า</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {items.length} รายการ รอการตรวจสอบ
          </p>
        </div>
        <Link
          to="/products"
          className="hardware-label flex items-center gap-1 normal-case text-secondary hover:text-[#f97316]"
        >
          <ArrowLeft size={14} />
          เลือกซื้อสินค้าต่อ
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {isLoadingCart ? (
            <div className="hardware-surface h-40 animate-pulse bg-neutral-100" />
          ) : isErrorCart ? (
            <div className="hardware-surface flex h-40 items-center justify-center">
              <p className="text-sm text-[#dc2626]">
                โหลดตะกร้าสินค้าไม่สำเร็จ
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="hardware-surface flex h-40 items-center justify-center">
              <p className="text-sm text-neutral-400">ยังไม่มีสินค้าในตะกร้า</p>
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
                เลือกทั้งหมด ({selectedItems.length}/{selectableItems.length})
                เลือกทั้งหมด ({selectedItems.length}/{items.length})
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

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-box border border-dashed border-neutral-200 py-5 text-sm font-medium text-neutral-500 hover:border-[#f97316] hover:text-[#f97316]"
          >
            <Plus size={18} />
            เพิ่มสินค้าจากตลาด
          </button>
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
            onCheckout={handleCheckout}
            checkoutDisabled={checkoutDisabled}
          />
        </div>
      </div>
    </div>
  );
}
