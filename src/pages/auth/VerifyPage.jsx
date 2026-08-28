import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema } from "../../validations/auth.schema";

function VerifyPage() {
  // สถานะเปิดเผยตัวเลขชั่วคราว (1 วินาทีแล้วกลายเป็น password)
  const [revealed, setRevealed] = useState([false, false, false, false, false, false]);
  
  // 1. Cooldown สำหรับ Resend Button (60 วินาที)
  const [resendCooldown, setResendCooldown] = useState(60);

  // 2. Cooldown สำหรับรหัสหมดอายุ (5 นาที = 300 วินาที)
  const [expireCooldown, setExpireCooldown] = useState(300);

  // อีเมลจำลอง (Mock Email)
  const mockEmail = 'user***@gmail.com';

  const inputRefs = useRef([]);
  const timerRefs = useRef([]);

  // ตั้งค่า React Hook Form ร่วมกับ Zod Schema
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: '',
    },
  });

  // Logic นับถอยหลังสำหรับ Resend (60 วินาที)
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Logic นับถอยหลังสำหรับรหัสหมดอายุ (5 นาที)
  useEffect(() => {
    let timer;
    if (expireCooldown > 0) {
      timer = setInterval(() => {
        setExpireCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [expireCooldown]);

  // ฟังก์ชันแปลงวินาทีเป็นรูปแบบ MM:SS (สำหรับเวลาหมดอายุรหัส)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // จัดการเมื่อกดปุ่ม "ยืนยันตัวตน" (ผ่าน Validation แล้ว)
  const onSubmit = (data) => {
    console.log("Verified Code Success:", data.code);
    // TODO: เรียก API ส่ง data.code ไปยัง Backend
  };

  // จัดการการส่งรหัสอีกครั้ง (Resend)
  const handleResendCode = () => {
    if (resendCooldown === 0) {
      reset({ code: '' });
      setRevealed([false, false, false, false, false, false]);
      
      // รีเซ็ตเวลาทั้งสองชุดเมื่อกดส่งรหัสใหม่
      setResendCooldown(60);
      setExpireCooldown(300);
      
      inputRefs.current[0]?.focus();
      // TODO: เรียก API ส่ง OTP ใหม่
    }
  };

  // จัดการการพิมพ์ OTP แต่ละช่อง
  const handleInputChange = (index, char) => {
    if (isNaN(char)) return;

    const currentCode = getValues('code') || '';
    const codeArr = currentCode.padEnd(6, ' ').split('');
    codeArr[index] = char;
    
    const newCode = codeArr.join('').trimEnd();
    setValue('code', newCode, { shouldValidate: true });

    if (char) {
      const newRevealed = [...revealed];
      newRevealed[index] = true;
      setRevealed(newRevealed);

      if (timerRefs.current[index]) {
        clearTimeout(timerRefs.current[index]);
      }

      timerRefs.current[index] = setTimeout(() => {
        setRevealed((prev) => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
      }, 1000);

      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // จัดการการกด Backspace
  const handleKeyDown = (index, e) => {
    const currentCode = getValues('code') || '';
    
    if (e.key === 'Backspace') {
      if (!currentCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const codeArr = currentCode.split('');
        codeArr[index] = '';
        setValue('code', codeArr.join(''), { shouldValidate: true });

        if (timerRefs.current[index]) {
          clearTimeout(timerRefs.current[index]);
        }
        const newRevealed = [...revealed];
        newRevealed[index] = false;
        setRevealed(newRevealed);
      }
    }
  };

  // จัดการ Paste รหัส OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      setValue('code', pasteData, { shouldValidate: true });
      setRevealed([true, true, true, true, true, true]);
      
      setTimeout(() => {
        setRevealed([false, false, false, false, false, false]);
      }, 1000);

      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-100 text-base-content font-sans">
      <div className="hardware-surface w-full max-w-md bg-white p-8 md:p-10 text-center flex flex-col items-center">
        
        {/* Hardware Icon */}
        <div className="w-20 h-20 mb-6 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-center relative">
          <div className="hardware-indicator absolute top-2 right-2"></div>
          <svg
            className="w-10 h-10 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="10" y="2" width="11" height="18" rx="2" ry="2" />
            <line x1="14" y1="16" x2="17" y2="16" />
            <path d="M2 9.5L8.5 14L15 9.5" />
            <rect x="2" y="8" width="13" height="11" rx="1.5" />
            <circle cx="15.5" cy="7.5" r="4.5" fill="currentColor" stroke="currentColor" className="text-white" />
            <path d="M13.5 7.5l1.5 1.5 2.5-2.5" stroke="var(--hardware-orange, #f97316)" strokeWidth="2" />
          </svg>
        </div>

        {/* Header Title & Subtitle พร้อมอีเมลจำลอง */}
        <h2 className="text-2xl md:text-3xl font-black text-base-content tracking-tight mb-2">
          Verification Code
        </h2>
        <p className="text-xs md:text-sm text-secondary max-w-xs mb-6 leading-relaxed">
          กรุณากรอกรหัสยืนยัน 6 หลักที่เราได้ส่งไปยังอีเมล: 
          <span className="font-bold text-base-content">{mockEmail}</span> เพื่อดำเนินการต่อ
        </p>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
          
          {/* Controller สำหรับ OTP 6 ช่อง */}
          <Controller
            name="code"
            control={control}
            render={({ field: { value } }) => (
              <div className="flex justify-center gap-2 md:gap-3 mb-2 w-full">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const char = (value || '')[index] || '';
                  return (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type={revealed[index] ? 'text' : 'password'}
                      inputMode="numeric"
                      maxLength={1}
                      value={char}
                      onChange={(e) => handleInputChange(index, e.target.value.slice(-1))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`input input-bordered w-11 h-13 md:w-12 md:h-14 p-0 text-center text-xl font-bold font-mono transition-all ${
                        errors.code ? 'border-error focus:border-error' : 'focus:border-[#f97316]'
                      }`}
                    />
                  );
                })}
              </div>
            )}
          />

          {/* Validation Error Message */}
          <div className="min-h-[24px] mb-2 text-left w-full pl-1">
            {errors.code && (
              <span className="text-xs text-error font-medium flex items-center gap-1">
                ⚠️ {errors.code.message}
              </span>
            )}
          </div>

          {/* Expire Cooldown Display (5 นาที) */}
          <div className="w-full text-left mb-6 pl-1">
            <p className="text-xs text-secondary font-medium flex items-center gap-1.5">
              <span>รหัสจะหมดอายุใน:</span>
              <span className="font-mono font-bold text-accent bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                {formatTime(expireCooldown)}
              </span>
            </p>
          </div>

          {/* Submit Action Button */}
          <div className="w-full space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-accent w-full text-accent-content font-bold h-12 text-base"
            >
              {isSubmitting ? 'กำลังตรวจสอบ...' : 'ยืนยันตัวตน'}
            </button>

            {/* Resend Link พร้อมเวลาถอยหลัง 60 วินาที */}
            <div className="text-xs text-secondary pt-1">
              <span>หากไม่ได้รับรหัส? </span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
                className={`font-bold transition-all px-2 py-1 rounded-md ${
                  resendCooldown > 0
                    ? 'text-base-300 cursor-not-allowed opacity-60'
                    : 'text-accent hover:bg-orange-50 hover:underline cursor-pointer'
                }`}
              >
                ส่งรหัสอีกครั้ง (Resend) {resendCooldown > 0 && `(${resendCooldown}s)`}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default VerifyPage;