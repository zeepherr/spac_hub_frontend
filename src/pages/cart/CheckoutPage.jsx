import { zodResolver } from "@hookform/resolvers/zod"; // ปรับตามที่โปรเจกต์คุณใช้จริง
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { z } from "zod";
import useAuthStore from "@/stores/auth.store"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useUpdateUserProfile } from "@/hook/user/useUpdateUserProfile"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useCheckoutQuote } from "@/hook/checkout/useCheckoutQuote"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useCreateCheckout } from "@/hook/checkout/useCreateCheckout"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useCreatePaymentCheckout } from "@/hook/payment/useCreatePaymentCheckout"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import CheckoutStep3 from "@/components/cart/CheckoutStep3";
import CheckoutStep1 from "@/components/cart/CheckoutStep1";

// รีแฟกเตอร์ตามที่เลือก "ยุบเหลือแค่ 2 หน้าจริง": หน้านี้เหลือแค่ step กรอกที่อยู่จัดส่งเสมอ
// (ไม่มี internal state machine เปลี่ยนหน้าในตัวเองอีกแล้ว) ระหว่างที่กำลังสร้าง checkout/payment
// (createCheckoutMutation / createPaymentMutation กำลัง pending) จะสลับไปโชว์การ์ด "กำลังนำคุณไปสู่หน้าชำระเงิน"
// (CheckoutStep3) ทับตรงนี้แทน แล้ว useCreatePaymentCheckout จะ redirect ออกจากแอปไป Stripe เองทันทีที่สำเร็จ
// หน้าจริงถัดไป (หลังจ่ายเงินผ่าน Stripe เสร็จ) คือ PaymentSuccessPage.jsx (Stripe success_url เด้งมาที่นั่นตรงๆ
// ไม่ผ่านหน้านี้อีกแล้ว) เลยเหลือแค่ 2 หน้าจริงตามที่คุยกัน: CheckoutPage (จัดส่ง+ชำระเงิน) กับ PaymentSuccessPage
// (ยืนยัน) - CheckoutStep2 (บริการเสริม) กับ CheckoutStep4 (การ์ดสำเร็จ) เลยไม่ได้ใช้ในไฟล์นี้แล้ว
// (CheckoutStep4 ยังใช้อยู่ใน PaymentSuccessPage.jsx เหมือนเดิม)
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

// เหลือ 3 ป้าย จัดส่ง / ชำระเงิน / ยืนยัน เหมือนเดิม แค่หน้านี้ตรึงไว้ที่ step 1 เสมอ (ไม่มี step 2/3 ให้ render
// ในไฟล์นี้แล้ว) เหมือนกับที่ทำใน PaymentSuccessPage.jsx (ตรึงไว้ที่ step 3 เสมอ) - ก็อปแพทเทิร์นเดียวกัน
const STEPS = [
  { id: 1, label: "จัดส่ง" },
  { id: 2, label: "ชำระเงิน" },
  { id: 3, label: "ยืนยัน" },
];
const CURRENT_STEP = 1;

