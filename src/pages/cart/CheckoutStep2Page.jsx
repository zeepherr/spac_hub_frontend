// CheckoutStep2Page.jsx
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useCreateCheckout } from "@/hook/checkout/useCreateCheckout";
import { useCreatePaymentCheckout } from "@/hook/payment/useCreatePaymentCheckout";
import CheckoutStep3 from "@/components/cart/CheckoutStep3";
import CheckoutStepIndicator from "@/components/cart/CheckoutStepLine";

const GLASS_PANEL =
  "bg-white/50 backdrop-blur-xl border border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-[#f97316] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

function CheckoutStep2Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const createCheckoutMutation = useCreateCheckout();
  const createPaymentMutation = useCreatePaymentCheckout();
  const [hasFailed, setHasFailed] = useState(false);
  const hasStartedRef = useRef(false);

  const items = location.state?.items ?? [];
  const includeAssembly = location.state?.includeAssembly ?? false;
  const shippingAddress = location.state?.shippingAddress ?? null;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    if (!shippingAddress) {
      navigate("/checkoutstep1", { state: { items, includeAssembly } });
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const run = async () => {
      try {
        const listingIds = items.map((item) => item.listingId);
        const checkout = await createCheckoutMutation.mutateAsync({
          listingIds,
          shippingAddress,
        });
        const checkoutId = checkout.data.id;

        await createPaymentMutation.mutateAsync(checkoutId);
      } catch (error) {
        console.error("checkout failed:", error);
        setHasFailed(true);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0 || !shippingAddress) return null;

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-6xl flex-col justify-center px-4 py-8">
      <CheckoutStepIndicator currentStep={2} />

      <div className="mx-auto w-full max-w-xl">
        {hasFailed ? (
          <div
            className={`flex flex-col items-center gap-3 rounded-2xl p-10 text-center ${GLASS_PANEL}`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </span>
            <h2 className="text-lg font-bold text-neutral-900">
              Checkout Failed
            </h2>
            <p className="max-w-sm text-sm text-neutral-500">
              An error occurred while creating your order. Please try again.
            </p>
            <button
              type="button"
              onClick={() =>
                navigate("/checkoutstep1", {
                  state: { items, includeAssembly },
                })
              }
              className={`mt-2 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${CTA_GLASS}`}
            >
              <ArrowLeft size={16} />
              Back to Edit Shipping Address
            </button>
          </div>
        ) : (
          <CheckoutStep3 />
        )}
      </div>
    </div>
  );
}

export default CheckoutStep2Page;
