import React from "react";
import { useNavigate } from "react-router";
import { useUserProfile } from "@/hook/user/useUserProfile";
import { useMyListings } from "@/hook/listing/useMyListings";

import DashboardHeader, {
  DashboardHeaderSkeleton,
} from "@/components/userSellerDashboard/DashboardHeader";
import StatCardsGroup from "@/components/userSellerDashboard/StatCardsGroup";
import RecentOrdersSection from "@/components/userSellerDashboard/RecentOrdersSection";
import MyListingsSection from "@/components/userSellerDashboard/MyListingsSection";
import ActionRequiredSection from "@/components/userSellerDashboard/ActionRequiredSection";
import SalesSummarySection from "@/components/userSellerDashboard/SalesSummarySection";
import HelpSection from "@/components/userSellerDashboard/HelpSection";

// bg หลักมาตรฐานของทั้งเว็บ (เดียวกับที่ตั้งไว้ใน PublicLayout.jsx) - ใช้กับพื้นหลังหลักของหน้าเท่านั้น
// ไม่ใช่ bg ของปุ่มหรือ element ย่อย เดิมหน้านี้ไม่มี bg เลย เลยเติมให้เหมือนหน้าอื่นๆ
const PAGE_BG =
  "bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(0deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)]";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile();
  const {
    data: listings,
    isLoading: isListingLoading,
    isError,
  } = useMyListings();

  const user =
    profileData?.user || profileData?.data?.user || profileData?.data;
  const userName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "USER";

  return (
    <div className={`min-h-full w-full space-y-6 p-4 sm:p-6 md:p-8 ${PAGE_BG}`}>
      {isProfileLoading ? (
        <DashboardHeaderSkeleton />
      ) : (
        <DashboardHeader
          userName={userName}
          onCreateClick={() => navigate("/user/sell/create")}
        />
      )}
      <StatCardsGroup />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <RecentOrdersSection />
        </div>
        <div className="lg:col-span-6">
          <MyListingsSection
            listings={listings}
            isLoading={isListingLoading}
            isError={isError}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ActionRequiredSection />
        </div>
        <div className="lg:col-span-6">
          <SalesSummarySection />
        </div>
      </div>
    </div>
  );
}
