import { Outlet } from "react-router";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex h-dvh overflow-hidden">
      <AdminSidebar />

      <main className="scrollbar-hide min-w-0 flex-1 overflow-y-auto bg-[#F5F5F4]">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
