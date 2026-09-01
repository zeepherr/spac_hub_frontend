import CategorySidebar from "@/components/auth/CatagorySidebar";
import React from "react";

function CatagoryPage() {
  return (
    <div className="p-2">
      <div className="grid grid-cols-1 px-5 gap-6 lg:grid-cols-[280px_1fr]">
        <CategorySidebar />
      </div>
    </div>
  );
}

export default CatagoryPage;
