// CheckoutStep1Page.jsx
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { z } from "zod";
import useAuthStore from "@/stores/auth.store";
import { useUpdateUserProfile } from "@/hook/user/useUpdateUserProfile";
import { useCheckoutQuote } from "@/hook/checkout/useCheckoutQuote";
import { useCreateCheckout } from "@/hook/checkout/useCreateCheckout";
import { useCreatePaymentCheckout } from "@/hook/payment/useCreatePaymentCheckout";
import CheckoutStep1 from "@/components/cart/CheckoutStep1";
import CheckoutStep3 from "@/components/cart/CheckoutStep3";
import CheckoutStepIndicator from "@/components/cart/CheckoutStepLine";

const ASSEMBLY_SERVICE_FEE = 400;

const GLASS_PANEL =
  "bg-white/50 backdrop-blur-xl border border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
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
  const grandTotal = hasItems ? (quote?.grandTotal ?? 0) : 0;

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
        disabled={submitting}
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

export default function CheckoutStep1Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((store) => store.user);
  const updateUserProfile = useUpdateUserProfile();
  const createCheckoutMutation = useCreateCheckout();
  const createPaymentMutation = useCreatePaymentCheckout();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

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
  const quoteQuery = useCheckoutQuote(listingIds, includeAssembly);
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

  const submitShippingAndPay = handleSubmit((values) => {
    updateUserProfile.mutate(values, {
      onSuccess: async () => {
        const shippingAddress = {
          recipientName: `${values.firstName} ${values.lastName}`.trim(),
          phone: values.phone,
          address: values.address,
        };

        setPaymentError("");
        setIsProcessingPayment(true);
        try {
          const listingIds = items.map((item) => item.listingId);
          const checkout = await createCheckoutMutation.mutateAsync({
            listingIds,
            shippingAddress,
            setupServiceRequested: includeAssembly,
          });
          const checkoutId = checkout?.data?.id;

          if (!checkoutId) {
            console.error(
              "[checkout] checkoutId is falsy — response shape ไม่ตรงกับที่คาดไว้:",
              checkout,
            );
            throw new Error(
              "checkoutId not found in the /api/checkouts response (check console.log for where the id actually is)",
            );
          }

          await createPaymentMutation.mutateAsync(checkoutId);
        } catch (error) {
          console.error("[checkout] failed:", error);
          setPaymentError(
            error?.response?.data?.message || error?.message || "Unknown error",
          );
          setIsProcessingPayment(false);
        }
      },
    });
  });

  const retryPayment = () => {
    setPaymentError("");
    setIsProcessingPayment(false);
  };

  if (items.length === 0) return null;

  if (isProcessingPayment && !paymentError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <CheckoutStepIndicator currentStep={1} />
        <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center">
          <CheckoutStep3 />
        </div>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <CheckoutStepIndicator currentStep={1} />
        <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center">
          <div
            className={`flex flex-col items-center gap-3 rounded-2xl p-10 text-center ${GLASS_PANEL}`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </span>
            <h2 className="text-lg font-bold text-neutral-900">
              Checkout Failed
            </h2>
            <p className="max-w-sm rounded-lg bg-red-50 px-3 py-2 font-mono text-xs text-red-600">
              {paymentError}
            </p>
            <button
              type="button"
              onClick={retryPayment}
              className={`mt-2 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${CTA_GLASS}`}
            >
              <ArrowLeft size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <CheckoutStepIndicator currentStep={1} />

      <button
        type="button"
        onClick={() => navigate("/cart")}
        disabled={updateUserProfile.isPending}
        className="mb-4 flex items-center gap-1.5 rounded-lg border border-neutral-200/70 bg-white/60 px-3 py-1.5 text-sm font-semibold text-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md transition hover:border-[#f97316] hover:text-[#f97316] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft size={16} />
        Back
      </button>

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
            submitting={updateUserProfile.isPending || isProcessingPayment}
          />
        </div>
      </div>
    </div>
  );
}
