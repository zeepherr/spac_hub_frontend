import AuthAside from "../components/auth/AuthAside";
import Header from "../components/auth/AuthHeader";
import { Outlet } from "react-router";

function PublicLayout() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="grid flex-1 lg:grid-cols-2">
        <AuthAside />
        <div className="flex items-center justify-center p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default PublicLayout;
