import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { verifyRegistrationEmail } from "@/api/auth/auth.api";
import { getApiError } from "@/utils/auth/api.error";
import { verifyEmailSchema } from "@/validations/auth.schema";

import { AttemptsExceededDialog } from "./AttemptsExceededDialog";
import { OtpInput } from "./Otp.Input";
import { OtpCountdown } from "./OtpCountdown";
import { ResendCodeButton } from "./ResendCodeButton";

export function VerifyEmailForm({
  email,
  expiresAt,
  resendAvailableAt,
  onVerified,
  onAttemptsExceeded,
}) {
  const [serverError, setServerError] = useState("");
  const [attemptLimitError, setAttemptLimitError] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [verificationBlocked, setVerificationBlocked] = useState(false);

  const [currentExpiresAt, setCurrentExpiresAt] = useState(expiresAt);

  const [currentResendAt, setCurrentResendAt] = useState(resendAvailableAt);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values) {
    try {
      setServerError("");
      setAttemptsRemaining(null);

      const data = await verifyRegistrationEmail({
        email,
        code: values.code,
      });

      toast.success(data.message, {
        position: "top-center",
      });

      onVerified();
    } catch (error) {
      const apiError = error.apiError ?? getApiError(error);

      handleVerificationError(apiError);
    }
  }

  function handleVerificationError(apiError) {
    if (apiError.code === "INVALID_VERIFICATION_CODE") {
      if (apiError.attemptsRemaining === 0) {
        setVerificationBlocked(true);
        setAttemptLimitError(apiError.message);
        return;
      }

      setError("code", {
        type: "server",
        message: apiError.message,
      });

      setAttemptsRemaining(apiError.attemptsRemaining);
      return;
    }

    if (apiError.code === "TOO_MANY_VERIFICATION_ATTEMPTS") {
      setVerificationBlocked(true);
      setAttemptLimitError(apiError.message);
      return;
    }

    if (apiError.code === "VERIFICATION_CODE_EXPIRED") {
      handleExpired();
      return;
    }

    setServerError(apiError.message);
  }

  function handleResent(data) {
    setServerError("");
    setAttemptsRemaining(null);
    setVerificationBlocked(false);

    setCurrentExpiresAt(data.expiresAt);
    setCurrentResendAt(data.resendAvailableAt);

    clearErrors("code");
    resetField("code");
  }

  const handleExpired = useCallback(() => {
    setVerificationBlocked(true);

    setServerError(
      "Your verification code has expired. Please request a new code.",
    );
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center"
        noValidate
      >
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <OtpInput
              value={field.value}
              onChange={(code) => {
                field.onChange(code);
                setServerError("");
              }}
              disabled={verificationBlocked || isSubmitting}
              hasError={Boolean(errors.code)}
            />
          )}
        />

        <div className="min-h-6 mb-2 text-left w-full pl-1">
          {errors.code && (
            <p className="text-xs text-error font-medium">
              ⚠️ {errors.code.message}
            </p>
          )}

          {!errors.code && serverError && (
            <p className="text-xs text-error font-medium">⚠️ {serverError}</p>
          )}
        </div>

        {attemptsRemaining !== null && (
          <p className="w-full text-left mb-3 pl-1 text-xs text-secondary">
            {attemptsRemaining} attempts remaining
          </p>
        )}

        <OtpCountdown expiresAt={currentExpiresAt} onExpired={handleExpired} />

        <div className="w-full space-y-4">
          <button
            type="submit"
            disabled={isSubmitting || verificationBlocked}
            className="btn btn-accent w-full text-accent-content font-bold h-12 text-base"
          >
            {isSubmitting
              ? "กำลังตรวจสอบ..."
              : verificationBlocked
                ? "รหัสหมดอายุ"
                : "ยืนยันตัวตน"}
          </button>

          <ResendCodeButton
            email={email}
            resendAvailableAt={currentResendAt}
            onResent={handleResent}
          />
        </div>
      </form>

      <AttemptsExceededDialog
        message={attemptLimitError}
        onConfirm={onAttemptsExceeded}
      />
    </>
  );
}
