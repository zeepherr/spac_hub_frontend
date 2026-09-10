import { LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { logout } from "@/api/auth/auth.api";
import { Button } from "@/components/ui/button";
import { clearClientSession } from "@/lib/clear.client.session";

export function LogoutButton() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      const data = await logout();

      toast.success(data?.message || "Logout Successfully.", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Logout error:", error);

      toast.warning("The server does not response, please try again.", {
        position: "top-center",
      });
    } finally {
      await clearClientSession({
        explicit: true,
      });

      navigate("/login", {
        replace: true,
      });

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
        "justify-start gap-3 rounded-md",
        "bg-white px-4 py-3",
        "text-sm font-medium text-black",
        "transition-colors",
        // "hover:bg-red-500/10 hover:text-red-400",
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",
      ].join(" ")}
    >
      {isLoggingOut ? (
        <LoaderCircle
          size={18}
          className="shrink-0 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <LogOut
          size={18}
          strokeWidth={2}
          className="shrink-0"
          aria-hidden="true"
        />
      )}

      <span className="text-destructive">
        {isLoggingOut ? "Signing Out..." : "Logout"}
      </span>
    </Button>
  );
}
