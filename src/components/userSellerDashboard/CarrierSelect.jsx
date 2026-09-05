import React, { useState } from "react";

const THAI_CARRIERS = [
  "Thailand Post",
  "KERRY Express",
  "Flash Express",
  "J&T Express",
  "Ninja Van",
  "Shopee Xpress",
  "DHL Express",
  "SCG Express",
];

export default function CarrierSelect({ value, onChange, disabled }) {
  const [isCustom, setIsCustom] = useState(
    value && !THAI_CARRIERS.includes(value) ? true : false
  );

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    if (selected === "OTHER") {
      setIsCustom(true);
      onChange(""); // ล้างค่าเดิมเพื่อให้พิมพ์ใหม่
    } else {
      setIsCustom(false);
      onChange(selected);
    }
  };

  return (
    <div className="space-y-2">
      <label className="label text-sm font-bold text-base-content p-0">
        บริษัทขนส่ง <span className="text-error">*</span>
      </label>

      {/* Dropdown เลือกขนส่ง */}
      <select
        className="select select-bordered w-full rounded-xl bg-base-100 focus:border-primary"
        value={isCustom ? "OTHER" : value}
        onChange={handleSelectChange}
        disabled={disabled}
      >
        <option value="" disabled>
          -- เลือกบริษัทขนส่ง --
        </option>
        {THAI_CARRIERS.map((carrier) => (
          <option key={carrier} value={carrier}>
            {carrier}
          </option>
        ))}
        <option value="OTHER">อื่นๆ (กรอกเอง)</option>
      </select>

      {/* แสดงช่องให้พิมพ์ชื่อขนส่งเองหากเลือก "อื่นๆ" */}
      {isCustom && (
        <input
          type="text"
          placeholder="ระบุชื่อบริษัทขนส่ง"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="input input-bordered w-full rounded-xl bg-base-100 focus:border-primary text-sm mt-2"
        />
      )}
    </div>
  );
}