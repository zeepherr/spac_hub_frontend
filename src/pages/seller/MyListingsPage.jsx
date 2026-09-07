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
const FILTER_TABS = [
  {
    id: "ALL",
    label: "All Items",
    activeClass: "bg-orange-500 text-white shadow-md shadow-orange-500/20",
    badgeActive: "bg-white/20 text-white",
  },
  {
    id: "ACTIVE",
    label: "Active",
    activeClass: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
    badgeActive: "bg-white/20 text-white",
  },
  {
    id: "RESERVED",
    label: "Reserved",
    activeClass: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
    badgeActive: "bg-white/20 text-white",
  },
  {
    id: "DRAFT",
    label: "Draft",
    activeClass: "bg-sky-500 text-white shadow-md shadow-sky-500/20",
    badgeActive: "bg-white/20 text-white",
  },
  {
    id: "SOLD",
    label: "Sold",
    activeClass: "bg-neutral-600 text-white shadow-md shadow-neutral-600/20",
    badgeActive: "bg-white/20 text-white",
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

  // Filter listings
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
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition-colors hover:text-orange-500"
            >
              <ArrowLeft className="h-4 w-4" /> Back
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
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <Plus className="h-5 w-5" /> Create Listing
          </button>
        </div>

        {/* Filter Controls Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
          {/* Status Filter Tabs - ปรับขนาดและแต่งสีที่นี่ */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-100 scrollbar-none">
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
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? tab.activeClass
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                      isActive
                        ? tab.badgeActive
                        : "bg-neutral-200/80 text-neutral-700"
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
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, brand, or model..."
              className="w-full rounded-full border border-neutral-200 bg-neutral-50/50 py-2.5 pl-11 pr-4 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Listings Content */}
        <div className="space-y-4">
          {isLoading ? (
            <ListingsListSkeleton />
          ) : isError ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-red-500 shadow-sm space-y-2">
              <p className="font-bold">Failed to load listings data.</p>
              <button
                type="button"
                onClick={() => refetch && refetch()}
                className="mt-2 rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                Try Again
              </button>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-neutral-400 shadow-sm space-y-3">
              <PackageX className="mx-auto h-16 w-16 stroke-1" />
              <p className="text-lg font-bold text-neutral-700">No listings found</p>
              <p className="mx-auto max-w-sm text-sm text-neutral-400">
                {searchQuery
                  ? `No items match "${searchQuery}"`
                  : `There are no listings under "${
                      FILTER_TABS.find((t) => t.id === activeTab)?.label
                    }" status.`}
              </p>
            </div>
          ) : (
            filteredListings.map((item) => (
              <MyListingItemCard
                key={item.id}
                item={item}
                onOpenDetail={handleOpenDetailModal}
                onOpenEdit={handleOpenEdit}
                onOpenDelete={handleOpenDeleteModal}
              />
            ))
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

function ListingsListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-5 w-full">
            <div className="h-[110px] w-[110px] shrink-0 animate-pulse rounded-xl bg-neutral-200" />
            <div className="w-full space-y-3">
              <div className="h-6 w-2/3 animate-pulse rounded bg-neutral-200" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-1/4 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}