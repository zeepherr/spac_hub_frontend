import CategorySidebar from "@/components/auth/CatagorySidebar";
import React from "react";
import { Outlet, useParams } from "react-router";

function ListingPage() {
  const { id } = useParams();
  const isDetailPage = Boolean(id);
  return (
    <div className="p-2">
      <div
        className={
          isDetailPage
            ? ""
            : "grid grid-cols-1 gap-6 px-5 lg:grid-cols-[280px_1fr]"
        }
      >
        {/* ซ่อน CategorySidebar เฉพาะตอนเปิดหน้า detail */}
        {!isDetailPage && <CategorySidebar />}
        <Outlet />
      </div>
    </div>
  );
}

export default ListingPage;
