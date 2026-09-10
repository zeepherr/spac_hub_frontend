import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, PackageX, Plus, Search } from "lucide-react";
import { useDeleteListing } from "@/hook/listing/useDeleteListing";
import { useMyListings } from "@/hook/listing/useMyListings";
import MyListingItemCard from "@/components/userSellerDashboard/MyListingItemCard";
import EditListingModal from "@/components/userSellerDashboard/EditListingModal";
import DeleteConfirmModal from "@/components/userSellerDashboard/DeleteConfirmModal";
import ListingDetailModal from "@/components/userSellerDashboard/ListingDetailModal";

// bg หลักมาตรฐานของทั้งเว็บ (เดียวกับที่ตั้งไว้ใน PublicLayout.jsx) - ใช้กับพื้นหลังหลักของหน้าเท่านั้น
const PAGE_BG =
  "bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(0deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)]";
// เดียวกับ GLASS_PANEL/CTA_GLASS ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

// 🟢 ตัวแปร FILTER_TABS พร้อมการแยกสีแต่ละสถานะ
const FILTER_TABS = [
  {
    id: "ALL",
    label: "All Items",
    activeClass: "bg-slate-800 text-white shadow-slate-800/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-slate-100 text-slate-600",
  },
  {
    id: "ACTIVE",
    label: "Active",
    activeClass: "bg-emerald-500 text-white shadow-emerald-500/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "RESERVED",
    label: "Reserved",
    activeClass: "bg-amber-500 text-white shadow-amber-500/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-amber-50 text-amber-700",
  },
  {
    id: "DRAFT",
    label: "Draft",
    activeClass: "bg-sky-500 text-white shadow-sky-500/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-sky-50 text-sky-700",
  },
  {
    id: "SOLD",
    label: "Sold",
    activeClass: "bg-neutral-600 text-white shadow-neutral-600/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-neutral-100 text-neutral-600",
  },
  {
    id: "ARCHIVED",
    label: "Archived",
    activeClass: "bg-rose-500 text-white shadow-rose-500/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-rose-50 text-rose-700",
  },
];

export default function MyListingsPage() {
  const navigate = useNavigate();
  const { data: listings, isLoading, isError, refetch } = useMyListings();
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();

  // Filters & Search
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedListingForEdit, setSelectedListingForEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedListingForDelete, setSelectedListingForDelete] =
    useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedListingIdForDetail, setSelectedListingIdForDetail] =
    useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter listings base on Status and Search Query
  const filteredListings = useMemo(() => {
    if (!listings) return [];
    return listings.filter((item) => {
      const matchStatus = activeTab === "ALL" || item.status === activeTab;
      const matchSearch =
        !searchQuery.trim() ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [listings, activeTab, searchQuery]);

  // Handlers
  const handleOpenDetailModal = (listingId) => {
    setSelectedListingIdForDetail(listingId);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (e, item) => {
    e.stopPropagation();
    setSelectedListingForDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedListingForDelete) return;
    deleteListing(selectedListingForDelete.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedListingForDelete(null);
        if (refetch) refetch();
      },
    });
  };

  const handleOpenEdit = (e, item) => {
    e.stopPropagation();
    setSelectedListingForEdit(item);
    setIsEditModalOpen(true);
  };

  return (
    <div className={`min-h-screen w-full p-4 lg:p-6 ${PAGE_BG}`}>
      {/* 🟢 เปลี่ยนจาก max-w-7xl เป็น w-full เพื่อขยายกว้างเต็มจอ */}
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-orange-600 transition-colors mb-1 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-3xl font-extrabold text-neutral-900">
              My Listings
            </h1>
            <p className="text-sm text-neutral-500">
              Manage all your listed products, drafts, and sold items
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/user/sell/create")}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 font-bold transition ${CTA_GLASS}`}
          >
            <Plus className="w-5 h-5" /> Create Listing
          </button>
        </div>

        {/* Filter Controls Card */}
        <div className={`space-y-4 rounded-2xl p-4 w-full ${GLASS_PANEL}`}>
          {/* Status Tabs แบบแยกสี */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200/70">
            {FILTER_TABS.map((tab) => {
              const count =
                tab.id === "ALL"
                  ? listings?.length || 0
                  : listings?.filter((i) => i.status === tab.id).length || 0;

              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex shrink-0 cursor-pointer items-center rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                    isActive
                      ? `${tab.activeClass} shadow-md`
                      : "bg-white/40 text-neutral-600 backdrop-blur-sm hover:bg-white/60"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-extrabold ${
                      isActive ? tab.badgeActive : tab.badgeInactive
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, brand, or model..."
              className="w-full rounded-xl border border-neutral-300 bg-white/70 backdrop-blur-sm pl-11 pr-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Listings Content Area */}
        <div className="w-full">
          {isLoading ? (
            <ListingsGridSkeleton />
          ) : isError ? (
            <div
              className={`space-y-2 rounded-2xl p-8 text-center text-red-500 w-full ${GLASS_PANEL}`}
            >
              <p className="font-bold">Failed to load listings data.</p>
              <button
                type="button"
                onClick={() => refetch && refetch()}
                className="mt-2 cursor-pointer rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                Try Again
              </button>
            </div>
          ) : filteredListings.length === 0 ? (
            <div
              className={`space-y-3 rounded-2xl p-12 text-center text-neutral-400 w-full ${GLASS_PANEL}`}
            >
              <PackageX className="w-16 h-16 mx-auto stroke-1" />
              <p className="text-lg font-bold text-neutral-500">
                No listings found
              </p>

              <p className="text-sm text-neutral-400 max-w-sm mx-auto">
                {searchQuery
                  ? `No items match "${searchQuery}"`
                  : `There are no listings under "${
                      FILTER_TABS.find((t) => t.id === activeTab)?.label
                    }" status.`}
              </p>
            </div>
          ) : (
            /* 🟢 Grid ปรับการกระจายตามขนาดจอ ขยายได้สูงสุดถึง 6 คอลัมน์บนจอใหญ่ */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 w-full">
              {filteredListings.map((item) => (
                <MyListingItemCard
                  key={item.id}
                  item={item}
                  onOpenDetail={handleOpenDetailModal}
                  onOpenEdit={handleOpenEdit}
                  onOpenDelete={handleOpenDeleteModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditListingModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedListingForEdit(null);
        }}
        listingData={selectedListingForEdit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setSelectedListingForDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        listingData={selectedListingForDelete}
      />

      <ListingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedListingIdForDetail(null);
        }}
        listingId={selectedListingIdForDetail}
      />
    </div>
  );
}

/* Skeleton แสดงสถานะ Loading */
function ListingsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 w-full">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <div
          key={i}
          className="flex flex-col justify-between bg-white/70 backdrop-blur-sm border border-neutral-200/70 rounded-2xl p-3.5 min-h-[310px] space-y-3"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-3.5 w-12 rounded" />
            </div>
            <div className="skeleton w-full aspect-square rounded-xl" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-3 w-3/4" />
            <div className="skeleton h-5 w-1/2" />
          </div>
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-7 w-14 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
