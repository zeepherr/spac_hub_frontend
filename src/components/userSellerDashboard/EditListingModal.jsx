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
      price: listingData.price !== undefined && listingData.price !== null ? String(listingData.price) : "",
      brand: listingData.brand || "",
      model: listingData.model || "",
      location: listingData.location || "",
      description: listingData.description || "",
    });

    const catId = listingData.categoryId;
    if (catId && categories.length > 0) {
      const found = categories.find((c) => String(c.id) === String(catId));
      setSelectedCategoryName(
        found?.name || found?.title || listingData.category?.name || ""
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
      toast.error("Please enter a valid price (must be a number greater than 0)");
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
          toast.error(error?.response?.data?.message || "Failed to update listing");
        },
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-base-100 border border-base-300 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-base-300 flex items-center justify-between bg-base-200/50">
          <div className="flex items-center gap-2 text-base-content">
            <Edit3 className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-xl">Edit Listing Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:text-base-content"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* Section 1: Product Images */}
          {imageFiles.length > 0 && (
            <div className="space-y-3">
              <label className="font-bold text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Product Images ({imageFiles.length} {imageFiles.length === 1 ? 'image' : 'images'})
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {imageFiles.map((previewUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-base-300"
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

          <hr className="border-base-300" />

          {/* Section 2: Edit Form */}
          <div className="space-y-4">
            <h4 className="font-bold text-base text-primary">Listing Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 🔒 Product Title */}
              <div className="form-control md:col-span-2">
                <label className="label text-xs font-bold text-base-content flex items-center justify-between">
                  <span>Product Title</span>
                  <span className="text-[10px] text-base-content/50 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Cannot be edited
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editForm.title}
                    disabled
                    className="input input-bordered w-full text-sm font-semibold bg-base-200/70 text-base-content/60 cursor-not-allowed pr-10"
                  />
                  <Lock className="w-4 h-4 text-base-content/40 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* ✏️ Price */}
              <div className="form-control">
                <label className="label text-xs font-bold text-base-content">
                  Price (THB) *
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="input input-bordered w-full text-sm font-semibold"
                  placeholder="0.00"
                />
              </div>

              {/* 🔒 Category */}
              <div className="form-control">
                <label className="label text-xs font-bold text-base-content flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    Category
                  </span>
                  <span className="text-[10px] text-base-content/50 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Cannot be edited
                  </span>
                </label>
                <div className="input input-bordered w-full text-sm font-semibold flex items-center justify-between text-left bg-base-200/70 text-base-content/60 cursor-not-allowed select-none">
                  <span className="font-bold">
                    {selectedCategoryName || "Unspecified Category"}
                  </span>
                  <Lock className="w-4 h-4 text-base-content/40" />
                </div>
              </div>

              {/* 🔒 Brand */}
              <div className="form-control">
                <label className="label text-xs font-bold text-base-content flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    Brand
                  </span>
                  <span className="text-[10px] text-base-content/50 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Cannot be edited
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editForm.brand}
                    disabled
                    className="input input-bordered w-full text-sm font-semibold bg-base-200/70 text-base-content/60 cursor-not-allowed pr-10"
                  />
                  <Lock className="w-4 h-4 text-base-content/40 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* 🔒 Model */}
              <div className="form-control">
                <label className="label text-xs font-bold text-base-content flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-primary" />
                    Model
                  </span>
                  <span className="text-[10px] text-base-content/50 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Cannot be edited
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editForm.model}
                    disabled
                    className="input input-bordered w-full text-sm font-semibold bg-base-200/70 text-base-content/60 cursor-not-allowed pr-10"
                  />
                  <Lock className="w-4 h-4 text-base-content/40 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* ✏️ Province Select Component */}
              <ProvinceSelect
                value={editForm.location}
                onChange={(val) => handleInputChange("location", val)}
                className="md:col-span-2"
              />

              {/* ✏️ Description */}
              <div className="form-control md:col-span-2">
                <label className="label text-xs font-bold text-base-content">
                  Additional Description *
                </label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="textarea textarea-bordered w-full text-sm font-semibold resize-none"
                  placeholder="Describe additional details about the item..."
                />
              </div>
            </div>
          </div>

          {/* AI Score */}
          {listingData.estimatedScore && (
            <>
              <hr className="border-base-300" />
              <div className="p-4 bg-base-200/60 border border-base-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm flex items-center gap-2 text-base-content">
                    <Sparkles className="w-4 h-4 text-warning" />
                    AI Condition Analysis
                  </span>
                  <span className="badge badge-warning font-black text-xs">
                    {Number(listingData.estimatedScore).toFixed(1)} / 100 PTS
                  </span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-300 bg-base-200/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="btn btn-ghost font-bold text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUpdating}
            className="btn btn-primary text-white font-bold px-6 shadow-md"
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