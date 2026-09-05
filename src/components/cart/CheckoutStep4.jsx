import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import CheckoutStepIndicator from "@/components/cart/CheckoutStepLine";

function CheckoutStep4({ sessionId }) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <CheckoutStepIndicator currentStep={3} />

      <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col justify-center">
        <div className="hardware-surface flex flex-col items-center gap-4 p-10 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#f97316]/15 blur-xl" />
            <span className="matte relative flex h-20 w-20 items-center justify-center rounded-full">
              <CheckCircle2 className="h-10 w-10 text-[#f97316]" />
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="hardware-label text-[#f97316]">
              Transaction Successful
            </span>
            <h2 className="text-xl font-bold text-neutral-900">
              Order Placed Successfully
            </h2>
            <p className="max-w-sm text-sm text-neutral-500">
              Thank you for your order.
              We’ll keep you updated on the delivery status via email and on your order page.
            </p>
          </div>

          {sessionId && (
            <>
              <div className="hardware-divider w-full" />
              <div className="flex w-full items-center justify-between gap-3 text-sm">
                <span className="text-neutral-500">Payment Reference Number</span>
                <span className="truncate font-mono text-xs font-medium text-neutral-900">
                  {sessionId}
                </span>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-accent mt-2 w-full gap-2 text-white"
          >
            Back to Home
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutStep4;
