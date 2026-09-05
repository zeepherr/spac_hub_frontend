import { Truck } from "lucide-react";

// ก็อปสไตล์มาจาก FormInput ใน EditProfile.jsx ให้ข้อมูลจัดส่งหน้าตาเหมือนกัน
function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  error,
  inputProps,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-neutral-800"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
          error
            ? "border-red-500"
            : "border-neutral-300 focus:border-orange-500"
        }`}
        {...inputProps}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Step 1: ฟอร์มที่อยู่จัดส่ง
// register/errors เป็นของ useForm instance ที่ parent (CheckoutStep1Page.jsx) เป็นคนถืออยู่ ส่งลงมาเป็น prop เฉยๆ
// เพราะปุ่ม "ไปขั้นตอนถัดไป" ที่ยิง handleSubmit จริงๆ อยู่ใน OrderSummary ฝั่ง parent (คนละ component กับฟอร์มนี้)
// ปุ่มย้อนกลับย้ายไปอยู่ตรงกลางบน StepIndicator แล้ว (ใน CheckoutStep1Page.jsx) ไม่ได้อยู่ในการ์ดนี้อีกต่อไป
//
// default errors={{}} กันไว้เผื่อ parent ยังไม่ได้ส่ง errors prop มา (หรือส่งมาเป็น undefined) - เมื่อก่อนถ้า
// parent ลืมส่ง errors มา component นี้จะพังทันทีตรง errors.firstName?.message (อ่าน .firstName จาก undefined)
// ใส่ default ไว้ให้ component ไม่ crash แม้ parent จะยังไม่ผูก errors ให้ครบ (แค่ validation error จะไม่โชว์เฉยๆ
// ไม่ถึงกับทำแอปพัง) - ถ้าเจอ error นี้อีก ให้เช็คว่าไฟล์ที่ render <CheckoutStep1 /> (ควรจะเป็น
// CheckoutStep1Page.jsx) ส่ง errors={errors} จาก useForm's formState ไปด้วยจริงๆ รึเปล่า
function CheckoutStep1({ register, errors = {} }) {
  return (
    <div className="hardware-surface p-6">
      <div className="mb-5 flex items-center gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900">
          <Truck size={18} className="text-[#f97316]" />
          Shipping Information
        </h2>
      </div>

      <form className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput
            id="firstName"
            label="First Name"
            placeholder="Enter your first name"
            error={errors.firstName?.message}
            inputProps={register("firstName")}
          />

          <FormInput
            id="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            error={errors.lastName?.message}
            inputProps={register("lastName")}
          />
        </div>

        <FormInput
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="0812345678"
          error={errors.phone?.message}
          inputProps={register("phone")}
        />

        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-semibold text-neutral-800"
          >
            Address
          </label>

          <textarea
            id="address"
            rows={5}
            placeholder="Enter your shipping address"
            className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-neutral-900 outline-none transition focus:ring-2 ${
              errors.address
                ? "border-red-500 focus:ring-red-100"
                : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
            }`}
            {...register("address")}
          />

          {errors.address && (
            <p className="mt-1 text-sm text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default CheckoutStep1;
