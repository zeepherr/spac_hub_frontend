import { useEffect } from "react";

import { restoreSession } from "@/api/auth/auth.session";
import useAuthStore from "../../stores/auth.store";
import GlobalLoading from "../loading/GlobalLoading";
const AuthInitializer = ({ children }) => {
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    restoreSession();
  }, []);

  if (status === "checking") {
    return <GlobalLoading />;
  }

  return children;
};
export default AuthInitializer;
