// แยกแถบ step (StepIndicator) ออกมาเป็น component กลางไฟล์เดียวตามที่ขอ แทนที่จะก็อปซ้ำ 3 ที่เหมือนเดิม
// (CheckoutPage.jsx, CheckoutStep4.jsx, PaymentSuccessPage.jsx) - ที่ผ่านมาพอต้องแก้ดีไซน์ (ความกว้าง/สี/
// ระยะห่าง) ต้องคอยไล่แก้ทีละไฟล์ให้ตรงกันหมด พลาดจนหลอดไม่เท่ากัน/ไม่ครบทุกที่หลายรอบ พอรวมเป็นไฟล์เดียว
// แก้ที่นี่ที่เดียวจบ ทุกหน้าที่ import ไปใช้จะได้หน้าตาตรงกันเสมออัตโนมัติ
//
// currentStep รับมาเป็น prop แทนการ hardcode ในแต่ละไฟล์:
// - CheckoutPage.jsx (ฟอร์มที่อยู่จัดส่ง) ใช้ currentStep=1
// - CheckoutStep3.jsx / การ์ด "กำลังยืนยัน" ใน PaymentSuccessPage.jsx (ระหว่างรอ/ก่อนเด้งไป Stripe) ใช้ currentStep=2 หรือ 3 แล้วแต่จุดที่เรียก
// - CheckoutStep4.jsx (การ์ด "สั่งซื้อสำเร็จแล้ว") ใช้ currentStep=3
const STEPS = [
  { id: 1, label: "จัดส่ง" },
  { id: 2, label: "ชำระเงิน" },
  { id: 3, label: "ยืนยัน" },
];

function CheckoutStepIndicator({ currentStep }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((step, i) => {
        const isDone = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        // เส้นขีดหลังวงกลมนี้เขียวตามไปด้วยถ้าสเต็ปนี้ผ่านไปแล้ว (ไม่ใช่แค่วงกลมเขียวเฉยๆ)
        const isLineDone = isDone;

        return (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  isCurrent
                    ? "bg-neutral-900 text-white"
                    : isDone
                      ? "bg-green-500 text-white"
                      : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {step.id}
              </span>
              <span
                className={`hardware-label normal-case ${
                  isCurrent ? "text-neutral-900" : "text-secondary"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 ${
                  isLineDone ? "bg-green-500" : "bg-neutral-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CheckoutStepIndicator;
