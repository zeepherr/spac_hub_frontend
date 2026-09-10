import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  CheckCircle,
  Image as ImageIcon,
  Sparkles,
  Edit3,
  Layers,
  Lock,
  Tag,
  Package,
} from "lucide-react";

import { useCategories } from "@/hook/category/useCategory";
import { useUpdateListing } from "@/hook/listing/useUpdateListing";
import { toast } from "sonner";
import ProvinceSelect from "./ProvinceSelect";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";

// Modal ต้องทึบกว่าการ์ดปกติหน่อย เพราะลอยทับเนื้อหาเยอะ (เดียวกับ GLASS_MODAL ที่ใช้ใน OrderDetail.jsx)
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";
// input แบบแก้วโปร่งบางๆ (เดียวกับ search box ที่ใช้ทั้งเว็บ)
const GLASS_INPUT =
  "w-full rounded-xl border border-neutral-300 bg-white/70 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
// input ที่แก้ไม่ได้ (disabled) แบบแก้วจางๆ
const GLASS_INPUT_DISABLED =
  "w-full rounded-xl border border-neutral-200/70 bg-neutral-100/60 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-neutral-500 cursor-not-allowed";

export default function EditListingModal({ isOpen, onClose, listingData }) {
  const { mutate: updateListing, isPending: isUpdating } = useUpdateListing();

  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    brand: "",
    model: "",
    location: "",
    description: "",
  });

  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const { data: categoriesData } = useCategories({ includeInactive: false });
  const categories = useMemo(() => {
    return Array.isArray(categoriesData)
      ? categoriesData
      : categoriesData?.data || [];
  }, [categoriesData]);

  useEffect(() => {
    if (!isOpen || !listingData) return;

    setEditForm({
      title: listingData.title || "",
      price:
        listingData.price !== undefined && listingData.price !== null
          ? String(listingData.price)
          : "",
      brand: listingData.brand || "",
      model: listingData.model || "",
      location: listingData.location || "",
      description: listingData.description || "",
    });

    const catId = listingData.categoryId;
    if (catId && categories.length > 0) {
      const found = categories.find((c) => String(c.id) === String(catId));
      setSelectedCategoryName(
        found?.name || found?.title || listingData.category?.name || "",
      );
    } else {
      setSelectedCategoryName(listingData.category?.name || "");
    }
  }, [isOpen, listingData, categories]);

  if (!isOpen || !listingData) return null;

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedPrice = Number(editForm.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error(
        "Please enter a valid price (must be a number greater than 0)",
      );
      return;
    }

    const payload = {
      price: parsedPrice,
      location: editForm.location?.trim() || undefined,
      description: editForm.description?.trim() || undefined,
    };

    updateListing(
      { listingId: listingData.id, payload },
      {
        onSuccess: () => {
          toast.success("Listing updated successfully");
          onClose();
        },
        onError: (error) => {
          console.error("Update Listing Error Payload:", payload);
          console.error("Backend Error Detail:", error?.response?.data);
          toast.error(
            error?.response?.data?.message || "Failed to update listing",
          );
        },
      },
    );
  };

  const imageFiles =
    listingData.images
      ?.map((img) => {
        if (img.imageUrl) return img.imageUrl;
        if (img.imageKey) {
          return img.imageKey.startsWith("http")
            ? img.imageKey
            : `${R2_PUBLIC_URL}/${img.imageKey}`;
        }
        return "";
      })
      .filter(Boolean) || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] overflow-y-auto"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isUpdating) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden ${GLASS_MODAL}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200/70 flex items-center justify-between bg-white/30">
          <div className="flex items-center gap-2 text-neutral-900">
            <Edit3 className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-xl">Edit Listing Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="cursor-pointer rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Section 1: Product Images */}
          {imageFiles.length > 0 && (
            <div className="space-y-3">
              <label className="font-bold text-base flex items-center gap-2 text-neutral-900">
                <ImageIcon className="w-4 h-4 text-orange-500" />
                Product Images ({imageFiles.length}{" "}
                {imageFiles.length === 1 ? "image" : "images"})
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {imageFiles.map((previewUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200/70"
                  >
                    <img
                      src={previewUrl}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="border-neutral-200/70" />

          {/* Section 2: Edit Form */}
          <div className="space-y-4">
            <h4 className="font-bold text-base text-orange-500">
              Listing Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 🔒 Product Title */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-neutral-900 flex items-center justify-between">
                  <span>Product Title</span>
                  <span className="text-[10px] text-neutral-400 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Cannot be edited
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editForm.title}
                    disabled
                    className={`${GLASS_INPUT_DISABLED} pr-10`}
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* ✏️ Price */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-neutral-900">
                  Price (THB) *
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className={GLASS_INPUT}
                  placeholder="0.00"
                />
              </div>

              {/* 🔒 Category */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-neutral-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-orange-500" />
                    Category
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Cannot be edited
                  </span>
                </label>
                <div
                  className={`${GLASS_INPUT_DISABLED} flex items-center justify-between text-left select-none`}
                >
                  <span className="font-bold">
                    {selectedCategoryName || "Unspecified Category"}
                  </span>
                  <Lock className="w-4 h-4 text-neutral-400" />
                </div>
              </div>

              {/* 🔒 Brand */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-neutral-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-orange-500" />
                    Brand
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Cannot be edited
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editForm.brand}
                    disabled
                    className={`${GLASS_INPUT_DISABLED} pr-10`}
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* 🔒 Model */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-neutral-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-orange-500" />
                    Model
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Cannot be edited
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editForm.model}
                    disabled
                    className={`${GLASS_INPUT_DISABLED} pr-10`}
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* ✏️ Province Select Component */}
              <ProvinceSelect
                value={editForm.location}
                onChange={(val) => handleInputChange("location", val)}
                className="md:col-span-2"
              />

              {/* ✏️ Description */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-neutral-900">
                  Additional Description *
                </label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`${GLASS_INPUT} resize-none`}
                  placeholder="Describe additional details about the item..."
                />
              </div>
            </div>
          </div>

          {/* AI Score */}
          {listingData.estimatedScore && (
            <>
              <hr className="border-neutral-200/70" />
              <div className="p-4 bg-white/40 backdrop-blur-sm border border-neutral-200/70 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm flex items-center gap-2 text-neutral-900">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Condition Analysis
                  </span>
                  <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-black text-white">
                    {Number(listingData.estimatedScore).toFixed(1)} / 100 PTS
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200/70 bg-white/30 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold text-neutral-600 transition hover:bg-neutral-100/70 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUpdating}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${CTA_GLASS}`}
          >
            {isUpdating ? (
              <span className="loading loading-spinner" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirm Edits
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
