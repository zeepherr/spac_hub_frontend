import React from "react";
import { useNavigate } from "react-router";
import { useUserProfile } from "@/hook/user/useUserProfile"; // ปรับ path ตามโครงสร้างโปรเจกต์ของคุณ

import {
  Plus,
  ShoppingBag,
  Tag,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  Truck,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import MyListingsSection, { MyListingsSectionSkeleton } from "@/components/userSellerDashboard/MyListingsSection";
import { useUpdateUserProfile } from "@/hook/user/useUpdateUserProfile";
import { useMyListings } from "@/hook/listing/useMyListings";

// รูปภาพสำรองเมื่อรูปจริงโหลดไม่ติดหรือยังไม่มีรูป
const DEFAULT_IMAGE = "https://placehold.co/100x100?text=No+Image";

export default function SellerDashboard() {
  const navigate = useNavigate();

  // ดึงข้อมูลโปรไฟล์ผู้ใช้จาก Backend ด้วย Custom Hook
  const { data: profileData, isLoading: isProfileLoading } = useUpdateUserProfile();
  const {data:listings, isLoading:isListingLoading, isError} = useMyListings()
  console.log('listings', listings)

  // จัดการชื่อที่จะนำมาแสดงผล (firstName + lastName)
  const user = profileData?.user;
  const userName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "ผู้ใช้งาน";

  const handleCreateSell = () => {
    navigate("/user/sell/create");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* 1. Header: Greeting + Create Listing Button */}
      {isProfileLoading ? (
        <DashboardHeaderSkeleton />
      ) : (
        <DashboardHeader userName={userName} onCreateClick={handleCreateSell} />
      )}

      {/* 2. Stat Cards Group */}
      <StatCardsGroup />

      {/* 3. Grid Row 1: คำสั่งซื้อล่าสุด (Left) + ประกาศขายของฉัน (Right - API จริง) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecentOrdersSection />
        </div>
        <div className="lg:col-span-5">
          <MyListingsSection />
        </div>
      </div>

      {/* 4. Grid Row 2: รายการที่ต้องดำเนินการ (Left) + ยอดขาย & ช่วยเหลือ (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ActionRequiredSection />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <SalesSummarySection />
          <HelpSection />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENTS & SKELETONS
   ========================================================================== */

// 1. Dashboard Header
function DashboardHeader({ userName, onCreateClick }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-base-content">ภาพรวมบัญชีผู้ขาย</h1>
        <p className="text-sm text-base-content/70">สวัสดี {userName}</p>
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

// 2. Stat Cards Group
function StatCardsGroup() {
  const stats = [
    { label: "กำลังซื้อ", value: "2", icon: ShoppingBag },
    { label: "กำลังขาย", value: "3", icon: Tag },
    { label: "รอตรวจสอบ", value: "1", icon: ShieldCheck },
    { label: "ข้อความใหม่", value: "4", icon: MessageSquare },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className="card hardware-surface p-4 flex flex-row items-center justify-between cursor-pointer hover:border-accent transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-base-200/80 group-hover:bg-accent/10 transition-colors">
                <IconComponent className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs text-base-content/70 font-semibold block">
                  {item.label}
                </span>
                <span className="text-xl font-bold text-base-content">
                  {item.value}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-base-content/40 group-hover:text-base-content group-hover:translate-x-0.5 transition-all" />
          </div>
        );
      })}
    </div>
  );
}

export function StatCardsGroupSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card hardware-surface p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 w-full">
            <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
            <div className="space-y-2 w-full">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-6 w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 3. Recent Orders Section
