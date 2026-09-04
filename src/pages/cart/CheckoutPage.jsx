import { zodResolver } from "@hookform/resolvers/zod"; // ปรับตามที่โปรเจกต์คุณใช้จริง
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import useAuthStore from "@/stores/auth.store"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useUpdateUserProfile } from "@/hook/user/useUpdateUserProfile"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useCreateCheckout } from "@/hook/checkout/useCreateCheckout"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useCreatePaymentCheckout } from "@/hook/payment/useCreatePaymentCheckout"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import CheckoutStep4 from "@/components/cart/CheckoutStep4";
import CheckoutStep3 from "@/components/cart/CheckoutStep3";
import CheckoutStep1 from "@/components/cart/CheckoutStep1";
import CheckoutStep2 from "@/components/cart/CheckoutStep2";

const INSPECTION_FEE_PER_ITEM = 50;
const INSPECTION_FEE_CAP = 250;
const ASSEMBLY_SERVICE_FEE = 400;
const SHIPPING_FEE = 150;

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

// Step 3 "ชำระเงิน" กลับมาโชว์ในแถบนี้แล้ว แต่ในแอปเป็นแค่หน้า transient สั้นๆ (กำลังสร้าง checkout/payment)
// ก่อนเด้งออกไปหน้า Stripe Checkout จริง ไม่ใช่หน้าที่ผู้ใช้กรอกข้อมูลบัตรเอง
const STEPS = [
  { id: 1, label: "จัดส่ง" },
  { id: 2, label: "บริการเสริม" },
  { id: 3, label: "ชำระเงิน" },
  { id: 4, label: "ยืนยัน" },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((step, i) => {
        const isDone = step.id < currentStep;
        const isCurrent = step.id === currentStep;
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

// เหมือน calculateSummary ใน CartPage.jsx เป๊ะ (ยกมาเผื่อผู้ใช้เปลี่ยนใจติ๊ก/ถอดบริการประกอบตอน checkout)
function calculateSummary(items, includeAssembly) {
  const itemCount = items.length;
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.listing.price),
    0,
  );
  const inspectionFee =
    itemCount > 0
      ? Math.min(itemCount * INSPECTION_FEE_PER_ITEM, INSPECTION_FEE_CAP)
      : 0;
  const shipping = itemCount > 0 ? SHIPPING_FEE : 0;
  const assemblyServiceFee = ASSEMBLY_SERVICE_FEE;
  const total =
    subtotal +
    inspectionFee +
    shipping +
    (includeAssembly ? assemblyServiceFee : 0);

  return {
    itemCount,
    subtotal,
    inspectionFee,
    assemblyServiceFee,
    shipping,
    total,
  };
}

function OrderSummary({
  items,
  summary,
  includeAssembly,
  continueLabel,
  onContinue,
  submitting,
}) {
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

      <div className="flex flex-col gap-2 text-sm text-neutral-300">
        <div className="flex items-center justify-between">
          <span>ค่าตรวจสอบสินค้า</span>
          <span className="font-medium text-white">
            {formatPrice(summary.inspectionFee)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>ค่าจัดส่ง</span>
          <span className="font-medium text-white">
            {formatPrice(summary.shipping)}
          </span>
        </div>
        {includeAssembly && (
          <div className="flex items-center justify-between">
            <span>บริการประกอบเครื่อง</span>
            <span className="font-medium text-white">
              {formatPrice(summary.assemblyServiceFee)}
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

      <div className="my-4 h-px bg-white/10" />

      <div className="mb-5 flex items-end justify-between">
        <span className="text-base font-bold">รวมทั้งหมด</span>
        <span className="text-2xl font-bold">{formatPrice(summary.total)}</span>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={submitting}
        className="btn btn-accent w-full gap-2 text-white disabled:opacity-50"
      >
        {continueLabel}
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
  // ถ้าเข้าหน้านี้ตรงๆ โดยไม่มี state (เช่น พิมพ์ URL เอง / refresh หน้าแล้ว state หาย) ให้เด้งกลับไปตะกร้า
  const items = location.state?.items ?? [];
  const [includeAssembly, setIncludeAssembly] = useState(
    location.state?.includeAssembly ?? false,
  );
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const summary = calculateSummary(items, includeAssembly);

  // step 1 -> validate ฟอร์มที่อยู่จัดส่งก่อน แล้วบันทึกเป็นข้อมูลโปรไฟล์เลย (เหมือน EditProfile.jsx)
  // ใช้ hook เดียวกับหน้าแก้โปรไฟล์ (useUpdateUserProfile -> updateMe) toast สำเร็จ/ error มาจากในนั้นอัตโนมัติ
  const goToStep2 = handleSubmit((values) => {
    updateUserProfile.mutate(values, {
      onSuccess: () => {
        setCurrentStep(2);
      },
    });
  });

  // step 2 -> เข้า step 3 (หน้า transient "กำลังนำไปสู่หน้าชำระเงิน") ทันทีที่กด แล้วค่อยสร้าง checkout
  // จาก listingId ของ items ที่เลือกไว้ ตามด้วยสร้าง payment session แล้วเด้งออกจากแอปไปหน้า Stripe Checkout
  // POST /api/checkouts body: { listingIds: [...] } ตาม useCreateCheckout จริงที่ให้มา
  // TODO: includeAssembly ยังไม่ได้ส่งไปกับ createCheckoutMutation เพราะยังไม่รู้ว่า endpoint นี้รับ field นี้ไหม
  // TODO: ยังไม่เห็นโค้ด/response จริงของ useCreatePaymentCheckout เดาว่า response หน้าตาแบบ Stripe Checkout
  // Session ปกติคือ { data: { url } } - ถ้า field จริงชื่ออื่น (เช่น checkoutUrl, sessionUrl) ปรับตรงนี้ให้ตรง
  const confirmCheckout = async () => {
    setCurrentStep(3);

    try {
      const listingIds = items.map((item) => item.listingId);
      const checkout = await createCheckoutMutation.mutateAsync(listingIds);
      const checkoutId = checkout.data.id;

      const payment = await createPaymentMutation.mutateAsync(checkoutId);
      const stripeUrl = payment?.data?.url;

      if (stripeUrl) {
        // ออกจากแอปไป Stripe Checkout จริงๆ (ไม่ใช่ navigate ภายในแอป)
        window.location.href = stripeUrl;
      } else {
        // เผื่อ backend ยังไม่คืน url การชำระเงินมา (เช่น hook ยังทำไม่เสร็จ) อย่างน้อยพาไปหน้ายืนยันในแอปแทน
        // ไม่ให้ผู้ใช้ค้างอยู่หน้า "กำลังนำไปสู่หน้าชำระเงิน" เฉยๆ โดยไม่รู้ว่าเกิดอะไรขึ้น
        setCurrentStep(4);
      }
    } catch (error) {
      // useCreateCheckout / useCreatePaymentCheckout จริงไม่มี onError/toast ในตัว (ไม่เหมือน useUpdateUserProfile)
      // เลยต้อง toast.error เองตรงนี้ ไม่งั้น error ตอนสร้าง checkout/payment จะเงียบ ผู้ใช้ไม่รู้ว่าทำไมปุ่มไม่ไปต่อ
      toast.error(
        error.response?.data?.message ||
          "สร้างคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        { position: "top-right" },
      );
      console.error("checkout failed:", error);
      // ล้มเหลว พากลับไป step 2 ให้กดลองใหม่ได้ (ไม่ปล่อยค้างอยู่หน้า transient ของ step 3)
      setCurrentStep(2);
    }
  };

  // ปุ่มย้อนกลับกลาง ๆ เหนือ StepIndicator ใช้ร่วมกันทุก step ที่ย้อนได้ (1, 2) ส่วน step 3 (กำลังส่งคำขออยู่)
  // และ step 4 (จบ flow แล้ว) ไม่ให้ย้อนกลับ
  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/cart");
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {(currentStep === 1 || currentStep === 2) && (
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 flex items-center gap-1.5 rounded-field border border-neutral-200 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 hardware-shadow hover:border-[#f97316] hover:text-[#f97316]"
        >
          <ArrowLeft size={16} />
          ย้อนกลับ
        </button>
      )}

      <StepIndicator currentStep={currentStep} />

      {currentStep === 4 ? (
        <div className="mx-auto max-w-xl">
          <CheckoutStep4 />
        </div>
      ) : currentStep === 3 ? (
        <div className="mx-auto max-w-xl">
          <CheckoutStep3 />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            {currentStep === 1 && (
              <CheckoutStep1 register={register} errors={errors} />
            )}

            {currentStep === 2 && (
              <CheckoutStep2
                includeAssembly={includeAssembly}
                onToggleAssembly={() => setIncludeAssembly((prev) => !prev)}
              />
            )}
          </div>

          <div>
            <OrderSummary
              items={items}
              summary={summary}
              includeAssembly={includeAssembly}
              continueLabel={
                currentStep === 1 ? "ไปขั้นตอนถัดไป" : "ดำเนินการชำระเงิน"
              }
              onContinue={currentStep === 1 ? goToStep2 : confirmCheckout}
              submitting={
                currentStep === 1
                  ? updateUserProfile.isPending
                  : createCheckoutMutation.isPending ||
                    createPaymentMutation.isPending
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
