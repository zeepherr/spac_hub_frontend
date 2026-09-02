import { useState } from "react";
import { useNavigate } from "react-router";
import { LoaderCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

import { logout } from "@/api/auth/auth.api";
import { Button } from "@/components/ui/button";
import { clearClientSession } from "@/lib/clear.client.session";

export function LogoutButton() {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] =useState(false);
  async function handleLogout() {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      const data = await logout();
      toast.success(
        data?.message || "ออกจากระบบสำเร็จ",
        {position: "top-center",},

      );
    } catch (error) {
      console.error("Logout error:", error);

      toast.warning(
        "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ แต่ออกจากระบบบนอุปกรณ์นี้แล้ว",
        {
          position: "top-center",
        },
      );
    } finally {
      await clearClientSession({
        explicit: true,
      });

      navigate("/login", {replace: true,});

      setIsLoggingOut(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={isLoggingOut}
      onClick={handleLogout}
      className={[
        "h-auto w-full cursor-pointer",
        "justify-start gap-3 rounded-xl",
        "px-4 py-3",
        "text-sm font-bold text-base-content",
        "transition-colors",
        "hover:bg-red-50 hover:text-red-600",
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",
      ].join(" ")}
    >
      {isLoggingOut ? (
        <LoaderCircle
          size={20}
          className="shrink-0 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <LogOut size={20} strokeWidth={2} className="shrink-0" aria-hidden="true"
        />
      )}

      <span>
        {isLoggingOut
          ? "กำลังออกจากระบบ..."
          : "ออกจากระบบ"}
      </span>
    </Button>
  );
}