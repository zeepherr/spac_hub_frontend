import { Navigate, Outlet } from "react-router";

import useAuthStore from "@/stores/auth.store";
import { getRoleHome } from "./Role.route";

const GuestRoute = () => {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  if (status === "authenticated" && user) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
