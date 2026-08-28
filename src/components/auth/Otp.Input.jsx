import { useEffect, useRef, useState } from "react";

const OTP_LENGTH = 6;

export function OtpInput({
  value = "",
  onChange,
  disabled = false,
  hasError = false,
}) {
  const [digits, setDigits] = useState(
    Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? ""),
  );

  const [revealed, setRevealed] = useState(Array(OTP_LENGTH).fill(false));

  const inputRefs = useRef([]);
  const timerRefs = useRef([]);

  // Sync when form resets
  useEffect(() => {
    setDigits(
      Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? ""),
    );

    if (!value) {
      inputRefs.current[0]?.focus();
    }
  }, [value]);

  // Auto focus first input + cleanup timers
  useEffect(() => {
    inputRefs.current[0]?.focus();

    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, []);

  function revealDigit(index) {
    setRevealed((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    clearTimeout(timerRefs.current[index]);

    timerRefs.current[index] = setTimeout(() => {
      setRevealed((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }, 1000);
  }

  function handleChange(index, digit) {
    if (!/^\d?$/.test(digit)) return;

    const next = [...digits];

    next[index] = digit;

    setDigits(next);
    onChange(next.join(""));

    if (!digit) return;

    revealDigit(index);

    inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, event) {
    if (event.key !== "Backspace") return;

    if (digits[index]) {
      handleChange(index, "");
      return;
    }

    inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(event) {
    event.preventDefault();

    const code = event.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(code)) return;

    setDigits(code.split(""));
    onChange(code);

    setRevealed(Array(OTP_LENGTH).fill(true));

    setTimeout(() => {
      setRevealed(Array(OTP_LENGTH).fill(false));
    }, 1000);

    inputRefs.current[OTP_LENGTH - 1]?.focus();
  }

  return (
    <div className="flex justify-center gap-2 md:gap-3 mb-2 w-full">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          autoFocus={index === 0}
          type={revealed[index] ? "text" : "password"}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`OTP digit ${index + 1}`}
          onChange={(event) =>
            handleChange(index, event.target.value.slice(-1))
          }
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className={`input input-bordered w-11 h-13 md:w-12 md:h-14 p-0 text-center text-xl font-bold font-mono transition-all ${
            hasError ? "border-error focus:border-error" : "focus:border-accent"
          }`}
        />
      ))}
    </div>
  );
}
