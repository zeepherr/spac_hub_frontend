import React from 'react';

export default function SellerStepProgress({ currentStep = 1 }) {
  const steps = [
    { id: 1, label: 'ข้อมูลเบื้องต้น' },
    { id: 2, label: 'สเปคสินค้า' },
    { id: 3, label: 'รูปภาพ' },
  ];

  return (
    <div className="hardware-surface p-4 mb-6 rounded-xl bg-white border border-[#d4d4d4]">
      <div className="grid grid-cols-3 gap-2 text-center relative">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isDone = step.id < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mb-1 transition-all ${
                  isActive
                    ? 'bg-[#f97316] text-white shadow-lg scale-105'
                    : isDone
                    ? 'bg-[#171717] text-white'
                    : 'bg-[#ebebeb] text-[#737373]'
                }`}
              >
                {step.id}
              </div>
              <span
                className={`text-xs font-semibold ${
                  isActive ? 'text-[#171717]' : 'text-[#737373]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}