import { Outlet } from "react-router";
import Header from "../components/auth/AuthHeader";
import MainNav from "@/components/auth/MainNav";

function PublicLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <div className="shrink-0">
        <Header />
        <MainNav />
      </div>

      <div className="min-h-0 w-full flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;
