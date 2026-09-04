import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDeleteListing } from "@/hook/listing/useDeleteListing";
import { ChevronRight, Edit3, PackageX, Sparkles, Trash2 } from "lucide-react";
import EditListingModal from "./EditListingModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ListingDetailModal from "./ListingDetailModal";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

export default function MyListingsSection({ listings, isLoading, isError }) {
  const navigate = useNavigate();
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();

  // State สำหรับ Modals
  const [selectedListingForEdit, setSelectedListingForEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedListingForDelete, setSelectedListingForDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedListingIdForDetail, setSelectedListingIdForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpenDetailModal = (listingId) => {
    setSelectedListingIdForDetail(listingId);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (e, item) => {
    e.stopPropagation(); // กันไม่ให้ Event ทะลุไปเปิด Detail Modal
    setSelectedListingForDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedListingForDelete) return;
    deleteListing(selectedListingForDelete.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedListingForDelete(null);
      },
    });
  };

  const handleOpenEdit = (e, item) => {
    e.stopPropagation(); // กันไม่ให้ Event ทะลุไปเปิด Detail Modal
    setSelectedListingForEdit(item);
    setIsEditModalOpen(true);
  };

  const renderStatusBadge = (status) => {
    const baseClass = "badge text-xs sm:text-sm font-bold shrink-0 min-w-[90px] py-3 text-center border-none shadow-sm";
    switch (status) {
      case "ACTIVE": return <span className={`${baseClass} badge-success text-white`}>กำลังขาย</span>;
      case "RESERVED": return <span className={`${baseClass} badge-warning text-white`}>ถูกจอง</span>;
      case "SOLD": return <span className={`${baseClass} badge-ghost`}>ขายแล้ว</span>;
      case "DRAFT": return <span className={`${baseClass} badge-info text-white`}>แบบร่าง</span>;
      case "ARCHIVED": return <span className={`${baseClass} badge-error text-white`}>ปิดประกาศ</span>;
      default: return <span className={`${baseClass} badge-outline`}>{status || "ทั่วไป"}</span>;
    }
  };

  const formatCondition = (condition) => {
    const map = { LIKE_NEW: "เหมือนใหม่", GOOD: "สภาพดี", FAIR: "สภาพปานกลาง", POOR: "สภาพใช้งาน" };
    return map[condition] ? `สภาพ ${map[condition]}` : null;
  };

  if (isLoading) return <MyListingsSectionSkeleton />;

  return (
    <>
      <div className="card hardware-surface p-6 space-y-4 h-[600px] flex flex-col">
        <div className="flex items-center justify-between border-b border-base-300/60 pb-4 shrink-0">
          <h3 className="font-bold text-xl text-base-content">ประกาศขายของฉัน</h3>
          <button
            type="button"
            onClick={() => navigate("/user/sell/listings")}
            className="text-sm text-base-content/70 hover:text-primary font-semibold flex items-center gap-1 transition-colors"
          >
            ดูประกาศทั้งหมด <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 flex-1 pr-2 p-1.5 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 overflow-y-auto">
          {isError ? (
            <div className="text-center py-8 text-sm text-error">ไม่สามารถโหลดข้อมูลประกาศได้</div>
          ) : !listings || listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-base-content/50 space-y-2">
              <PackageX className="w-12 h-12 stroke-1" />
              <p className="text-base">ยังไม่มีรายการประกาศขาย</p>
            </div>
          ) : (
            listings.map((item) => {
              const coverImage = item.images?.find((img) => img.isCover) || item.images?.[0];
              let imageUrl = DEFAULT_IMAGE;
              const rawUrl = coverImage?.imageUrl || coverImage?.url;
              const rawKey = coverImage?.imageKey || coverImage?.key;

              if (rawUrl) imageUrl = rawUrl;
              else if (rawKey) {
                imageUrl = rawKey.startsWith("http")
                  ? rawKey
                  : `${R2_PUBLIC_URL}/${rawKey}`;
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetailModal(item.id)}
                  className="flex items-center justify-between p-5 bg-base-100 border border-base-200 rounded-2xl cursor-pointer hover:border-primary hover:shadow-[0_4px_16px_rgba(249,115,22,0.15)] transition-all duration-200 gap-5"
                >
                  <div className="flex items-center gap-5 min-w-0 flex-1">
                    <div className="bg-base-300 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-base-200 w-[110px] h-[110px]">
                      <img src={imageUrl} alt={item.title || "สินค้า"} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 space-y-2 flex-1">
                      <p className="text-lg font-bold truncate text-base-content">{item.title || "ไม่มีชื่อสินค้า"}</p>
                      <p className="text-xl font-black text-primary">
                        {item.price ? `฿${Number(item.price).toLocaleString()}` : "-"}
                      </p>
                      {formatCondition(item.estimatedCondition) && (
                        <p className="text-sm text-base-content/70 font-medium">
                          {formatCondition(item.estimatedCondition)}
                        </p>
                      )}
                      {item.estimatedScore != null && (
                        <div className="flex items-center gap-1.5 text-sm text-amber-500 font-bold pt-0.5">
                          <Sparkles className="w-4 h-4 fill-amber-500/20" />
                          <span>AI Score: {Number(item.estimatedScore).toFixed(1)}/100</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {renderStatusBadge(item.status)}

                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(e, item)}
                      className="btn btn-ghost btn-circle btn-sm text-info hover:bg-info/10 transition-colors"
                      title="แก้ไขประกาศ"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleOpenDeleteModal(e, item)}
                      className="btn btn-ghost btn-circle btn-sm text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                      title="ลบประกาศ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
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
    </>
  );
}

function MyListingsSectionSkeleton() {
  return (
    <div className="card hardware-surface p-6 space-y-4 h-[600px] flex flex-col">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-4">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton h-4 w-24" />
      </div>
      <div className="space-y-4 flex-1 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-5 border border-base-200 rounded-2xl">
            <div className="flex items-center gap-5 w-full">
              <div className="skeleton rounded-xl shrink-0 w-[110px] h-[110px]" />
              <div className="space-y-3 w-full">
                <div className="skeleton h-6 w-2/3" />
                <div className="skeleton h-5 w-1/3" />
                <div className="skeleton h-4 w-1/4" />
              </div>
            </div>
            <div className="skeleton h-8 w-24 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}