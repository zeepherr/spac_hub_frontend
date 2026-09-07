import React, { useState } from "react";
import { Plus, RotateCw } from "lucide-react";
import { useUserProfile } from "@/hook/user/useUserProfile"; // ปรับ path ตามโครงสร้างโปรเจกต์

export default function DashboardHeader({ userName, onCreateClick }) {
  const { data: profileData, isLoading } = useUserProfile();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ฟังก์ชันสำหรับ Refresh หน้าเว็บ
  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  if (isLoading && !userName) {
    return <DashboardHeaderSkeleton />;
  }

  const user = profileData?.user;
  const displayName = userName || (user ? `${user.firstName} ${user.lastName}`.trim() : "User");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-base-content">Account Overview</h1>
        <p className="text-sm text-base-content/70">Welcome back, {displayName}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* ปุ่ม Refresh หน้า (สไตล์โทนสีขาว Minimal) */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh Page"
          className="btn bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-sm gap-2 rounded-xl transition-all active:scale-95 cursor-pointer dark:bg-base-100 dark:text-base-content dark:border-base-300 dark:hover:bg-base-200"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline text-xs font-semibold">Refresh</span>
        </button>

        {/* ปุ่ม Create New Listing (ปรับเป็นสีส้ม + Hover Effect) */}
        <button
          type="button"
          onClick={onCreateClick}
          className="btn bg-orange-500 hover:bg-orange-600 border-none text-white gap-2 shadow-md hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all rounded-xl font-bold cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Listing</span>
        </button>
      </div>
    </div>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="skeleton h-8 w-44 rounded-lg" />
        <div className="skeleton h-4 w-28 rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        <div className="skeleton h-12 w-24 rounded-xl" />
        <div className="skeleton h-12 w-48 rounded-xl" />
      </div>
    </div>
  );
}