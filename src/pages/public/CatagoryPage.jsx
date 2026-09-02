import React from "react";
import { Outlet } from "react-router";

function CatagoryPage() {
  return (
    <div className="p-2">
      <Outlet />
    </div>
  );
}

export default CatagoryPage;
