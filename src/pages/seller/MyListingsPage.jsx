import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  PackageX,
  Plus,
  Search,
} from "lucide-react";
import { useDeleteListing } from "@/hook/listing/useDeleteListing";
import { useMyListings } from "@/hook/listing/useMyListings";
import MyListingItemCard from "@/components/userSellerDashboard/MyListingItemCard";
import EditListingModal from "@/components/userSellerDashboard/EditListingModal";
import DeleteConfirmModal from "@/components/userSellerDashboard/DeleteConfirmModal";
import ListingDetailModal from "@/components/userSellerDashboard/ListingDetailModal";
// import { useDeleteListing } from "@/hook/listing/useDeleteListing";
// // เปลี่ยน path hook ให้ตรงกับโปรเจกต์ของคุณ (เช่น useMyListings)
// import { useMyListings } from "@/hook/listing/useMyListings"; 

// import EditListingModal from "@/components/sell/EditListingModal";
// import DeleteConfirmModal from "@/components/sell/DeleteConfirmModal";
// import ListingDetailModal from "@/components/sell/ListingDetailModal";
// import MyListingItemCard from "@/components/sell/MyListingItemCard";
// 🟢 ตัวแปร FILTER_TABS พร้อมการแยกสีแต่ละสถานะ
const FILTER_TABS = [
  { 
    id: "ALL", 
    label: "All Items",
    activeClass: "bg-slate-800 text-white shadow-slate-800/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-slate-100 text-slate-600"
  },
  { 
    id: "ACTIVE", 
    label: "Active",
    activeClass: "bg-emerald-500 text-white shadow-emerald-500/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-emerald-50 text-emerald-700"
  },
  { 
    id: "RESERVED", 
    label: "Reserved",
    activeClass: "bg-amber-500 text-white shadow-amber-500/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-amber-50 text-amber-700"
  },
  { 
    id: "DRAFT", 
    label: "Draft",
    activeClass: "bg-sky-500 text-white shadow-sky-500/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-sky-50 text-sky-700"
  },
  { 
    id: "SOLD", 
    label: "Sold",
    activeClass: "bg-neutral-600 text-white shadow-neutral-600/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-neutral-100 text-neutral-600"
  },
  { 
    id: "ARCHIVED", 
    label: "Archived",
    activeClass: "bg-rose-500 text-white shadow-rose-500/20",
    badgeActive: "bg-white/20 text-white",
    badgeInactive: "bg-rose-50 text-rose-700"
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

  const [selectedListingForDelete, setSelectedListingForDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedListingIdForDetail, setSelectedListingIdForDetail] = useState(null);
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
    <div className="min-h-screen bg-base-200/50 p-4 lg:p-6 w-full">
      {/* 🟢 เปลี่ยนจาก max-w-7xl เป็น w-full เพื่อขยายกว้างเต็มจอ */}
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors mb-1 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-3xl font-extrabold text-base-content">
              My Listings
            </h1>
            <p className="text-sm text-base-content/60">
              Manage all your listed products, drafts, and sold items
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/user/sell/create")}
            className="btn btn-primary text-white font-bold rounded-xl gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" /> Create Listing
          </button>
        </div>

        {/* Filter Controls Card */}
        <div className="card hardware-surface p-4 space-y-4 w-full">
          {/* Status Tabs แบบแยกสี */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-base-200">
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
                  className={`btn btn-sm rounded-xl font-bold transition-all shrink-0 border-none ${
                    isActive
                      ? `${tab.activeClass} shadow-md`
                      : "bg-base-200/60 text-base-content/70 hover:bg-base-200"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`badge badge-sm border-none ml-1 font-extrabold ${
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
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, brand, or model..."
              className="input input-bordered w-full pl-11 rounded-xl bg-base-100 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Listings Content Area */}
        <div className="w-full">
          {isLoading ? (
            <ListingsGridSkeleton />
          ) : isError ? (
            <div className="card hardware-surface p-8 text-center text-error space-y-2 w-full">
              <p className="font-bold">Failed to load listings data.</p>
              <button
                type="button"
                onClick={() => refetch && refetch()}
                className="btn btn-sm btn-outline btn-error mt-2"
              >
                Try Again
              </button>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="card hardware-surface p-12 text-center text-base-content/50 space-y-3 w-full">
              <PackageX className="w-16 h-16 mx-auto stroke-1" />
              <p className="text-lg font-bold">No listings found</p>

              <p className="text-sm text-base-content/40 max-w-sm mx-auto">
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
          className="flex flex-col justify-between bg-white border border-neutral-200/80 rounded-2xl p-3.5 min-h-[310px] space-y-3"
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