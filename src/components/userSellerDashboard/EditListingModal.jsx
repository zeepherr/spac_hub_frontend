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
      toast.error("กรุณากรอกราคาให้ถูกต้อง (ต้องเป็นตัวเลขที่มากกว่า 0)");
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
          toast.success("แก้ไขประกาศเรียบร้อยแล้ว");
          onClose();
        },
        onError: (error) => {
          console.error("Update Listing Error Payload:", payload);
          console.error("Backend Error Detail:", error?.response?.data);
          toast.error(error?.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไขประกาศ");
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
            <h3 className="font-bold text-xl">แก้ไขข้อมูลประกาศขาย</h3>
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
          
          {/* Section 1: รูปภาพสินค้า */}
          {imageFiles.length > 0 && (
            <div className="space-y-3">
              <label className="font-bold text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                รูปภาพสินค้า ({imageFiles.length} รูป)
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

          {/* Section 2: ฟอร์มแก้ไขข้อมูล */}
          <div className="space-y-4">
            <h4 className="font-bold text-base text-primary">ข้อมูลประกาศขาย</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 🔒 ชื่อสินค้า */}
              <div className="form-control md:col-span-2">
                <label className="label text-xs font-bold text-base-content flex items-center justify-between">
                  <span>ชื่อสินค้า</span>
                  <span className="text-[10px] text-base-content/50 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> ไม่สามารถแก้ไขได้
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

              {/* ✏️ ราคา */}
              <div className="form-control">
                <label className="label text-xs font-bold text-base-content">
                  ราคา (บาท) *
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="input input-bordered w-full text-sm font-semibold"
                  placeholder="0.00"
                />
              </div>

              {/* 🔒 หมวดหมู่สินค้า */}
              <div className="form-control">
                <label className="label text-xs font-bold text-base-content flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    หมวดหมู่สินค้า
                  </span>
                  <span className="text-[10px] text-base-content/50 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> ไม่สามารถแก้ไขได้
                  </span>
                </label>
                <div className="input input-bordered w-full text-sm font-semibold flex items-center justify-between text-left bg-base-200/70 text-base-content/60 cursor-not-allowed select-none">
                  <span className="font-bold">
                    {selectedCategoryName || "ไม่ระบุหมวดหมู่"}
                  </span>
                  <Lock className="w-4 h-4 text-base-content/40" />
                </div>
              </div>

              {/* 🔒 แบรนด์ */}
              <div className="form-control">
                <label className="label text-xs font-bold text-base-content flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    แบรนด์
                  </span>
                  <span className="text-[10px] text-base-content/50 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> ไม่สามารถแก้ไขได้
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

              {/* 🔒 รุ่น / Model */}
              <div className="form-control">
                <label className="label text-xs font-bold text-base-content flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-primary" />
                    รุ่น / Model
                  </span>
                  <span className="text-[10px] text-base-content/50 font-normal flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> ไม่สามารถแก้ไขได้
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

              {/* ✏️ เรียกใช้ ProvinceSelect Component ที่แยกมา */}
              <ProvinceSelect
                value={editForm.location}
                onChange={(val) => handleInputChange("location", val)}
                className="md:col-span-2"
              />

              {/* ✏️ รายละเอียดเพิ่มเติม */}
              <div className="form-control md:col-span-2">
                <label className="label text-xs font-bold text-base-content">
                  รายละเอียดเพิ่มเติม *
                </label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="textarea textarea-bordered w-full text-sm font-semibold resize-none"
                  placeholder="อธิบายรายละเอียดสินค้าเพิ่มเติม..."
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
                    ผลวิเคราะห์สภาพสินค้าโดย AI
                  </span>
                  <span className="badge badge-warning font-black text-xs">
                    {Number(listingData.estimatedScore).toFixed(1)} / 100 คะแนน
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
            ยกเลิก
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
                ยืนยันการแก้ไข
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}