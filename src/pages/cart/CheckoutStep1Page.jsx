import { zodResolver } from "@hookform/resolvers/zod"; // ปรับตามที่โปรเจกต์คุณใช้จริง
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { z } from "zod";
import useAuthStore from "@/stores/auth.store"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useUpdateUserProfile } from "@/hook/user/useUpdateUserProfile"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useCheckoutQuote } from "@/hook/checkout/useCheckoutQuote"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import CheckoutStep1 from "@/components/cart/CheckoutStep1";
import CheckoutStepIndicator from "@/components/cart/CheckoutStepLine";

// หน้านี้คือ route จริง /checkoutstep1 (จัดส่ง) แยกออกจาก /checkoutstep2 (การ์ด "กำลังนำคุณไปสู่หน้าชำระเงิน"
// + ยิง createCheckout/createPayment จริง - เดิมชื่อ /checkoutstep3 แต่เปลี่ยนเลขให้ตรงกับ indicator step 2
// "ชำระเงิน" แล้ว) กด "ดำเนินการชำระเงิน" แล้ว URL จะเปลี่ยนไป /checkoutstep2 จริงๆ
// flow เต็มๆ: /checkoutstep1 (ไฟล์นี้) -> /checkoutstep2 -> Stripe -> /payment/success -> /checkoutstep3
// (การ์ดสำเร็จ)
const ASSEMBLY_SERVICE_FEE = 400;

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

// field เหมือนฟอร์ม EditProfile.jsx เป๊ะ (ชื่อ/นามสกุลแยกกัน + ที่อยู่ช่องเดียว) แค่ตัด email ออก
const shippingSchema = z.object({
  firstName: z.string().trim().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล"),
  phone: z
    .string()
    .trim()
    .min(1, "กรุณากรอกเบอร์โทรศัพท์")
    .regex(/^0[0-9]{8,9}$/, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
  address: z
    .string()
    .trim()
    .min(1, "กรุณากรอกที่อยู่")
    .max(500, "ที่อยู่ต้องไม่เกิน 500 ตัวอักษร"),
});

function OrderSummary({
  items,
  quote,
  isQuoteLoading,
  isQuoteError,
  quoteError,
  includeAssembly,
  onContinue,
  submitting,
}) {
  const hasItems = items.length > 0;
  // ตอนยังไม่มี quote กลับมา (กำลังโหลด/ยังไม่เคยยิง) โชว์ "..." แทนเลขที่เดาไม่ได้ ไม่ใช้เลขคำนวณเองฝั่ง frontend
  const isPending = hasItems && (isQuoteLoading || !quote);
  const grandTotal = hasItems
    ? (quote?.grandTotal ?? 0) + (includeAssembly ? ASSEMBLY_SERVICE_FEE : 0)
    : 0;

  return (
    <div className="matte sticky top-24 p-6 text-white">
      <h2 className="mb-4 text-lg font-bold">สรุปคำสั่งซื้อ</h2>

      <div className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 text-sm">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4"
          >
            <span className="line-clamp-1 text-neutral-300">
              {item.listing.title}
            </span>
            <span className="shrink-0 font-medium">
              {formatPrice(Number(item.listing.price))}
            </span>
          </div>
        ))}
      </div>

      {hasItems && isQuoteError ? (
        // โชว์ message จริงจาก backend แทน (เช่น listing บางชิ้นสถานะไม่ใช่ ACTIVE แล้ว)
        <p className="mb-4 text-sm text-red-300">
          {quoteError?.response?.data?.message ||
            "คำนวณยอดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"}
        </p>
      ) : (
        <div className="flex flex-col gap-2 text-sm text-neutral-300">
          {/* feeLines มาจาก POST /api/checkouts/quote ตรงๆ (PRODUCT_CHECKING, DELIVERY ตอนนี้)
              ไม่ได้คำนวณเองฝั่ง frontend แล้ว ตาม contract ที่ backend ให้มา */}
          {isPending ? (
            <div className="flex items-center justify-between">
              <span>กำลังคำนวณยอด...</span>
            </div>
          ) : (
            (quote?.feeLines ?? []).map((fee) => (
              <div key={fee.code} className="flex items-center justify-between">
                <span>{fee.label}</span>
                <span className="font-medium text-white">
                  {formatPrice(fee.amount)}
                </span>
              </div>
            ))
          )}
          {includeAssembly && (
            <div className="flex items-center justify-between">
              <span>บริการประกอบเครื่อง</span>
              <span className="font-medium text-white">
                {formatPrice(ASSEMBLY_SERVICE_FEE)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-green-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} />
              SpecHub Escrow
            </span>
            <span>รวมอยู่แล้ว</span>
          </div>
        </div>
      )}

      <div className="my-4 h-px bg-white/10" />

      <div className="mb-5 flex items-end justify-between">
        <span className="text-base font-bold">รวมทั้งหมด</span>
        <span className="text-2xl font-bold">
          {isPending ? "..." : formatPrice(grandTotal)}
        </span>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={submitting}
        className="btn btn-accent w-full gap-2 text-white disabled:opacity-50"
      >
        ดำเนินการชำระเงิน
        <ArrowRight size={18} />
      </button>

      <p className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-400">
        <Lock size={12} />
        เข้ารหัสข้อมูลตลอดเส้นทาง
      </p>
    </div>
  );
}

