import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router";

// เดียวกับ GLASS_PANEL/GLASS_IDLE/CTA_GLASS ที่ใช้ทั้งเว็บ - หน้านี้ไม่ใส่ bg หลัก ให้เนื้อหาอยู่ใน liquid card แทน
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const GLASS_IDLE =
  "border border-neutral-200/70 bg-white/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-full items-center justify-center px-5 py-12">
      <section
        className={`w-full max-w-xl rounded-3xl p-10 text-center ${GLASS_PANEL}`}
      >
        {/* Icon */}
        <div className="mx-auto flex size-24 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
          <SearchX
            size={44}
            strokeWidth={1.7}
            className="text-orange-500"
            aria-hidden="true"
          />
        </div>

        {/* Error Code */}
        <p className="mt-7 text-7xl font-black tracking-tight text-orange-500 sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900 sm:text-3xl">
          Page Not Found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-500 sm:text-base">
          This page may have been moved, deleted, or the URL may be incorrect.
          Please check the URL and try again.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-neutral-700 transition hover:border-orange-300 hover:bg-orange-50/70 hover:text-orange-600 ${GLASS_IDLE}`}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Go Back
          </button>

          <Link
            to="/"
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${CTA_GLASS}`}
          >
            <Home size={18} aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
