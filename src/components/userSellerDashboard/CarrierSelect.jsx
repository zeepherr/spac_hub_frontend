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

// input/select แบบแก้วโปร่งบางๆ (เดียวกับ search box ที่ใช้ทั้งเว็บ)
const GLASS_INPUT =
  "w-full rounded-xl border border-neutral-300 bg-white/70 backdrop-blur-sm px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

export default function CarrierSelect({ value, onChange, disabled }) {
  const [isCustom, setIsCustom] = useState(
    value && !THAI_CARRIERS.includes(value) ? true : false,
  );

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    if (selected === "OTHER") {
      setIsCustom(true);
      onChange(""); // Clear previous value for custom input
    } else {
      setIsCustom(false);
      onChange(selected);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-neutral-900 p-0">
        Courier / Shipping Company <span className="text-red-500">*</span>
      </label>

      {/* Carrier Select Dropdown */}
      <select
        className={GLASS_INPUT}
        value={isCustom ? "OTHER" : value}
        onChange={handleSelectChange}
        disabled={disabled}
      >
        <option value="" disabled>
          -- Select Courier --
        </option>
        {THAI_CARRIERS.map((carrier) => (
          <option key={carrier} value={carrier}>
            {carrier}
          </option>
        ))}
        <option value="OTHER">Other (Specify manually)</option>
      </select>

      {/* Custom Carrier Input Field */}
      {isCustom && (
        <input
          type="text"
          placeholder="Specify courier name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${GLASS_INPUT} mt-2`}
        />
      )}
    </div>
  );
}
