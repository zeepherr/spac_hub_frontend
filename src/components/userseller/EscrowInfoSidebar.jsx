import React from 'react';
import { ShieldCheck, PackageCheck, Zap } from 'lucide-react';

export default function EscrowInfoSidebar() {
  return (
    <div className="matte p-6 rounded-2xl border border-[#404040] text-white space-y-6">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-8 h-8 text-[#f97316] shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-black tracking-tight">ระบบทำงานอย่างไร?</h3>
        </div>
      </div>

      <div className="space-y-5 text-sm">
        {/* Step 1 */}
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            1
          </span>
          <div>
            <h4 className="font-bold text-white mb-0.5">ลงขายและรอผู้ซื้อ</h4>
            <p className="text-[#a3a3a3] text-xs leading-relaxed">
              เมื่อมีผู้สั่งซื้อ เงินจะถูกพักไว้ในระบบ Escrow ของเราอย่างปลอดภัย
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-[#3f7d5a] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            2
          </span>
          <div>
            <h4 className="font-bold text-white mb-0.5">ส่งสินค้ามาที่ศูนย์ตรวจสอบ</h4>
            <p className="text-[#a3a3a3] text-xs leading-relaxed">
              คุณต้องส่งสินค้ามาให้ทีมงานผู้เชี่ยวชาญของเราตรวจสอบสภาพตามที่คุณระบุไว้
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            3
          </span>
          <div>
            <h4 className="font-bold text-white mb-0.5">รับเงินรวดเร็ว</h4>
            <p className="text-[#a3a3a3] text-xs leading-relaxed">
              เมื่อตรวจสอบผ่าน สินค้าจะถูกส่งต่อให้ผู้ซื้อ และเงินจะถูกโอนเข้าบัญชีคุณทันที
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}