function RecentOrdersSection() {
  return (
    <div className="card hardware-surface p-5 space-y-4 h-full">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
        <h3 className="font-bold text-base text-base-content">คำสั่งซื้อล่าสุด</h3>
        <button type="button" className="text-xs text-base-content/70 hover:text-accent font-semibold flex items-center gap-1">
          ดูคำสั่งซื้อทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Order Item 1 */}
        <div className="p-3 bg-base-200/40 rounded-xl border border-base-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-base-content/80">#ORD-240501-0001</span>
            <span className="badge badge-sm badge-info font-medium">ผู้ซื้อ</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-base-300 rounded-lg overflow-hidden shrink-0">
              <img
                src="https://placehold.co/100x100?text=GPU"
                alt="GPU"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_IMAGE;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">GALAX RTX 3060 Ti (1-Click OC)</p>
              <p className="text-sm font-black text-accent mt-0.5">฿8,900</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold pt-2 border-t border-base-300/40 text-base-content/60">
            <div className="text-success font-bold">ชำระแล้ว<br/><span className="text-[9px] font-normal">1 พ.ค. 67</span></div>
            <div className="text-success font-bold">ผู้ขายส่งสินค้า<br/><span className="text-[9px] font-normal">2 พ.ค. 67</span></div>
            <div className="text-accent font-bold">SPEC CHECK<br/><span className="text-[9px] font-normal">3 พ.ค. 67</span></div>
            <div className="opacity-40">ส่งถึงคุณ<br/><span className="text-[9px]"></span></div>
          </div>
        </div>

        {/* Order Item 2 */}
        <div className="p-3 bg-base-200/40 rounded-xl border border-base-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-base-content/80">#ORD-240429-0015</span>
            <span className="badge badge-sm badge-info font-medium">ผู้ซื้อ</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-base-300 rounded-lg overflow-hidden shrink-0">
              <img
                src="https://placehold.co/100x100?text=MacBook"
                alt="MacBook"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_IMAGE;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">MacBook Air M1 2020</p>
              <p className="text-sm font-black text-accent mt-0.5">฿15,900</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold pt-2 border-t border-base-300/40 text-base-content/60">
            <div className="text-success font-bold">ชำระแล้ว<br/><span className="text-[9px] font-normal">29 เม.ย. 67</span></div>
            <div className="text-success font-bold">ผู้ขายส่งสินค้า<br/><span className="text-[9px] font-normal">30 เม.ย. 67</span></div>
            <div className="text-success font-bold">SPEC CHECK<br/><span className="text-[9px] font-normal">1 พ.ค. 67</span></div>
            <div className="text-success font-bold">ส่งถึงคุณ<br/><span className="text-[9px] font-normal">คาดว่า 3 พ.ค. 67</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecentOrdersSectionSkeleton() {
  return (
    <div className="card hardware-surface p-5 space-y-4 h-full">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton h-4 w-24" />
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-3 bg-base-200/40 rounded-xl space-y-3">
            <div className="flex justify-between">
              <div className="skeleton h-3 w-28" />
              <div className="skeleton h-4 w-12 rounded-full" />
            </div>
            <div className="flex gap-3 items-center">
              <div className="skeleton w-14 h-14 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-20" />
              </div>
            </div>
            <div className="skeleton h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Action Required Section
function ActionRequiredSection() {
  return (
    <div className="card hardware-surface p-5 space-y-4">
      <h3 className="font-bold text-base text-base-content border-b border-base-300/60 pb-3">
        รายการที่ต้องดำเนินการ
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-base-200/40 rounded-xl border border-base-200 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-orange-500/10 text-accent shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-base-content truncate">
                ส่ง RTX 3060 Ti ให้ศูนย์ตรวจสอบ ภายใน 1 วัน
              </p>
              <p className="text-[11px] text-base-content/60">คำสั่งซื้อ #ORD-240501-0001</p>
            </div>
          </div>
          <button type="button" className="btn btn-sm btn-outline text-xs font-bold shrink-0">
            กรอกเลขพัสดุ <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-base-200/40 rounded-xl border border-base-200 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-orange-500/10 text-accent shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-base-content truncate">
                ยืนยันได้รับ MacBook Air M1
              </p>
              <p className="text-[11px] text-base-content/60">คำสั่งซื้อ #ORD-240429-0015</p>
            </div>
          </div>
          <button type="button" className="btn btn-sm btn-outline text-xs font-bold shrink-0">
            ยืนยันรับสินค้า <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ActionRequiredSectionSkeleton() {
  return (
    <div className="card hardware-surface p-5 space-y-4">
      <div className="skeleton h-5 w-40 border-b border-base-300 pb-3" />
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 border border-base-200 rounded-xl">
            <div className="flex items-center gap-3 w-full">
              <div className="skeleton w-9 h-9 rounded-lg shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="skeleton h-3 w-3/4" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
            <div className="skeleton h-8 w-24 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Sales Summary Section
function SalesSummarySection() {
  return (
    <div className="card hardware-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
        <h3 className="font-bold text-base text-base-content">ยอดขายของฉัน</h3>
        <button type="button" className="text-xs text-base-content/70 hover:text-accent font-semibold flex items-center gap-1">
          ดูรายงานทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-semibold text-base-content/60">ยอดขายทั้งหมด</p>
          <p className="text-xl font-black text-base-content mt-0.5">฿24,800</p>
          <span className="text-[10px] text-success font-bold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +18% จาก 30 วันที่แล้ว
          </span>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-base-content/60">รอบปล่อยเงิน</p>
          <p className="text-xl font-black text-accent mt-0.5">฿8,900</p>
          <p className="text-[10px] text-base-content/50 mt-0.5">จะโอนเมื่อผู้ซื้อได้รับสินค้าสำเร็จ</p>
        </div>
      </div>
    </div>
  );
}

export function SalesSummarySectionSkeleton() {
  return (
    <div className="card hardware-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
        <div className="skeleton h-5 w-28" />
        <div className="skeleton h-4 w-20" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-3 w-16" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-3 w-28" />
        </div>
      </div>
    </div>
  );
}

// 7. Help Section
function HelpSection() {
  return (
    <div className="card hardware-surface p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-base-content">มีปัญหากับคำสั่งซื้อ?</p>
          <p className="text-[11px] text-base-content/60">ทีมงานพร้อมช่วยเหลือตลอด 24 ชม.</p>
        </div>
      </div>
      <button type="button" className="btn btn-sm btn-accent text-xs font-bold shrink-0">
        เปิดเคสช่วยเหลือ <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
      </button>
    </div>
  );
}

export function HelpSectionSkeleton() {
  return (
    <div className="card hardware-surface p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 w-full">
        <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
        <div className="space-y-1.5 w-full">
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-3 w-48" />
        </div>
      </div>
      <div className="skeleton h-8 w-28 rounded-lg shrink-0" />
    </div>
  );
}