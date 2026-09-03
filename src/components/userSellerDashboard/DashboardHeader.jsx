import React from "react";
import { Plus } from "lucide-react";
import { useUserProfile } from "@/hook/user/useUserProfile"; // ปรับ path ตามโครงสร้างโปรเจกต์

export default function DashboardHeader({ userName, onCreateClick }) {
  // หากไม่ได้ส่ง userName ผ่าน props มา ให้ดึงจาก hook โดยตรง
  const { data: profileData, isLoading } = useUserProfile();

  if (isLoading && !userName) {
    return <DashboardHeaderSkeleton />;
  }

  const user = profileData?.user;
  const displayName = userName || (user ? `${user.firstName} ${user.lastName}`.trim() : "ผู้ใช้งาน");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-base-content">ภาพรวมบัญชี</h1>
        <p className="text-sm text-base-content/70">สวัสดี {displayName}</p>
      </div>
      <button
        type="button"
        onClick={onCreateClick}
        className="btn btn-primary gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all"
      >
        <Plus className="w-5 h-5 text-accent" />
        <span>สร้างรายการขายใหม่</span>
      </button>
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
      <div className="skeleton h-12 w-48 rounded-xl" />
    </div>
  );
}