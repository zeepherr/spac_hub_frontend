import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../validations/auth.schema";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { formState:{errors}, register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

   
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <main className="min-h-screen bg-base-100 flex items-center justify-center px-4 py-10">
      <div className="hardware-surface w-full max-w-md bg-white p-8 md:p-10">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-block text-2xl font-black tracking-tight text-neutral-900"
          >
            SPEC<span className="text-orange-500">HUB</span>
          </Link>
        </div>
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-neutral-900 mb-8">
          เข้าสู่ระบบ
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-neutral-800 mb-2"
            >
              อีเมล
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              className="input input-bordered w-full h-12"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-neutral-800 mb-2"
            >
              รหัสผ่าน
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="กรอกรหัสผ่านของคุณ"
                className="input input-bordered w-full h-12 pr-12"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mt-3">
              <Link
                // to="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>
          </div>

          {/* Login */}
          <button
            type="submit"
            className="btn btn-accent w-full h-12 text-base"
          >
            เข้าสู่ระบบ
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="hardware-divider flex-1" />

            <span className="text-sm text-neutral-400">หรือ</span>

            <div className="hardware-divider flex-1" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="btn btn-outline w-full h-12 gap-3 bg-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.699 32.657 29.261 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />

              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.109 18.959 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z"
              />

              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.24 0-9.665-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />

              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.771 2.215-2.197 4.099-4.085 5.571l.003-.002 6.19 5.238C36.973 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            เข้าสู่ระบบด้วย Google
          </button>
        </form>

        {/* Register */}
        <div className="mt-6 text-center text-sm text-neutral-700">
          ยังไม่มีบัญชี?{" "}
          <Link
            to="/register"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
