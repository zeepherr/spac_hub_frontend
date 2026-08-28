import React, { useState, useRef, useEffect } from 'react';

function VerifyPage() {
  // เก็บค่ารหัสผ่านจริง 6 หลัก
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // สถานะซ่อน/เปิดเผยตัวเลข (เปิดเผย 1 วินาทีแล้วกลายเป็น password)
  const [revealed, setRevealed] = useState([false, false, false, false, false, false]);
  
  // Cooldown timer (5 นาที = 300 วินาที)
  const [cooldown, setCooldown] = useState(300);

  const inputRefs = useRef([]);
  const timerRefs = useRef([]);

  // Logic นับถอยหลัง Cooldown 5 นาที
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // ฟังก์ชันแปลงวินาทีเป็นรูปแบบ MM:SS (เช่น 05:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // จัดการการส่งรหัสอีกครั้ง
  const handleResendCode = () => {
    if (cooldown === 0) {
      // รีเซ็ต OTP และตั้งเวลา Cooldown ใหม่เป็น 5 นาที (300 วินาที)
      setOtp(['', '', '', '', '', '']);
      setRevealed([false, false, false, false, false, false]);
      setCooldown(300);
      inputRefs.current[0]?.focus();
      // TODO: เรียก API สำหรับส่ง OTP อีกครั้งที่นี่
    }
  };

  // จัดการการพิมพ์ OTP
  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const lastChar = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);

    if (lastChar) {
      // เปิดเผยตัวเลขเฉพาะช่องที่เพิ่งพิมพ์
      const newRevealed = [...revealed];
      newRevealed[index] = true;
      setRevealed(newRevealed);

      // เคลียร์ Timer เก่า (ถ้ามี)
      if (timerRefs.current[index]) {
        clearTimeout(timerRefs.current[index]);
      }

      // ตั้งเวลา 1 วินาทีแล้วเปลี่ยนเป็นรหัสผ่าน
      timerRefs.current[index] = setTimeout(() => {
        setRevealed((prev) => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
      }, 1000);

      // เลื่อนโฟกัสไปช่องถัดไป
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // จัดการการกด Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        if (timerRefs.current[index]) {
          clearTimeout(timerRefs.current[index]);
        }
        const newRevealed = [...revealed];
        newRevealed[index] = false;
        setRevealed(newRevealed);
      }
    }
  };

  // จัดการ Paste รหัส OTP 6 หลัก
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);

      setRevealed([true, true, true, true, true, true]);
      setTimeout(() => {
        setRevealed([false, false, false, false, false, false]);
      }, 1000);

      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f5f5] text-[#171717] font-sans">
      {/* Central Hardware Surface Card */}
      <div className="hardware-surface w-full max-w-md bg-white p-8 md:p-10 rounded-2xl border border-[#d4d4d4] shadow-xl text-center flex flex-col items-center">
        
        {/* Hardware Top Icon */}
        <div className="w-20 h-20 mb-6 rounded-2xl bg-[#ebebeb] border border-[#d4d4d4] flex items-center justify-center relative shadow-inner">
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f97316] shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
          
          <svg
            className="w-10 h-10 text-[#525252]"
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
            <circle cx="15.5" cy="7.5" r="4.5" fill="#ffffff" stroke="currentColor" />
            <path d="M13.5 7.5l1.5 1.5 2.5-2.5" stroke="#f97316" strokeWidth="2" />
          </svg>
        </div>

        {/* Header Title & Subtitle */}
        <h2 className="text-2xl md:text-3xl font-black text-[#171717] tracking-tight mb-2">
          Verification Code
        </h2>
        <p className="text-xs md:text-sm text-[#737373] max-w-xs mb-6 leading-relaxed">
          กรุณากรอกรหัสยืนยัน 6 หลักที่เราได้ส่งไปยังอีเมลหรือหมายเลขโทรศัพท์ของคุณเพื่อดำเนินการต่อ
        </p>

        {/* 6-Digit OTP Inputs */}
        <div className="flex justify-center gap-2 md:gap-3 mb-3 w-full">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type={revealed[index] ? 'text' : 'password'}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-11 h-13 md:w-12 md:h-14 text-center text-xl font-bold bg-[#ffffff] border border-[#d4d4d4] rounded-lg text-[#171717] shadow-inner focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all"
            />
          ))}
        </div>

        {/* Cooldown Display (ใต้ช่องกรอก OTP) */}
        <div className="w-full text-left mb-6 pl-1">
          <p className="text-xs text-[#737373] font-medium flex items-center gap-1.5">
            <span>รหัสจะหมดอายุใน:</span>
            <span className="font-mono font-bold text-[#f97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              {formatTime(cooldown)}
            </span>
          </p>
        </div>

        {/* Main Action Button */}
        <div className="w-full space-y-4">
          <button
            type="button"
            className="btn btn-accent w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold border-none rounded-lg h-12 text-base shadow-md active:scale-[0.98] transition-all"
          >
            ยืนยันตัวตน
          </button>

          {/* Resend Action Area (ส่งรหัสอีกครั้ง ทำเป็นปุ่มครอบ) */}
          <div className="text-xs text-[#737373] pt-1">
            <span>หากไม่ได้รับรหัส? </span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={cooldown > 0}
              className={`font-bold transition-all px-2 py-1 rounded-md ${
                cooldown > 0
                  ? 'text-[#a3a3a3] cursor-not-allowed opacity-60'
                  : 'text-[#f97316] hover:bg-orange-50 hover:underline cursor-pointer'
              }`}
            >
              ส่งรหัสอีกครั้ง (Resend)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default VerifyPage;