export default function CheckoutStep1Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((store) => store.user);
  const updateUserProfile = useUpdateUserProfile();

  // items/includeAssembly ถูกส่งมาจาก CartPage.jsx / ListingDetailPage.jsx (ปุ่ม "ซื้อเลย") ตอน navigate มาที่
  // หน้านี้ผ่าน { state } (รายละเอียดสินค้า title/thumbnail ต้องมาจากตรงนี้อยู่ดี เพราะ endpoint quote ไม่ได้
  // คืนพวกนี้มาด้วย) ถ้าเข้าหน้านี้ตรงๆ โดยไม่มี state (เช่น พิมพ์ URL เอง / refresh หน้าแล้ว state หาย)
  // ให้เด้งกลับไปตะกร้า
  const items = location.state?.items ?? [];
  const includeAssembly = location.state?.includeAssembly ?? false;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ยอดเงิน (subtotal/feeLines/feeTotal/grandTotal) ดึงจาก POST /api/checkouts/quote ตรงๆ ไม่ได้คำนวณเองฝั่ง
  // frontend
  const listingIds = useMemo(
    () => items.map((item) => item.listingId),
    [items],
  );
  const quoteQuery = useCheckoutQuote(listingIds);
  const quote = quoteQuery.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
    },
  });

  // เผื่อ user ใน store ยังโหลดไม่เสร็จตอน mount (ค่าว่างตอนแรก) พอโหลดเสร็จค่อย reset ฟอร์มให้เป็นข้อมูลจริง
  // TODO: useAuthStore's user เป็นข้อมูล auth เบาๆ ไม่แน่ใจว่ามี phone/address ติดมาด้วยรึเปล่า
  // (ใน EditProfile.jsx ข้อมูลพวกนี้ดึงแยกผ่าน useProfileForm() ต่างหาก) ถ้า user.phone/user.address
  // ว่างเปล่าตลอด ให้บอกผมว่ามี hook ดึงโปรไฟล์เต็ม (เช่น useMyProfile) รึเปล่า จะสลับมาใช้อันนั้นแทน
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // step 1 -> validate ฟอร์มที่อยู่จัดส่งก่อน แล้วบันทึกเป็นข้อมูลโปรไฟล์เลย (เหมือน EditProfile.jsx) ใช้ hook
  // เดียวกับหน้าแก้โปรไฟล์ (useUpdateUserProfile -> updateMe) toast สำเร็จ/error มาจากในนั้นอัตโนมัติ
  // บันทึกโปรไฟล์สำเร็จแล้ว navigate ไปหน้า /checkoutstep2 จริงๆ (เปลี่ยน URL) พร้อม state items/includeAssembly/
  // shippingAddress ที่ประกอบจากฟอร์มตรงนี้ - การสร้าง checkout/payment จริง (POST /api/checkouts,
  // POST /api/payments/checkout) ย้ายไปทำที่ CheckoutStep2Page.jsx แทน (หน้าโน้นเป็นคนยิง mutation เอง
  // ตอน mount ไม่ใช่ที่นี่แล้ว)
  const submitShippingAndPay = handleSubmit((values) => {
    updateUserProfile.mutate(values, {
      onSuccess: () => {
        const shippingAddress = {
          recipientName: `${values.firstName} ${values.lastName}`.trim(),
          phone: values.phone,
          address: values.address,
        };
        navigate("/checkoutstep2", {
          state: { items, includeAssembly, shippingAddress },
        });
      },
    });
  });

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <button
        type="button"
        onClick={() => navigate("/cart")}
        disabled={updateUserProfile.isPending}
        className="mb-4 flex items-center gap-1.5 rounded-field border border-neutral-200 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 hardware-shadow hover:border-[#f97316] hover:text-[#f97316] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft size={16} />
        ย้อนกลับ
      </button>

      <CheckoutStepIndicator currentStep={1} />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <CheckoutStep1 register={register} errors={errors} />
        </div>

        <div>
          <OrderSummary
            items={items}
            quote={quote}
            isQuoteLoading={quoteQuery.isLoading}
            isQuoteError={quoteQuery.isError}
            quoteError={quoteQuery.error}
            includeAssembly={includeAssembly}
            onContinue={submitShippingAndPay}
            submitting={updateUserProfile.isPending}
          />
        </div>
      </div>
    </div>
  );
}
