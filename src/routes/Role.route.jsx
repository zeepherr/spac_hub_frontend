import { Navigate, Outlet } from "react-router";
import useAuthStore from "../stores/auth.store";

const RoleRoute = ({ allowRoles = [] }) => {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  if (status !== "authenticated" || !user)
    return <Navigate to="/login" replace />;
  if (!allowRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }
  return <Outlet />;
};

export default RoleRoute;

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const ROLE_HOME = {
  ADMIN: "/admin",
  USER: "/user",
};

export function getRoleHome(role) {
  return ROLE_HOME[role] ?? "/login";
}
