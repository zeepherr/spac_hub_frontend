import { Outlet } from "react-router";

function PublicLayout() {
  return (
    <div>
      PublicLayout <Outlet />
    </div>
  );
}

export default PublicLayout;
