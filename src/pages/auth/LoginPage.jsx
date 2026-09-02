import { googleLogin, login } from "@/api/auth/auth.api";
import { establishSession } from "@/api/auth/auth.session";
import GlobalLoading from "@/components/loading/GlobalLoading";
import { getRoleHome } from "@/routes/Role.route";
import useAuthStore from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { loginSchema } from "../../validations/auth.schema";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const navigate = useNavigate();
  const user = useAuthStore((store) => store.user);

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    setFocus,
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirectUser = (user) => {
    navigate(user.role === "USER" ? "/" : getRoleHome(user.role), {
      replace: true,
    });
  };

  const focusNextOnEnter = (event, nextField) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    setFocus(nextField);
  };

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      const authenticatedUser = await establishSession(res);

      redirectUser(authenticatedUser);

      toast.success(res.message, {
        position: "top-center",
      });

      reset();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Login error.", {
        position: "top-center",
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed.", {
        position: "top-center",
      });
      return;
    }

    try {
      setIsGoogleSubmitting(true);

      const res = await googleLogin(credentialResponse.credential);

      const authenticatedUser = await establishSession(res);

      redirectUser(authenticatedUser);

      toast.success(res.message, {
        position: "top-center",
      });
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Google login failed.", {
        position: "top-center",
      });
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login was unsuccessful.", {
      position: "top-center",
    });
  };

  if (user) {
    return (
      <Navigate
        to={user.role === "USER" ? "/" : getRoleHome(user.role)}
        replace
      />
    );
  }

  if (isSubmitting || isGoogleSubmitting) {
    return <GlobalLoading label="กำลังเข้าสู่ระบบ..." />;
  }

  const inputStyle =
    "w-full rounded-lg border bg-white py-2.5 pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2";

  return (
    <main className="max-h-full flex items-center justify-center w-full">
      <div className="hardware-surface w-full max-w-md bg-white p-8 md:p-10">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-block text-2xl font-black tracking-tight text-neutral-900"
          >
            SPEC<span className="text-[#f97316]">HUB</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center text-neutral-900 mb-8">
          เข้าสู่ระบบ
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-neutral-800 mb-2"
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
                placeholder="กรอกอีเมลของคุณ"
                className={`${inputStyle} ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
                {...register("email")}
                onKeyDown={(event) => focusNextOnEnter(event, "password")}
              />
            </div>

            {errors.email && (
              <p className="text-[#f97316] text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-neutral-800 mb-2"
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
                placeholder="กรอกรหัสผ่านของคุณ"
                className={`${inputStyle} pr-12 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-[#f97316] text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            <div className="flex justify-end mt-3">
              <Link className="text-[#f97316] hover:underline hover:text-orange-600 text-sm font-medium">
                ลืมรหัสผ่าน?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full cursor-pointer rounded-lg bg-[#f97316] py-2.5 font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          <div className="flex items-center gap-4 py-1">
            <div className="hardware-divider flex-1" />
            <span className="text-sm text-neutral-400">หรือ</span>
            <div className="hardware-divider flex-1" />
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              shape="rectangular"
              size="large"
              width="368"
            />
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-700">
          ยังไม่มีบัญชี?{" "}
          <Link
            to="/register"
            className="text-[#f97316] hover:underline hover:text-orange-600 font-semibold"
          >
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
