import { useEffect, useState } from "react";

import { resendRegistrationOtp } from "@/api/auth/auth.api";
import { getApiError } from "@/utils/auth/api.error";
import {
  getPendingRegistration,
  savePendingRegistration,
} from "@/utils/auth/pending-registration";

function getRemainingSeconds(targetAt) {
  if (!targetAt) return 0;

  const remaining = new Date(targetAt).getTime() - Date.now();

  return Math.max(Math.ceil(remaining / 1000), 0);
}

function createResendAt(seconds) {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export function ResendCodeButton({ email, resendAvailableAt, onResent }) {
  const [resendAt, setResendAt] = useState(resendAvailableAt);

  const [seconds, setSeconds] = useState(() =>
    getRemainingSeconds(resendAvailableAt),
  );

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function update() {
      const remaining = getRemainingSeconds(resendAt);

      setSeconds(remaining);

      return remaining;
    }

    if (update() === 0) return;

    const timer = setInterval(() => {
      if (update() === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [resendAt]);

  async function handleResend() {
    try {
      setError("");
      setIsSending(true);

      const data = await resendRegistrationOtp({ email });

      setResendAt(data.resendAvailableAt);

      savePendingRegistration({
        email,
        expiresAt: data.expiresAt,
        resendAvailableAt: data.resendAvailableAt,
      });

      onResent?.(data);
    } catch (error) {
      const apiError = error.apiError ?? getApiError(error);

      if (apiError.code === "OTP_RESEND_COOLDOWN") {
        const nextResendAt = createResendAt(apiError.retryAfterSeconds ?? 0);

        setResendAt(nextResendAt);

        const pending = getPendingRegistration();

        savePendingRegistration({
          ...pending,
          email,
          resendAvailableAt: nextResendAt,
        });

        return;
      }

      setError(apiError.message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="text-xs text-[#171717] pt-1">
      <span>Didn't receive the code? </span>

      <button
        type="button"
        onClick={handleResend}
        disabled={seconds > 0 || isSending}
        className={`font-bold px-2 py-1 rounded-md transition-all ${
          seconds > 0 || isSending
            ? "text-[#525252] cursor-not-allowed opacity-60"
            : "text-[#f97316] hover:bg-orange-50 hover:underline cursor-pointer"
        }`}
      >
        {isSending
          ? "Sending..."
          : seconds > 0
            ? `Resend code (${seconds}s)`
            : "Resend code (Resend)"}
      </button>

      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
}
