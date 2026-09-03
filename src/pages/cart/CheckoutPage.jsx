import { zodResolver } from "@hookform/resolvers/zod"; // ปรับตามที่โปรเจกต์คุณใช้จริง
import { ArrowLeft, ArrowRight, Lock, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import useAuthStore from "@/stores/auth.store"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useUpdateUserProfile } from "@/hook/user/useUpdateUserProfile"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useCreateCheckout } from "@/hook/checkout/useCreateCheckout"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useCreatePaymentCheckout } from "@/hook/payment/useCreatePaymentCheckout";

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

// step 1 (จัดส่ง) และ step 2 (บริการเสริม) ทำงานจริงแล้ว ส่วน 3/4 ยังเป็นแค่ visual รอทำ flow ชำระเงินจริง
const STEPS = [
  { id: 1, label: "จัดส่ง" },
  { id: 2, label: "บริการเสริม" },
  { id: 3, label: "ชำระเงิน" },
  { id: 4, label: "ยืนยัน" },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                step.id === currentStep
                  ? "bg-neutral-900 text-white"
                  : step.id < currentStep
                    ? "bg-[#f97316] text-white"
                    : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {step.id}
            </span>
            <span
              className={`hardware-label normal-case ${
                step.id === currentStep ? "text-neutral-900" : "text-secondary"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="mx-2 h-px flex-1 bg-neutral-200" />
          )}
        </div>
      ))}
    </div>
  );
}

// ก็อปสไตล์มาจาก FormInput ใน EditProfile.jsx ให้ข้อมูลจัดส่งหน้าตาเหมือนกัน
function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  error,
  inputProps,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-neutral-800"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
          error
            ? "border-red-500"
            : "border-neutral-300 focus:border-orange-500"
        }`}
        {...inputProps}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
  // ผ่านแล้วค่อยไป step 2 ต่อ (ยังไม่เกี่ยวกับการสร้าง order จริง อันนั้นรอ endpoint แยกต่างหาก)
  const goToStep2 = handleSubmit((values) => {
    updateUserProfile.mutate(values, {
      onSuccess: () => {
        setCurrentStep(2);
      },
    });
  });

  // step 2 -> สร้าง checkout จาก listingId ของ items ที่เลือกไว้ แล้วต่อด้วยสร้าง payment
  // POST /api/checkouts body: { listingIds: [...] } ตาม useCreateCheckout จริงที่ให้มา
  // (เหมือน handleBuyNow ที่ให้มา แค่ปรับจาก listingId เดี่ยวเป็น array เพราะตะกร้าเลือกได้หลายชิ้น)
  // TODO: includeAssembly ยังไม่ได้ส่งไปกับ createCheckoutMutation เพราะยังไม่รู้ว่า endpoint นี้รับ field นี้ไหม
  const confirmCheckout = async () => {
    try {
      const listingIds = items.map((item) => item.listingId);
      const checkout = await createCheckoutMutation.mutateAsync(listingIds);
      const checkoutId = checkout.data.id;

      createPaymentMutation.mutate(checkoutId);
    } catch (error) {
      // useCreateCheckout จริงมีแค่ mutationFn เฉยๆ ไม่มี onError/toast ในตัว (ไม่เหมือน useUpdateUserProfile)
      // เลยต้อง toast.error เองตรงนี้ ไม่งั้น error ตอนสร้าง checkout จะเงียบ ผู้ใช้ไม่รู้ว่าทำไมปุ่มไม่ไปต่อ
      toast.error(
        error.response?.data?.message ||
          "สร้างคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        { position: "top-right" },
      );
      console.error("checkout failed:", error);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <StepIndicator currentStep={currentStep} />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          {currentStep === 1 && (
            <div className="hardware-surface p-6">
              <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-neutral-900">
                <Truck size={18} className="text-[#f97316]" />
                ข้อมูลการจัดส่ง
              </h2>

              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormInput
                    id="firstName"
                    label="ชื่อ"
                    placeholder="กรอกชื่อ"
                    error={errors.firstName?.message}
                    inputProps={register("firstName")}
                  />

                  <FormInput
                    id="lastName"
                    label="นามสกุล"
                    placeholder="กรอกนามสกุล"
                    error={errors.lastName?.message}
                    inputProps={register("lastName")}
                  />
                </div>

                <FormInput
                  id="phone"
                  label="เบอร์โทรศัพท์"
                  type="tel"
                  placeholder="0812345678"
                  error={errors.phone?.message}
                  inputProps={register("phone")}
                />

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-neutral-800"
                  >
                    ที่อยู่
                  </label>

                  <textarea
                    id="address"
                    rows={5}
                    placeholder="กรอกที่อยู่สำหรับจัดส่ง"
                    className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-neutral-900 outline-none transition focus:ring-2 ${
                      errors.address
                        ? "border-red-500 focus:ring-red-100"
                        : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                    }`}
                    {...register("address")}
                  />

                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div className="hardware-surface p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900">
                  บริการเสริมและการคุ้มครอง
                </h2>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-[#f97316]"
                >
                  <ArrowLeft size={14} />
                  แก้ไขที่อยู่จัดส่ง
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <label className="hardware-shadow flex items-start gap-3 rounded-box border-2 border-[#f97316] p-4">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="radio radio-accent radio-sm mt-0.5"
                  />
                  <span className="flex-1">
                    <span className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900">
                        SpecHub Escrow
                      </span>
                      <span className="hardware-label rounded-field bg-green-50 px-2 py-0.5 normal-case text-green-700">
                        รวมอยู่แล้ว
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-neutral-500">
                      เงินของคุณถูกพักไว้อย่างปลอดภัยจนกว่าจะได้รับและตรวจสอบสินค้าเรียบร้อย
                      รวมค่าตรวจสอบมาตรฐานแล้ว
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-box border border-neutral-200 p-4">
                  <input
                    type="checkbox"
                    checked={includeAssembly}
                    onChange={() => setIncludeAssembly((prev) => !prev)}
                    className="checkbox checkbox-sm mt-0.5"
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
                    <span className="mt-1 block text-sm text-neutral-500">
                      ประกอบโดยช่างมืออาชีพ + จัดสายไฟให้เรียบร้อย
                    </span>
                  </span>
                </label>
              </div>
            </div>
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
    </div>
  );
}
