import React from 'react';

export default function ProductBasicForm({ formData, setFormData, onNext }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="hardware-surface p-6 rounded-xl bg-white border border-[#d4d4d4] space-y-5">
      <div className="border-b border-[#d4d4d4] pb-3">
        <h3 className="text-xl font-bold text-[#171717]">ข้อมูลเบื้องต้น</h3>
      </div>

      {/* ชื่อสินค้า */}
      <div className="form-control w-full">
        <label className="label py-1">
          <span className="label-text hardware-label">ชื่อสินค้า</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="เช่น NVIDIA RTX 4090 Founders Edition"
          className="input input-bordered w-full rounded-lg"
        />
      </div>

      {/* หมวดหมู่ & แบรนด์ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text hardware-label">หมวดหมู่</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select select-bordered w-full rounded-lg"
          >
            <option value="">เลือกหมวดหมู่</option>
            <option value="gpu">การ์ดจอ (GPU)</option>
            <option value="cpu">ซีพียู (CPU)</option>
            <option value="ram">แรม (RAM)</option>
            <option value="mb">เมนบอร์ด (Mainboard)</option>
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text hardware-label">แบรนด์</span>
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="NVIDIA, ASUS, MSI..."
            className="input input-bordered w-full rounded-lg"
          />
        </div>
      </div>

      {/* รุ่น & ราคา */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text hardware-label">รุ่น (MODEL)</span>
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="RTX 4090"
            className="input input-bordered w-full rounded-lg"
          />
        </div>

        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text hardware-label">ราคา (THB)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373] font-bold">
              ฿
            </span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="55,000"
              className="input input-bordered w-full pl-8 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* รายละเอียดเพิ่มเติม */}
      <div className="form-control w-full">
        <label className="label py-1">
          <span className="label-text hardware-label">
            รายละเอียดเพิ่มเติม (เฉพาะผู้ซื้อรับด้วยตนเอง)
          </span>
        </label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="ระบุวันที่ซื้อ, การใช้งานที่ผ่านมาระบุเหตุผลที่ขาย..."
          className="textarea textarea-bordered w-full rounded-lg"
        />
      </div>

      {/* ปุ่มถัดไป */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="btn btn-accent bg-[#f97316] hover:bg-[#ea580c] text-white px-8 rounded-lg font-bold flex items-center gap-2 border-none"
        >
          ถัดไป ➔
        </button>
      </div>
    </div>
  );
}