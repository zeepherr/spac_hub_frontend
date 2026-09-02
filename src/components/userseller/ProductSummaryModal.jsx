import React, { useState, useEffect } from "react";
import { X, CheckCircle, Image as ImageIcon, Sparkles, Edit3, HelpCircle, AlertCircle, MapPin, ChevronRight } from "lucide-react";
import ProvinceSelectModal from "./ProvinceSelectModal"; 

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
}) {
  const [editForm, setEditForm] = useState(formData);
  const [editAnswers, setEditAnswers] = useState(answers);
  const [aiSummaryText, setAiSummaryText] = useState("");
  const [isEditedByUser, setIsEditedByUser] = useState(false);
  const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false); // 👈 State เปิดปิด Modal เลือกจังหวัด

  useEffect(() => {
    setEditForm(formData);
    setEditAnswers(answers);
    const initialAiText = aiResult?.summary || aiResult?.description || (typeof aiResult === "string" ? aiResult : "");
    setAiSummaryText(initialAiText);
    setIsEditedByUser(false);
  }, [formData, answers, aiResult, isOpen]);

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

  const handleAnswerChange = (qId, value) => {
    const updated = { ...editAnswers, [qId]: value };
    setEditAnswers(updated);
    onUpdateAnswers(updated);
    setIsEditedByUser(true);
  };

  const handleAiTextChange = (e) => {
    setAiSummaryText(e.target.value);
    setIsEditedByUser(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="bg-base-100 border border-base-300 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-5 border-b border-base-300 flex items-center justify-between bg-base-200/50">
            <div className="flex items-center gap-2 text-base-content">
              <Edit3 className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-xl">สรุปและแก้ไขข้อมูลสินค้าก่อนลงขาย</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:text-base-content"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-8 flex-1">
            
            {/* Section 1: รูปภาพสินค้า */}
            <div className="space-y-3">
              <label className="font-bold text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                รูปภาพสินค้าที่อัปโหลด ({imageFiles.length} รูป)
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
                      className="relative aspect-square rounded-xl overflow-hidden border border-base-300"
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

            <hr className="border-base-300" />

            {/* Section 2: ข้อมูลพื้นฐานสินค้า (Editable) */}
            <div className="space-y-4">
              <h4 className="font-bold text-base text-primary">ข้อมูลพื้นฐาน</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control md:col-span-2">
                  <label className="label text-xs font-bold text-base-content">ชื่อสินค้า *</label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="input input-bordered w-full text-sm font-semibold"
                  />
                </div>

                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content">ราคา (บาท) *</label>
                  <input
                    type="number"
                    value={editForm.price || ""}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="input input-bordered w-full text-sm font-semibold"
                  />
                </div>

                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content">หมวดหมู่ ID *</label>
                  <input
                    type="number"
                    value={editForm.categoryId || ""}
                    onChange={(e) => handleInputChange("categoryId", e.target.value)}
                    className="input input-bordered w-full text-sm font-semibold"
                  />
                </div>

                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content">แบรนด์ *</label>
                  <input
                    type="text"
                    value={editForm.brand || ""}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    className="input input-bordered w-full text-sm font-semibold"
                  />
                </div>

                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content">รุ่น / Model *</label>
                  <input
                    type="text"
                    value={editForm.model || ""}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className="input input-bordered w-full text-sm font-semibold"
                  />
                </div>

                {/* 👈 ปุ่มเลือกจังหวัดแบบ MODAL */}
                <div className="form-control md:col-span-2">
                  <label className="label text-xs font-bold text-base-content flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    สถานที่จัดส่ง / จังหวัดนัดรับ *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsProvinceModalOpen(true)}
                    className="input input-bordered w-full text-sm font-semibold flex items-center justify-between text-left hover:bg-base-200/50"
                  >
                    <span className={editForm.location ? "text-base-content" : "text-base-content/50"}>
                      {editForm.location || "เลือกจังหวัด..."}
                    </span>
                    <ChevronRight className="w-4 h-4 text-base-content/60" />
                  </button>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label text-xs font-bold text-base-content">รายละเอียดเพิ่มเติม *</label>
                  <textarea
                    rows={3}
                    value={editForm.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="textarea textarea-bordered w-full text-sm font-semibold resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: คำตอบสภาพสินค้า */}
            {questions.length > 0 && (
              <>
                <hr className="border-base-300" />
                <div className="space-y-4">
                  <h4 className="font-bold text-base text-primary">ตอบคำถามสภาพสินค้า</h4>
                  <div className="space-y-4">
                    {questions.map((q) => (
                      <div key={q.id} className="p-4 bg-base-200/50 rounded-field space-y-2">
                        <label className="label-text font-bold text-base-content flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-primary" />
                          {q.label} {q.isRequired && <span className="text-error">*</span>}
                        </label>

                        {q.answerType === "BOOLEAN" && (
                          <div className="flex gap-6 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                              <input
                                type="radio"
                                name={`modal_q_${q.id}`}
                                className="radio radio-primary radio-sm"
                                checked={editAnswers[q.id] === true}
                                onChange={() => handleAnswerChange(q.id, true)}
                              />
                              <span>ใช่ / ทำงานปกติ (Yes)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                              <input
                                type="radio"
                                name={`modal_q_${q.id}`}
                                className="radio radio-primary radio-sm"
                                checked={editAnswers[q.id] === false}
                                onChange={() => handleAnswerChange(q.id, false)}
                              />
                              <span>ไม่ใช่ / มีปัญหา (No)</span>
                            </label>
                          </div>
                        )}

                        {q.answerType === "SELECT" && (
                          <select
                            className="select select-bordered select-sm w-full rounded-field font-semibold"
                            value={editAnswers[q.id] || ""}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          >
                            <option value="">-- โปรดเลือกคำตอบ --</option>
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
                <hr className="border-base-300" />
                <div
                  className={`p-4 rounded-xl space-y-3 border transition-colors ${
                    isEditedByUser
                      ? "bg-warning/10 border-warning/40"
                      : "bg-base-200/60 border-base-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm flex items-center gap-2 text-base-content">
                      {isEditedByUser ? (
                        <AlertCircle className="w-4 h-4 text-warning" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-warning" />
                      )}
                      {isEditedByUser
                        ? "ผลวิเคราะห์สภาพสินค้าโดย AI แก้ไขเพิ่มเติม โดย USER"
                        : "ผลวิเคราะห์สภาพสินค้าโดย AI"}
                    </span>
                    <span className="badge badge-warning font-black text-xs">
                      {aiResult.estimatedScore ?? aiResult.score ?? "15"} / 100 คะแนน
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label py-0 pb-1">
                      <span className="label-text-alt text-base-content/70 font-semibold">
                        ข้อความสรุปวิเคราะห์สภาพ (สามารถแก้ไขได้)
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={aiSummaryText}
                      onChange={handleAiTextChange}
                      className="textarea textarea-bordered w-full text-xs font-mono bg-base-100 resize-none focus:border-primary"
                    />
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
              className="btn btn-ghost font-bold text-sm"
              disabled={isPublishing}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={onConfirmPublish}
              disabled={isPublishing}
              className="btn btn-success text-white font-bold px-6 shadow-md"
            >
              {isPublishing ? (
                <span className="loading loading-spinner" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> ยืนยันการลงขาย
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 👈 Call Province Modal */}
      <ProvinceSelectModal
        isOpen={isProvinceModalOpen}
        onClose={() => setIsProvinceModalOpen(false)}
        selectedProvince={editForm.location}
        onSelectProvince={handleSelectProvinceInModal}
      />
    </>
  );
}