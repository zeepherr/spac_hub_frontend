// CheckoutPage.jsx
import CheckoutStep1 from "@/components/cart/CheckoutStep1";
import CheckoutStep3 from "@/components/cart/CheckoutStep3";
import { useCheckoutQuote } from "@/hook/checkout/useCheckoutQuote";
import { useCreateCheckout } from "@/hook/checkout/useCreateCheckout";
import { useCreatePaymentCheckout } from "@/hook/payment/useCreatePaymentCheckout";
import { useUpdateUserProfile } from "@/hook/user/useUpdateUserProfile";
import useAuthStore from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { z } from "zod";

const ASSEMBLY_SERVICE_FEE = 400;

const GLASS_DARK =
  "bg-neutral-900/85 backdrop-blur-xl border border-neutral-800/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_20px_40px_rgba(0,0,0,0.25)]";
const CTA_GLASS =
  "bg-[#f97316] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

const shippingSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name"),
  lastName: z.string().trim().min(1, "Please enter your last name"),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number")
    .regex(/^0[0-9]{8,9}$/, "Invalid phone number"),
  address: z
    .string()
    .trim()
    .min(1, "Please enter your address")
    .max(500, "Address must not exceed 500 characters"),
});

const STEPS = [
  { id: 1, label: "Shipping" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Confirmation" },
];
const CURRENT_STEP = 1;

function StepIndicator() {
  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((step, i) => {
        const isDone = step.id < CURRENT_STEP;
        const isCurrent = step.id === CURRENT_STEP;
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
                className={`text-[11px] ${
                  isCurrent ? "text-neutral-900" : "text-neutral-400"
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
  const isPending = hasItems && (isQuoteLoading || !quote);
  const grandTotal = hasItems
    ? (quote?.grandTotal ?? 0) + (includeAssembly ? ASSEMBLY_SERVICE_FEE : 0)
    : 0;

  return (
    <div className={`sticky top-24 rounded-2xl p-6 text-white ${GLASS_DARK}`}>
      <h2 className="mb-4 text-lg font-bold">Order Summary</h2>

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
        <p className="mb-4 text-sm text-red-300">
          {quoteError?.response?.data?.message ||
            "Failed to calculate total. Please try again."}
        </p>
      ) : (
        <div className="flex flex-col gap-2 text-sm text-neutral-300">
          {isPending ? (
            <div className="flex items-center justify-between">
              <span>Calculating total...</span>
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
              <span>Assembly Service</span>
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
            <span>Included</span>
          </div>
        </div>
      )}

      <div className="my-4 h-px bg-white/10" />

      <div className="mb-5 flex items-end justify-between">
        <span className="text-base font-bold">Total</span>
        <span className="text-2xl font-bold">
          {isPending ? "..." : formatPrice(grandTotal)}
        </span>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={submitting || !hasItems || isPending || isQuoteError}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-50 ${CTA_GLASS}`}
      >
        Proceed to Checkout
        <ArrowRight size={18} />
      </button>

      <p className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-400">
        <Lock size={12} />
        End-to-end encrypted
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

  const items = location.state?.items ?? [];
  const includeAssembly = location.state?.includeAssembly ?? false;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      await createPaymentMutation.mutateAsync(checkoutId);
    } catch (error) {
      console.error("checkout failed:", error);
    }
  };

  const submitShippingAndPay = handleSubmit((values) => {
    updateUserProfile.mutate(values, {
      onSuccess: () => {
        confirmCheckout(values);
      },
    });
  });

  if (items.length === 0) return null;

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
        className="mb-4 flex items-center gap-1.5 rounded-lg border border-neutral-200/70 bg-white/60 px-3 py-1.5 text-sm font-semibold text-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md transition hover:border-[#f97316] hover:text-[#f97316] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft size={16} />
        Back
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
