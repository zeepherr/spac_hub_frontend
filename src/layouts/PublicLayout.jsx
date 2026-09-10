import { useLayoutEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "../components/auth/AuthHeader";
import MainNav from "@/components/auth/MainNav";

function PublicLayout() {
  const location = useLocation();
  const hideMainNav = location.pathname.startsWith("/user");

  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (!headerRef.current) return;

    const updateHeight = () => setHeaderHeight(headerRef.current.offsetHeight);
    updateHeight();

    // เผื่อกรณีความสูงเปลี่ยนตอน resize จอ หรือ MainNav โผล่/หายตอนเปลี่ยนหน้า
    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, [hideMainNav]);

  return (
    <div className="h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(0deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)]"
      />

      <div ref={headerRef} className="fixed inset-x-0 top-0 z-40">
        <Header />
        {!hideMainNav && <MainNav />}
      </div>

      <div
        className="h-full w-full overflow-y-auto"
        style={{ paddingTop: headerHeight }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;
