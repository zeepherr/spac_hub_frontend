import { useState } from "react";
import { useNavigate } from "react-router";

import { logout } from "@/api/auth/auth.api";
import { Button } from "@/components/ui/button";
import { clearClientSession } from "@/lib/clear.client.session";
import { toast } from "sonner";

export function LogoutButton() {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);

      const data = await logout();
      setIsLoggingOut(true);
      await clearClientSession({ explicit: true });
      toast.success(data.message, { position: "top-center" });
    } catch (error) {
      // toast.warning(
      //   "This device is signed out locally, but the server could not be reached.",
      // );
      console.log(error);
    } finally {
      // Client must still log out

      navigate("/login", {
        replace: true,
      });

      setIsLoggingOut(false);
    }
  }

  return (
    <Button
      variant="outline"
      disabled={isLoggingOut}
      onClick={handleLogout}
      className="cursor-pointer"
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
}
