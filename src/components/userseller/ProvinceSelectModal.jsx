import React, { useState } from "react";
import { X, Search, MapPin, Check } from "lucide-react";

// รายชื่อ 77 จังหวัดในประเทศไทย
export const THAI_PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", 
  "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", 
  "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", 
  "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", 
  "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", 
  "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", 
  "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", 
  "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", 
  "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", 
  "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", 
  "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", 
  "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", 
  "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", 
  "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", 
  "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", 
  "อุทัยธานี", "อุบลราชธานี"
];

export default function ProvinceSelectModal({
  isOpen,
  onClose,
  selectedProvince,
  onSelectProvince,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // กรองจังหวัดตามคำค้นหา
  const filteredProvinces = THAI_PROVINCES.filter((prov) =>
    prov.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleSelect = (province) => {
    onSelectProvince(province);
    setSearchQuery("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-base-100 border border-base-300 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-200/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-lg text-base-content">เลือกจังหวัด / สถานที่จัดส่ง</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:text-base-content"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-base-200 bg-base-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อจังหวัด..."
              className="input input-sm w-full pl-9 rounded-field bg-base-200/60 focus:bg-base-100 border-base-300 text-sm font-semibold"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/50 hover:text-base-content"
              >
                ล้าง
              </button>
            )}
          </div>
        </div>

        {/* Province List */}
        <div className="p-2 overflow-y-auto flex-1 space-y-1 divide-y divide-base-200">
          {filteredProvinces.length > 0 ? (
            filteredProvinces.map((province) => {
              const isSelected = selectedProvince === province;
              return (
                <button
                  key={province}
                  type="button"
                  onClick={() => handleSelect(province)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-accent/10 text-accent font-bold"
                      : "hover:bg-base-200/70 text-base-content font-medium"
                  }`}
                >
                  <span className="text-sm">{province}</span>
                  {isSelected && <Check className="w-4 h-4 text-accent" />}
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-base-content/50 text-sm font-medium">
              ไม่พบจังหวัดที่ตรงกับ "{searchQuery}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-base-300 bg-base-200/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost font-bold text-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}