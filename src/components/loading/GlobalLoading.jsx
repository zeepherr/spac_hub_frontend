import { Cpu } from "lucide-react";

/**
 * GlobalLoading — full-screen loading state, IT-hardware themed to match
 * the rest of SpecHub (matte S badge, accent orange, hardware-shadow).
 *
 * Usage:
 *   - As a Suspense fallback:      <Suspense fallback={<GlobalLoading />}>...</Suspense>
 *   - While checking auth session: {isCheckingSession ? <GlobalLoading label="กำลังตรวจสอบสิทธิ์..." /> : <App />}
 *   - During a route loader:       return isLoading ? <GlobalLoading /> : <Outlet />
 */
export default function GlobalLoading({ label = "กำลังโหลดข้อมูล..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-hidden bg-base-100/75">
      {/* พื้นหลังลาย circuit board บางๆ */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(#171717 1px, transparent 1px), radial-gradient(#171717 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 16px 16px",
        }}
      />

      {/* วงแหวนหมุน (เหมือนพัดลมระบายความร้อน) รอบไอคอน CPU */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div
          className="absolute inset-0 animate-spin rounded-full border-4 border-base-300 border-t-[#f97316]"
          style={{ animationDuration: "0.9s" }}
        />
        <div
          className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-[#f97316]/40"
          style={{ animationDuration: "1.4s", animationDirection: "reverse" }}
        />

        <div className="matte flex h-14 w-14 items-center justify-center rounded-xl">
          <Cpu className="h-7 w-7 text-[#f97316]" strokeWidth={1.75} />
        </div>
      </div>

      {/* โลโก้ + ข้อความ */}
      <div className="relative text-center">
        <p className="text-lg font-black tracking-tight text-neutral-900">
          SPEC<span className="text-[#f97316]">HUB</span>
        </p>
        <p className="hardware-label mt-1 normal-case text-secondary">
          {label}
        </p>
      </div>

      {/* จุดกระพริบไล่จังหวะ */}
      <div className="relative flex gap-1.5">
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#f97316]"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#f97316]"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#f97316]"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
