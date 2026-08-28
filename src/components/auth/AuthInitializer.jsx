import { useEffect } from "react";

import { restoreSession } from "@/api/auth/auth.session";
import useAuthStore from "../../stores/auth.store";
const AuthInitializer = ({ children }) => {
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    restoreSession();
  }, []);

  if (status === "checking") {
    return <div className="min-h-screen bg-background">Loading....</div>;
  }

  return children;
};
export default AuthInitializer;
