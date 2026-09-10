// src/components/common/ProvinceSelect.jsx
import React from "react";
import { MapPin } from "lucide-react";

// เดียวกับ GLASS_INPUT ที่ใช้ทั้งเว็บ
const GLASS_INPUT =
  "w-full rounded-xl border border-neutral-300 bg-white/70 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

// รายชื่อจังหวัดหลัก
export const THAI_PROVINCES = [
  "กรุงเทพมหานคร",
  "กระบี่",
  "กาญจนบุรี",
  "กาฬสินธุ์",
  "กำแพงเพชร",
  "ขอนแก่น",
  "จันทบุรี",
  "ฉะเชิงเทรา",
  "ชลบุรี",
  "ชัยนาท",
  "ชัยภูมิ",
  "ชุมพร",
  "เชียงราย",
  "เชียงใหม่",
  "ตรัง",
  "ตราด",
  "ตาก",
  "นครนายก",
  "นครปฐม",
  "นครพนม",
  "นครราชสีมา",
  "นครศรีธรรมราช",
  "นครสวรรค์",
  "นนทบุรี",
  "นราธิวาส",
  "น่าน",
  "บึงกาฬ",
  "บุรีรัมย์",
  "ปทุมธานี",
  "ประจวบคีรีขันธ์",
  "ปราจีนบุรี",
  "ปัตตานี",
  "พระนครศรีอยุธยา",
  "พะเยา",
  "พังงา",
  "พัทลุง",
  "พิจิตร",
  "พิษณุโลก",
  "เพชรบุรี",
  "เพชรบูรณ์",
  "แพร่",
  "ภูเก็ต",
  "มหาสารคาม",
  "มุกดาหาร",
  "แม่ฮ่องสอน",
  "ยโสธร",
  "ยะลา",
  "ร้อยเอ็ด",
  "ระนอง",
  "ระยอง",
  "ราชบุรี",
  "ลพบุรี",
  "ลำปาง",
  "ลำพูน",
  "เลย",
  "ศรีสะเกษ",
  "สกลนคร",
  "สงขลา",
  "สตูล",
  "สมุทรปราการ",
  "สมุทรสงคราม",
  "สมุทรสาคร",
  "สระแก้ว",
  "สระบุรี",
  "สิงห์บุรี",
  "สุโขทัย",
  "สุพรรณบุรี",
  "สุราษฎร์ธานี",
  "สุรินทร์",
  "หนองคาย",
  "หนองบัวลำภู",
  "อ่างทอง",
  "อำนาจเจริญ",
  "อุดรธานี",
  "อุตรดิตถ์",
  "อุทัยธานี",
  "อุบลราชธานี",
];

export default function ProvinceSelect({
  value,
  onChange,
  label = "Shipping Location *",
  disabled = false,
  className = "",
}) {
  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label text-xs font-bold text-neutral-700 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={GLASS_INPUT}
      >
        <option value="" disabled>
          -- Select Province --
        </option>
        {THAI_PROVINCES.map((prov) => (
          <option key={prov} value={prov}>
            {prov}
          </option>
        ))}
      </select>
    </div>
  );
}
