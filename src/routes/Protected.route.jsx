import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "../stores/auth.store";

const ProtectedRoute = () => {
  const location = useLocation();
  const status = useAuthStore((state) => state.status);
  if (status === "checking") {
    return <p>Loading...</p>;
  }
  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
