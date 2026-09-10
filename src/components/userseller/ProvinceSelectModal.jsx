import React, { useState } from "react";
import { X, Search, MapPin, Check } from "lucide-react";

// เดียวกับ GLASS_MODAL/GLASS_INPUT ที่ใช้ทั้งเว็บ
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";
const GLASS_INPUT =
  "w-full rounded-xl border border-neutral-300 bg-white/70 backdrop-blur-sm text-sm font-semibold text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

// รายชื่อ 77 จังหวัดในประเทศไทย
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

export default function ProvinceSelectModal({
  isOpen,
  onClose,
  selectedProvince,
  onSelectProvince,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredProvinces = THAI_PROVINCES.filter((prov) =>
    prov.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const handleSelect = (province) => {
    onSelectProvince(province);
    setSearchQuery("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl overflow-hidden ${GLASS_MODAL}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200/70 flex items-center justify-between bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-lg text-neutral-900">
              Select Province
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-neutral-200/70">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search province name..."
              className={`${GLASS_INPUT} pl-9 py-2`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                ล้าง
              </button>
            )}
          </div>
        </div>

        {/* Province List */}
        <div className="p-2 overflow-y-auto flex-1 space-y-1 divide-y divide-neutral-200/70">
          {filteredProvinces.length > 0 ? (
            filteredProvinces.map((province) => {
              const isSelected = selectedProvince === province;
              return (
                <button
                  key={province}
                  type="button"
                  onClick={() => handleSelect(province)}
                  className={`w-full cursor-pointer text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-orange-500/10 text-orange-600 font-bold"
                      : "hover:bg-orange-50/70 text-neutral-900 font-medium"
                  }`}
                >
                  <span className="text-sm">{province}</span>
                  {isSelected && <Check className="w-4 h-4 text-orange-500" />}
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-neutral-400 text-sm font-medium">
              No matching provinces found "{searchQuery}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-200/70 bg-white/30 backdrop-blur-sm flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg px-3 py-1.5 font-bold text-xs text-neutral-600 hover:text-neutral-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
