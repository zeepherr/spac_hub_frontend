import { Navigate, useNavigate } from "react-router";

import { VerifyEmailForm } from "@/components/auth/VerifyEmailFrom";
import {
  clearPendingRegistration,
  getPendingRegistration,
} from "@/utils/auth/pending-registration";

export default function VerifyPage() {
  const navigate = useNavigate();
  const pending = getPendingRegistration();

  if (!pending) {
    return <Navigate to="/register" replace />;
  }

  function handleVerified() {
    clearPendingRegistration();

    navigate("/login", {
      replace: true,
      state: { verified: true },
    });
  }

  function handleAttemptsExceeded() {
    clearPendingRegistration();

    navigate("/register", {
      replace: true,
      state: { verificationFailed: true },
    });
  }

  return (
    <div className="min-h-full flex items-center justify-center text-base-content">
      <div className="hardware-surface w-full max-w-md bg-white p-8 md:p-10 text-center flex flex-col items-center">
        {/* Icon */}
        <div className="w-20 h-20 mb-6 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-center relative">
          <div className="hardware-indicator absolute top-2 right-2" />

          <svg
            className="w-10 h-10 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="10" y="2" width="11" height="18" rx="2" />
            <line x1="14" y1="16" x2="17" y2="16" />
            <path d="M2 9.5L8.5 14L15 9.5" />
            <rect x="2" y="8" width="13" height="11" rx="1.5" />

            <circle
              cx="15.5"
              cy="7.5"
              r="4.5"
              fill="currentColor"
              stroke="currentColor"
              className="text-white"
            />

            <path
              d="M13.5 7.5l1.5 1.5 2.5-2.5"
              stroke="var(--hardware-orange, #f97316)"
              strokeWidth="2"
            />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl text-[#171717] font-black tracking-tight mb-2">
          Verification Code
        </h1>

        <p className="text-xs md:text-sm text-[#171717] max-w-xs mb-6 leading-relaxed">
          กรุณากรอกรหัสยืนยัน 6 หลักที่เราได้ส่งไปยังอีเมล:{" "}
          <span className="font-bold text-[#f97316]">{pending.email}</span>
        </p>

        <VerifyEmailForm
          email={pending.email}
          expiresAt={pending.expiresAt}
          resendAvailableAt={pending.resendAvailableAt}
          onVerified={handleVerified}
          onAttemptsExceeded={handleAttemptsExceeded}
        />
      </div>
    </div>
  );
}
