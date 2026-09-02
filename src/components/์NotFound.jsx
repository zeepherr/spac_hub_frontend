import {
  ArrowLeft,
  Home,
  SearchX,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-full items-center justify-center bg-base-100 px-5 py-12">
      <section className="w-full max-w-xl text-center">
        {/* ไอคอน */}
        <div className="mx-auto flex size-24 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
          <SearchX
            size={44}
            strokeWidth={1.7}
            className="text-orange-500"
            aria-hidden="true"
          />
        </div>

        {/* หมายเลข Error */}
        <p className="mt-7 text-7xl font-black tracking-tight text-orange-500 sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-base-content sm:text-3xl">
          ไม่พบหน้าที่คุณค้นหา
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-base-content/60 sm:text-base">
          หน้านี้อาจถูกย้าย ถูกลบ
          หรือที่อยู่เว็บไซต์อาจไม่ถูกต้อง
          กรุณาตรวจสอบ URL แล้วลองใหม่อีกครั้ง
        </p>

        {/* ปุ่ม */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 px-5 py-3 text-sm font-bold text-base-content transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft
              size={18}
              aria-hidden="true"
            />
            ย้อนกลับ
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-600 bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
          >
            <Home
              size={18}
              aria-hidden="true"
            />
            กลับหน้าหลัก
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFound;