import { useEffect, useState } from "react";

function getRemainingSeconds(expiresAt) {
  if (!expiresAt) return 0;

  const remaining = new Date(expiresAt).getTime() - Date.now();

  return Math.max(Math.ceil(remaining / 1000), 0);
}

export function OtpCountdown({ expiresAt, onExpired }) {
  const [seconds, setSeconds] = useState(() => getRemainingSeconds(expiresAt));

  useEffect(() => {
    function update() {
      const remaining = getRemainingSeconds(expiresAt);

      setSeconds(remaining);

      if (remaining === 0) {
        onExpired?.();
      }

      return remaining;
    }

    if (update() === 0) return;

    const timer = setInterval(() => {
      if (update() === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="w-full text-left mb-6 pl-1">
      <p className="text-xs font-medium text-[#171717] flex items-center gap-1.5">
        <span>Code expires in:</span>

        <span className="font-mono font-bold text-[#f97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
          {String(minutes).padStart(2, "0")}:
          {String(remainingSeconds).padStart(2, "0")}
        </span>
      </p>
    </div>
  );
}