function StepIndicator() {
  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((step, i) => {
        const isDone = step.id < CURRENT_STEP;
        const isCurrent = step.id === CURRENT_STEP;
        // เส้นขีดหลังวงกลมนี้เขียวตามไปด้วยถ้าสเต็ปนี้ผ่านไปแล้ว (ไม่ใช่แค่วงกลมเขียวเฉยๆ)
        const isLineDone = isDone;

        return (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  isCurrent
                    ? "bg-neutral-900 text-white"
                    : isDone
                      ? "bg-green-500 text-white"
                      : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {step.id}
              </span>
              <span
                className={`hardware-label normal-case ${
                  isCurrent ? "text-neutral-900" : "text-secondary"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 ${
                  isLineDone ? "bg-green-500" : "bg-neutral-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

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

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((store) => store.user);
  const updateUserProfile = useUpdateUserProfile();
  const createCheckoutMutation = useCreateCheckout();
  const createPaymentMutation = useCreatePaymentCheckout();

  // items/includeAssembly ถูกส่งมาจาก CartPage.jsx ตอนกด "ดำเนินการชำระเงิน" ผ่าน navigate(..., { state })
  // (รายละเอียดสินค้า title/thumbnail ต้องมาจากตรงนี้อยู่ดี เพราะ endpoint quote ไม่ได้คืนพวกนี้มาด้วย)
  // ถ้าเข้าหน้านี้ตรงๆ โดยไม่มี state (เช่น พิมพ์ URL เอง / refresh หน้าแล้ว state หาย) ให้เด้งกลับไปตะกร้า
  const items = location.state?.items ?? [];
  // ไม่มี step ให้แก้ไข/ติ๊กบริการประกอบเครื่องในหน้านี้แล้ว (เอา step "บริการเสริม" ออกไปแล้ว)
  // เลยอ่านมาจาก state ตรงๆ เฉยๆ ไม่ต้องเป็น useState
  const includeAssembly = location.state?.includeAssembly ?? false;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ยอดเงิน (subtotal/feeLines/feeTotal/grandTotal) ดึงจาก POST /api/checkouts/quote ตรงๆ
  // ไม่ได้คำนวณเองฝั่ง frontend จากของที่ CartPage.jsx ส่งมาให้ (เหมือนที่แก้ไปแล้วใน CartPage.jsx)
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

  // สร้าง checkout จาก listingId ของ items ที่เลือกไว้ ตามด้วยสร้าง payment session แล้วเด้งออกจากแอปไปหน้า
  // Stripe Checkout เลย (isProcessing ด้านล่างจะโชว์การ์ด CheckoutStep3 ทับฟอร์มไว้ระหว่างนี้ ไม่มี step
  // ให้ setCurrentStep สลับหน้าเองแบบเดิมแล้ว)
  // POST /api/checkouts ต้องการ body { listingIds: [...], shippingAddress: { recipientName, phone, address } }
  // shippingAddress สร้างจากค่าที่กรอกในฟอร์ม step 1 (shippingValues ที่ submitShippingAndPay ส่งมาให้)
  // ไม่ได้ดึงจาก user profile ซ้ำ เผื่อผู้ใช้กรอกที่อยู่จัดส่งไม่ตรงกับที่อยู่โปรไฟล์
  // useCreateCheckout mutationFn ชี้ตรงไปที่ createCheckout (ไม่ได้ห่อ payload ให้ในตัว hook) เลยห่อ object เองตรงนี้
  // TODO: includeAssembly ยังไม่ได้ส่งไปกับ createCheckoutMutation เพราะยังไม่รู้ว่า endpoint นี้รับ field นี้ไหม
  //
  // POST /api/payments/checkout - ตาม spec ที่ได้มา useCreatePaymentCheckout เอง "redirects the browser to
  // data.data.checkoutUrl in its onSuccess handler" อยู่แล้ว เลยไม่ต้องเช็ค/ยิง window.location.href เองซ้ำในนี้
  // useCreateCheckout มี onError/toast ในตัวเองแล้ว (เหมือน useUpdateUserProfile) เลยไม่ต้อง toast ซ้ำในนี้
  // TODO: ยังไม่เห็นว่า useCreatePaymentCheckout มี onError ในตัวรึเปล่า ถ้ายังไม่มี error ตอนสร้าง payment จะเงียบ
  const confirmCheckout = async (shippingValues) => {
    try {
      const listingIds = items.map((item) => item.listingId);
      const shippingAddress = {
        recipientName:
          `${shippingValues.firstName} ${shippingValues.lastName}`.trim(),
        phone: shippingValues.phone,
        address: shippingValues.address,
      };
      const checkout = await createCheckoutMutation.mutateAsync({
        listingIds,
        shippingAddress,
      });
      const checkoutId = checkout.data.id;

      // ไม่ต้องอ่านค่า return มาทำอะไรต่อ เพราะ hook นี้ redirect ให้เองแล้วตอน onSuccess
      await createPaymentMutation.mutateAsync(checkoutId);
    } catch (error) {
      // ล้มเหลว อยู่หน้าเดิมต่อ (ไม่มี step ให้ setCurrentStep กลับแล้ว - isProcessing จะหลุดเป็น false เอง
      // ทันทีที่ mutation ที่พังหยุด pending พอฟอร์ม/ปุ่มกลับมากดใหม่ได้)
      console.error("checkout failed:", error);
    }
  };

  // step 1 -> validate ฟอร์มที่อยู่จัดส่งก่อน แล้วบันทึกเป็นข้อมูลโปรไฟล์เลย (เหมือน EditProfile.jsx)
  // ใช้ hook เดียวกับหน้าแก้โปรไฟล์ (useUpdateUserProfile -> updateMe) toast สำเร็จ/ error มาจากในนั้นอัตโนมัติ
  // บันทึกโปรไฟล์สำเร็จแล้วไปต่อ "ชำระเงิน" ทันที (ไม่มี step บริการเสริมคั่นแล้ว) - ส่ง values (ที่กรอกในฟอร์ม)
  // ต่อให้ confirmCheckout ไปด้วย เพราะต้องเอาไปประกอบเป็น shippingAddress ตอนสร้าง checkout จริง
  const submitShippingAndPay = handleSubmit((values) => {
    updateUserProfile.mutate(values, {
      onSuccess: () => {
        confirmCheckout(values);
      },
    });
  });

  if (items.length === 0) return null;

  // true ระหว่างบันทึกโปรไฟล์ / สร้าง checkout / สร้าง payment session (ก่อนเด้งไป Stripe) - โชว์การ์ด
  // CheckoutStep3 ทับฟอร์มไว้ระหว่างนี้ ปุ่ม "ย้อนกลับ" ก็ปิดไว้ด้วยกันคนกดหนีระหว่างกำลังยิง request อยู่
  const isProcessing =
    updateUserProfile.isPending ||
    createCheckoutMutation.isPending ||
    createPaymentMutation.isPending;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <button
        type="button"
        onClick={() => navigate("/cart")}
        disabled={isProcessing}
        className="mb-4 flex items-center gap-1.5 rounded-field border border-neutral-200 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 hardware-shadow hover:border-[#f97316] hover:text-[#f97316] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft size={16} />
        ย้อนกลับ
      </button>

      <StepIndicator />

      {isProcessing ? (
        <div className="mx-auto max-w-xl">
          <CheckoutStep3 />
        </div>
      ) : (
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
              submitting={isProcessing}
            />
          </div>
        </div>
      )}
    </div>
  );
}
