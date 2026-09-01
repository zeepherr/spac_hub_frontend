import { MapPin, CalendarDays, Plus, Pencil } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* ================= PROFILE HEADER ================= */}
      <section className="border-b border-gray-200 bg-white px-8 pt-8">
        <div className="flex items-start justify-between gap-8">
          {/* Profile */}
          <div className="flex gap-5">
            <div className="relative">
              <img
                src="https://placehold.co/110x110"
                alt="profile"
                className="h-[110px] w-[110px] rounded-xl object-cover"
              />

              <button
                type="button"
                className="absolute -bottom-2 -right-2 flex h-9 w-9
                           items-center justify-center rounded-full
                           border bg-white shadow-sm"
              >
                <Pencil size={16} />
              </button>
            </div>

            <div>
              <h1 className="text-4xl font-bold leading-tight text-black">
                Somchai
                <br />
                TechMaster
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  <span>เป็นสมาชิกตั้งแต่ ต.ค. 2021</span>
                </div>

                <span className="text-gray-300">•</span>

                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>กรุงเทพมหานคร, ประเทศไทย</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-5">
            <div className="border border-gray-200 bg-[#f5f3f1] px-5 py-3">
              <p className="font-serif text-sm leading-tight">
                TECHGUARD
                <br />
                VERIFIED
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-3 rounded bg-black
                         px-7 py-4 font-semibold text-white
                         transition hover:bg-gray-800"
            >
              <Plus size={18} />
              สร้างรายการขายใหม่
            </button>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <nav className="mt-8 flex gap-10">
          <button className="border-b-2 border-black px-1 pb-4 font-semibold">
            ภาพรวมบัญชี
          </button>

          <button className="px-1 pb-4 text-gray-600 hover:text-black">
            คำสั่งซื้อของฉัน
          </button>

          <button className="px-1 pb-4 text-gray-600 hover:text-black">
            รายการขายของฉัน
          </button>

          <button className="px-1 pb-4 text-gray-600 hover:text-black">
            รายการที่บันทึกไว้
          </button>

          <button className="px-1 pb-4 text-gray-600 hover:text-black">
            การตั้งค่า
          </button>
        </nav>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="grid grid-cols-[280px_1fr] gap-7 p-8">
        {/* 
          ตามที่บอก:
          ฝั่งคะแนนความน่าเชื่อถือลงมาไม่ต้องทำ
          จึงปล่อยพื้นที่นี้ว่าง
        */}
        <div />

        {/* ================= PERSONAL INFO ================= */}
        <div className="rounded-lg border border-gray-200 bg-white p-7">
          <h2 className="mb-8 text-2xl font-bold">ข้อมูลส่วนตัว</h2>

          <form className="space-y-6">
            {/* Name + Phone */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  ชื่อ-นามสกุล
                </label>

                <input
                  type="text"
                  defaultValue="Somchai TechMaster"
                  className="w-full rounded border border-gray-300
                             bg-[#faf9f7] px-4 py-3 outline-none
                             transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  เบอร์โทรศัพท์
                </label>

                <input
                  type="text"
                  defaultValue="081-234-5678"
                  className="w-full rounded border border-gray-300
                             bg-[#faf9f7] px-4 py-3 outline-none
                             transition focus:border-black"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                อีเมลที่ลงทะเบียน
              </label>

              <input
                type="email"
                defaultValue="somchai.t@techguard.com"
                className="w-full rounded border border-gray-300
                           bg-[#faf9f7] px-4 py-3 outline-none
                           transition focus:border-black"
              />
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                ที่อยู่จัดส่ง
              </label>

              <textarea
                rows={4}
                defaultValue="123/45 อาคารเทคการ์ด ชั้น 12 ถนนสุขุมวิท แขวงคลองเคย เขตคลองเตย กรุงเทพมหานคร 10110"
                className="w-full resize-none rounded border border-gray-300
                           bg-[#faf9f7] px-4 py-3 outline-none
                           transition focus:border-black"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="rounded border border-gray-300 bg-white
                           px-7 py-3 font-medium hover:bg-gray-50"
              >
                แก้ไข
              </button>

              <button
                type="submit"
                className="rounded bg-black px-7 py-3
                           font-medium text-white hover:bg-gray-800"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}