import Header from "../components/auth/AuthHeader";
import { Outlet } from "react-router";

function PublicLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#ffffff]">
      <Header />
      <div className="flex items-center justify-center overflow-y-auto p-4">
        PuclicLayput
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;
