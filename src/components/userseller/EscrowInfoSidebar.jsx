import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function EscrowInfoSidebar() {
  return (
    <div className="matte p-6 rounded-box space-y-6 shadow-md border border-[#404040] w-full text-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#404040] pb-4">
        <ShieldCheck className="w-8 h-8 text-[#f97316] shrink-0" />
        <div>
          <h3 className="text-xl font-black tracking-tight text-white">
            ระบบทำงานอย่างไร?
          </h3>
          <p className="text-xs text-gray-300">คุ้มครองความปลอดภัยผ่าน Escrow</p>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-5 text-sm">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            1
          </span>
          <div>
            <h4 className="font-bold text-white mb-0.5">ลงขายและรอผู้ซื้อ</h4>
            <p className="text-gray-300 text-xs leading-relaxed">
              เมื่อมีผู้สั่งซื้อ เงินจะถูกพักไว้ในระบบ Escrow ของเราอย่างปลอดภัย
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            2
          </span>
          <div>
            <h4 className="font-bold text-white mb-0.5">ส่งสินค้ามาที่ศูนย์ตรวจสอบ</h4>
            <p className="text-gray-300 text-xs leading-relaxed">
              คุณต้องส่งสินค้ามาให้ทีมงานผู้เชี่ยวชาญของเราตรวจสอบสภาพตามที่คุณระบุไว้
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            3
          </span>
          <div>
            <h4 className="font-bold text-white mb-0.5">รับเงินรวดเร็ว</h4>
            <p className="text-gray-300 text-xs leading-relaxed">
              เมื่อตรวจสอบผ่าน สินค้าจะถูกส่งต่อให้ผู้ซื้อ และเงินจะถูกโอนเข้าบัญชีคุณทันที
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}