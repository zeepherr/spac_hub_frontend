import React from "react";
import { useNavigate } from "react-router";
import { useUserProfile } from "@/hook/user/useUserProfile";
import { useMyListings } from "@/hook/listing/useMyListings";

// Import UI Components ย่อยเข้ามาแทน


import DashboardHeader, { DashboardHeaderSkeleton } from "@/components/userSellerDashboard/DashboardHeader";
import StatCardsGroup from "@/components/userSellerDashboard/StatCardsGroup";
import RecentOrdersSection from "@/components/userSellerDashboard/RecentOrdersSection";
import MyListingsSection from "@/components/userSellerDashboard/MyListingsSection";
import ActionRequiredSection from "@/components/userSellerDashboard/ActionRequiredSection";
import SalesSummarySection from "@/components/userSellerDashboard/SalesSummarySection";
import HelpSection from "@/components/userSellerDashboard/HelpSection";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile();
  const { data: listings, isLoading: isListingLoading, isError } = useMyListings();

  const user = profileData?.user || profileData?.data?.user || profileData?.data;
  const userName = user?.firstName || user?.lastName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "USER";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {isProfileLoading ? (
        <DashboardHeaderSkeleton />
      ) : (
        <DashboardHeader userName={userName} onCreateClick={() => navigate("/user/sell/create")} />
      )}

      <StatCardsGroup />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <RecentOrdersSection />
        </div>
        <div className="lg:col-span-6">
          <MyListingsSection listings={listings} isLoading={isListingLoading} isError={isError} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ActionRequiredSection />
        </div>
        <div className="lg:col-span-6 space-y-6">
          <SalesSummarySection />
          <HelpSection />
        </div>
      </div>
    </div>
  );
}