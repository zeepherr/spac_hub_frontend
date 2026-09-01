import { Outlet } from "react-router";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 bg-[#F5F5F4]">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;