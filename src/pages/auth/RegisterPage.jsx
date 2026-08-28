import { registerUser } from "@/api/auth/auth.api.js";
import useAuthStore from "@/stores/auth.store.js";
import { savePendingRegistration } from "@/utils/auth/pending-registration.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { registerSchema } from "../../validations/auth.schema.js";

function RegisterPage() {
  const user = useAuthStore((store) => store.user);
  const navigate = useNavigate();

  // ใช้เฉพาะเปิด–ปิดการแสดงรหัสผ่าน
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ทำงานเมื่อข้อมูลผ่าน Zod
  const onSubmit = async (values) => {
    const { confirmPassword, ...restData } = values;
    try {
      const data = await registerUser(restData);
      savePendingRegistration({
        email: data.email,
        expiresAt: data.expiresAt,
        resendAvailableAt: data.resendAvailableAt,
      });
      navigate("/verify-email", {
        replace: true,
      });
    } catch (err) {
      toast.error(err.response?.data.message ?? "Register Error.");
    }
  };

  const inputStyle =
    "w-full rounded-lg border bg-white py-3 pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2";
  if (user) return <Navigate to={"/"} replace />;
  return (
    <main className="flex min-h-full items-center justify-center bg-neutral-100 px-4 py-10">
      <section className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white px-6 py-8 shadow-xl sm:px-10">
        {/* ส่วนหัว */}
        <header className="mb-7 text-center">
          <Link
            to="/"
            className="mb-4 inline-block text-2xl font-black tracking-tight text-neutral-900"
          >
            {" "}
            SPEC
            <span className="text-orange-500">HUB</span>
          </Link>

          <h1 className="text-3xl font-bold text-neutral-900">สมัครสมาชิก</h1>

          <p className="mt-2 text-sm text-neutral-500">
            สร้างบัญชีเพื่อเริ่มซื้อขายอุปกรณ์ไอทีมือสอง
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-semibold text-neutral-800"
              >
                ชื่อ
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  id="firstName"
                  type="text"
                  placeholder="กรอกชื่อ"
                  aria-invalid={errors.firstName ? "true" : "false"}
                  className={`${inputStyle} ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                  }`}
                  {...register("firstName")}
                />
              </div>

              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-semibold text-neutral-800"
              >
                นามสกุล
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  id="lastName"
                  type="text"
                  placeholder="กรอกนามสกุล"
                  aria-invalid={errors.lastName ? "true" : "false"}
                  className={`${inputStyle} ${
                    errors.lastName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                  }`}
                  {...register("lastName")}
                />
              </div>

              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              อีเมล
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                aria-invalid={errors.email ? "true" : "false"}
                className={`${inputStyle} ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
                {...register("email")}
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              รหัสผ่าน
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="รหัสผ่านอย่างน้อย 8 ตัวอักษร"
                aria-invalid={errors.password ? "true" : "false"}
                className={`${inputStyle} pr-12 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              ยืนยันรหัสผ่าน
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                className={`${inputStyle} pr-12 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
                {...register("confirmPassword")}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500"
                aria-label={
                  showConfirmPassword
                    ? "ซ่อนยืนยันรหัสผ่าน"
                    : "แสดงยืนยันรหัสผ่าน"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "กำลังสมัครสมาชิก..." : "สร้างบัญชี"}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs text-neutral-400">หรือ</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          {" "}
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            to="/login"
            className="font-semibold text-orange-500 hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
