import { Outlet } from "react-router";
import AuthAside from "../components/auth/AuthAside";
import Header from "../components/auth/AuthHeader";

function AuthLayout() {
  return (
    <div className="flex flex-col h-screen scroll-smooth scrollbar-none overflow-hidden">
      <Header />
      <div className="grid flex-1 lg:grid-cols-2 ">
        <AuthAside />
        <div className="flex items-center justify-center p-6 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
