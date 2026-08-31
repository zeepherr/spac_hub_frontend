import { Outlet } from "react-router";
import AuthAside from "../components/auth/AuthAside";
import Header from "../components/auth/AuthHeader";

function AuthLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#ffffff]">
      <Header />
      <div className="grid min-h-0 flex-1 lg:grid-cols-2">
        <AuthAside />
        <div className="flex items-center justify-center overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
