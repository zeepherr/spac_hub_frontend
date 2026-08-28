import Header from "../components/auth/AuthHeader";
import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div>
      <Header />
      AuthLayout <Outlet />
    </div>
  );
}

export default AuthLayout;
