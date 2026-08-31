import { Outlet } from "react-router";

function PublicLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default PublicLayout;
