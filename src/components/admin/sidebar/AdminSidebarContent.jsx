import AdminSidebarBrand from "./AdminSidebarBrand";
import AdminSidebarNavigation from "./AdminSidebarNavigation";
import AdminSidebarProfile from "./AdminSidebarProfile";

function SidebarContent({
  collapsed,
  isMobile,
  user,
  fullName,
  isProfileLoading,
  isProfileMenuOpen,
  isLoggingOut,
  onToggle,
  onClose,
  onNavigate,
  onProfile,
  onToggleProfileMenu,
  onLogout,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-5">
      {/* Brand */}
      <AdminSidebarBrand
        collapsed={collapsed}
        isMobile={isMobile}
        onToggle={onToggle}
        onClose={onClose}
      />

      {/* Navigation */}
      <AdminSidebarNavigation
        collapsed={collapsed}
        onNavigate={onNavigate}
      />

      {/* Profile area */}
      <AdminSidebarProfile
        collapsed={collapsed}
        user={user}
        fullName={fullName}
        isProfileLoading={isProfileLoading}
        isProfileMenuOpen={isProfileMenuOpen}
        isLoggingOut={isLoggingOut}
        onProfile={onProfile}
        onToggleProfileMenu={onToggleProfileMenu}
        onLogout={onLogout}
      />
    </div>
  );
}

export default SidebarContent;
