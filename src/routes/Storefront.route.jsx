import { Navigate, Outlet } from "react-router";

import useAuthStore from "@/stores/auth.store";
import { ROLES } from "./Role.route";

const StorefrontRoute = () => {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  if (status === "authenticated" && user?.role === ROLES.ADMIN) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default StorefrontRoute;
