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
      onChange(""); // Clear previous value for custom input
    } else {
      setIsCustom(false);
      onChange(selected);
    }
  };

  return (
    <div className="space-y-2">
      <label className="label text-sm font-bold text-base-content p-0">
        Courier / Shipping Company <span className="text-error">*</span>
      </label>

      {/* Carrier Select Dropdown */}
      <select
        className="select select-bordered w-full rounded-xl bg-base-100 focus:border-primary"
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
          className="input input-bordered w-full rounded-xl bg-base-100 focus:border-primary text-sm mt-2"
        />
      )}
    </div>
  );
}