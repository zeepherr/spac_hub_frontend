import React, { useState } from "react";
import { Plus, RotateCw } from "lucide-react";
import { useUserProfile } from "@/hook/user/useUserProfile"; // ปรับ path ตามโครงสร้างโปรเจกต์

// เดียวกับ GLASS_IDLE/CTA_GLASS ที่ใช้ทั้งเว็บ
const GLASS_IDLE =
  "border border-neutral-200/70 bg-white/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

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
  const displayName =
    userName || (user ? `${user.firstName} ${user.lastName}`.trim() : "User");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Account Overview
        </h1>
        <p className="text-sm text-neutral-500">Welcome back, {displayName}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* ปุ่ม Refresh หน้า (สไตล์แก้วโปร่ง) */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh Page"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-neutral-700 transition-all active:scale-95 cursor-pointer hover:bg-white/80 ${GLASS_IDLE}`}
        >
          <RotateCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline text-xs font-semibold">
            Refresh
          </span>
        </button>

        {/* ปุ่ม Create New Listing */}
        <button
          type="button"
          onClick={onCreateClick}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${CTA_GLASS}`}
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
