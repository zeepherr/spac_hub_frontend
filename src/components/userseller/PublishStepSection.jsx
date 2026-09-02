import React from "react";
import { Rocket, FileText } from "lucide-react";

export default function PublishStepSection({
  stepRef,
  currentStep,
  onOpenSummaryModal,
  loading,
}) {
  return (
    <section
      ref={stepRef}
      className={`bg-base-100 p-6 rounded-box border border-base-300 shadow-sm space-y-6 transition-all duration-300 ${
        currentStep < 5 ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center gap-3 border-b border-base-300 pb-4">
        <span className="w-8 h-8 rounded-full bg-success text-success-content flex items-center justify-center font-bold text-sm">
          5
        </span>
        <h2 className="text-xl font-bold text-base-content">
          ตรวจสอบและลงขายสินค้า
        </h2>
      </div>

      {currentStep === 5 && (
        <div className="space-y-3">
          <button
            onClick={onOpenSummaryModal}
            disabled={loading}
            className="btn btn-success text-white w-full rounded-field font-black text-lg gap-2 shadow-md hover:shadow-lg transition-all"
          >
            {loading ? (
              <span className="loading loading-spinner" />
            ) : (
              <>
                <FileText className="w-6 h-6" /> สรุปข้อมูล & ยืนยันการลงขาย
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}