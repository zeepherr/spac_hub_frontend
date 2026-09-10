import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  CheckCircle,
  Image as ImageIcon,
  Sparkles,
  Edit3,
  HelpCircle,
  AlertCircle,
  MapPin,
  ChevronRight,
  Layers,
  Lock,
} from "lucide-react";
import ProvinceSelectModal from "./ProvinceSelectModal";
// ลบ หรือ ปิดการใช้งาน CategorySelectModal หากไม่จำเป็นต้องใช้แล้ว
// import CategorySelectModal from "./CategorySelectModal";

import { useCategories } from "@/hook/category/useCategory";

// เดียวกับ GLASS_MODAL/GLASS_INPUT ที่ใช้ทั้งเว็บ
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";
const GLASS_INPUT =
  "w-full rounded-xl border border-neutral-300 bg-white/70 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
const SUCCESS_CTA_GLASS =
  "bg-emerald-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(16,185,129,0.3)] hover:bg-emerald-600";

export default function ProductSummaryModal({
  isOpen,
  onClose,
  formData,
  answers,
  questions,
  imageFiles,
  aiResult,
  onConfirmPublish,
  isPublishing,
  onUpdateFormData,
  onUpdateAnswers,
  categoryName,
}) {
  const [editForm, setEditForm] = useState(formData);
  const [editAnswers, setEditAnswers] = useState(answers);
  const [aiSummaryText, setAiSummaryText] = useState("");
  const [isEditedByUser, setIsEditedByUser] = useState(false);
  const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(
    categoryName || "",
  );

  const { data: categoriesData } = useCategories({ includeInactive: false });
  const categories = useMemo(() => {
    return Array.isArray(categoriesData)
      ? categoriesData
      : categoriesData?.data || [];
  }, [categoriesData]);

  useEffect(() => {
    setEditForm(formData);
    setEditAnswers(answers);

    const currentCatId = editForm?.categoryId || formData?.categoryId;

    if (currentCatId && categories.length > 0) {
      const foundCategory = categories.find(
        (c) => String(c.id) === String(currentCatId),
      );

      if (foundCategory) {
        setSelectedCategoryName(
          foundCategory.name || foundCategory.title || "",
        );
      } else if (categoryName) {
        setSelectedCategoryName(categoryName);
      }
    } else if (categoryName) {
      setSelectedCategoryName(categoryName);
    }

    const initialAiText =
      aiResult?.summary ||
      aiResult?.description ||
      (typeof aiResult === "string" ? aiResult : "");
    setAiSummaryText(initialAiText);
    setIsEditedByUser(false);
  }, [
    formData,
    answers,
    aiResult,
    isOpen,
    categoryName,
    categories,
    editForm.categoryId,
  ]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    const updated = { ...editForm, [field]: value };
    setEditForm(updated);
    onUpdateFormData(updated);
    setIsEditedByUser(true);
  };

  const handleSelectProvinceInModal = (provinceName) => {
    handleInputChange("location", provinceName);
  };

  const handleAiTextChange = (e) => {
    setAiSummaryText(e.target.value);
    setIsEditedByUser(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 overflow-y-auto"
        onClick={!isPublishing ? onClose : undefined}
      >
        <div
          className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${GLASS_MODAL}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-neutral-200/70 flex items-center justify-between bg-white/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-neutral-900">
              <Edit3 className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-xl">
                Review and Edit Details Before Listing
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-8 flex-1">
            {/* Section 1: รูปภาพสินค้า */}
            <div className="space-y-3">
              <label className="font-bold text-base flex items-center gap-2 text-neutral-900">
                <ImageIcon className="w-4 h-4 text-orange-500" />
                Uploaded Product Images ({imageFiles.length}{" "}
                {imageFiles.length === 1 ? "image" : "images"})
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {imageFiles.map((fileOrUrl, idx) => {
                  const previewUrl =
                    typeof fileOrUrl === "string"
                      ? fileOrUrl
                      : URL.createObjectURL(fileOrUrl);

                  return (
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
                  );
                })}
              </div>
            </div>

            <hr className="border-neutral-200/70" />

            {/* Section 2: ข้อมูลพื้นฐานสินค้า (Editable) */}
            <div className="space-y-4">
              <h4 className="font-bold text-base text-orange-500">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control md:col-span-2">
                  <label className="label text-xs font-bold text-neutral-900">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={GLASS_INPUT}
                  />
                </div>

                <div className="form-control">
                  <label className="label text-xs font-bold text-neutral-900">
                    Price (THB) *
                  </label>
                  <input
                    type="number"
                    value={editForm.price || ""}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={GLASS_INPUT}
                  />
                </div>

                {/* หมวดหมู่สินค้า (🔒 ล็อกไม่ให้แก้ไข) */}
                <div className="form-control">
                  <label className="label text-xs font-bold text-neutral-900 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-orange-500" />
                    Product Category *
                  </label>
                  <div className="w-full rounded-xl border border-neutral-200/70 bg-neutral-100/70 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold flex items-center justify-between text-left text-neutral-500 cursor-not-allowed select-none">
                    <span className="font-bold">
                      {selectedCategoryName || "Unspecified Category"}
                    </span>
                    <Lock className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label text-xs font-bold text-neutral-900">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={editForm.brand || ""}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    className={GLASS_INPUT}
                  />
                </div>

                <div className="form-control">
                  <label className="label text-xs font-bold text-neutral-900">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={editForm.model || ""}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className={GLASS_INPUT}
                  />
                </div>

                {/* ปุ่มเลือกจังหวัด */}
                <div className="form-control md:col-span-2">
                  <label className="label text-xs font-bold text-neutral-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    Shipping Location / Pickup Province *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsProvinceModalOpen(true)}
                    className={`${GLASS_INPUT} flex items-center justify-between text-left cursor-pointer hover:bg-orange-50/40`}
                  >
                    <span
                      className={
                        editForm.location
                          ? "text-neutral-900"
                          : "text-neutral-400"
                      }
                    >
                      {editForm.location || "Select province..."}
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label text-xs font-bold text-neutral-900">
                    Additional Description *
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className={`${GLASS_INPUT} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: คำตอบสภาพสินค้า (🔒 ล็อกไม่ให้แก้ไข) */}
            {questions.length > 0 && (
              <>
                <hr className="border-neutral-200/70" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-orange-500 flex items-center gap-2">
                      Item Condition Assessment
                    </h4>
                    <span className="text-xs text-neutral-400 flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded-md">
                      <Lock className="w-3 h-3" /> Answers locked
                    </span>
                  </div>

                  <div className="space-y-4">
                    {questions.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 bg-white/30 backdrop-blur-sm border border-neutral-200/50 rounded-xl space-y-2 opacity-80 cursor-not-allowed"
                      >
                        <label className="label-text font-bold text-neutral-900 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-orange-500" />
                          {q.label}{" "}
                          {q.isRequired && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>

                        {q.answerType === "BOOLEAN" && (
                          <div className="flex gap-6 pt-1 pointer-events-none">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <input
                                type="radio"
                                name={`modal_q_${q.id}`}
                                className="radio radio-sm accent-orange-500"
                                checked={editAnswers[q.id] === true}
                                disabled
                              />
                              <span>Yes / Fully Functional</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <input
                                type="radio"
                                name={`modal_q_${q.id}`}
                                className="radio radio-sm accent-orange-500"
                                checked={editAnswers[q.id] === false}
                                disabled
                              />
                              <span>No / Defective</span>
                            </label>
                          </div>
                        )}

                        {q.answerType === "SELECT" && (
                          <select
                            className="w-full rounded-xl border border-neutral-200/70 bg-neutral-100 px-4 py-2 text-sm font-semibold cursor-not-allowed pointer-events-none"
                            value={editAnswers[q.id] || ""}
                            disabled
                          >
                            <option value="">-- Please Select --</option>
                            {q.options?.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Section 4: AI Analysis Summary */}
            {aiResult && (
              <>
                <hr className="border-neutral-200/70" />
                <div
                  className={`p-4 rounded-xl space-y-3 border backdrop-blur-sm transition-colors ${
                    isEditedByUser
                      ? "bg-amber-500/10 border-amber-500/40"
                      : "bg-white/40 border-neutral-200/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm flex items-center gap-2 text-neutral-900">
                      {isEditedByUser ? (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      )}
                      {isEditedByUser
                        ? "AI Condition Analysis (Edited by User)"
                        : "AI Condition Analysis"}
                    </span>
                    <span className="rounded-full bg-amber-500 text-white font-black text-xs px-3 py-1">
                      {aiResult.estimatedScore ?? aiResult.score ?? "15"} / 100
                      PTS
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label py-0 pb-1">
                      <span className="label-text-alt text-neutral-500 font-semibold">
                        Condition Summary Note (Editable)
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={aiSummaryText}
                      onChange={handleAiTextChange}
                      className={`${GLASS_INPUT} text-xs font-mono resize-none`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200/70 bg-white/30 backdrop-blur-sm flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl px-4 py-2 font-bold text-sm text-neutral-600 transition hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isPublishing}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmPublish}
              disabled={isPublishing}
              className={`cursor-pointer rounded-xl px-6 py-2.5 font-bold text-sm transition disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 ${SUCCESS_CTA_GLASS}`}
            >
              {isPublishing ? (
                <span className="loading loading-spinner" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Confirm Listing
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ProvinceSelectModal
        isOpen={isProvinceModalOpen}
        onClose={() => setIsProvinceModalOpen(false)}
        selectedProvince={editForm.location}
        onSelectProvince={handleSelectProvinceInModal}
      />
    </>
  );
}
