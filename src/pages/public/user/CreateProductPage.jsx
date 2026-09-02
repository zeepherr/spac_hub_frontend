import React, { useState, useRef } from "react";
import { CheckCircle2, Edit3, AlertCircle, Info, X } from "lucide-react";


// Components
import SellerStepProgress from "@/components/userseller/SellerStepProgress";
import ProductBasicForm from "@/components/userseller/ProductBasicForm";
import ConditionFormSection from "@/components/userseller/ConditionFormSection";
import ImageUploadPreview from "@/components/userseller/ImageUploadPreview";
import AiConditionAnalysisSection from "@/components/userseller/AiConditionAnalysisSection";
import EscrowInfoSidebar from "@/components/userseller/EscrowInfoSidebar";
import { useIdentifyProduct } from "@/hook/listing/useIdentifyProduct";
import { useCreateListing } from "@/hook/listing/useCreateListing";
import { useUpdateListing } from "@/hook/listing/useUpdateListing";
import { useSaveListingConditionAnswers } from "@/hook/listing/useSavListingCondidionAnswer";
import { useUploadListingImages } from "@/hook/listing/useUploadListingImages";
import { useAnalyzeListingCondition } from "@/hook/listing/useAnalyzeListingCondition";
import { usePublishListing } from "@/hook/listing/usePublishListing";
import { useListingConditionQuestions } from "@/hook/listing/useListingConditionQuestions";
import ProductSummaryModal from "@/components/userseller/ProductSummaryModal";
import PublishStepSection from "@/components/userseller/PublishStepSection";


export default function CreateProductPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [listingId, setListingId] = useState(null);

  // State สำหรับ Toast Notification
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    brand: "",
    model: "",
    price: "",
    description: "",
  });

  const [answers, setAnswers] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  // --- React Query Mutations & Queries ---
  const identifyProductMutation = useIdentifyProduct();
  const createListingMutation = useCreateListing();
  const updateListingMutation = useUpdateListing();
  const saveAnswersMutation = useSaveListingConditionAnswers();
  const uploadImagesMutation = useUploadListingImages();
  const analyzeConditionMutation = useAnalyzeListingCondition();
  const publishListingMutation = usePublishListing();

  const {
    data: questionsData,
    isPending: isQuestionsLoading,
  } = useListingConditionQuestions(listingId);

  const questions = Array.isArray(questionsData)
    ? questionsData
    : questionsData?.data || [];

  const isGlobalLoading =
    identifyProductMutation.isPending ||
    createListingMutation.isPending ||
    updateListingMutation.isPending ||
    saveAnswersMutation.isPending ||
    uploadImagesMutation.isPending ||
    analyzeConditionMutation.isPending ||
    publishListingMutation.isPending;

  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);

  const scrollToSection = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleGoToStep = (targetStep) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      if (targetStep === 1) scrollToSection(step1Ref);
      if (targetStep === 2) scrollToSection(step2Ref);
      if (targetStep === 3) scrollToSection(step3Ref);
      if (targetStep === 4) scrollToSection(step4Ref);
    }
  };

  // --- 0. AI AUTOFILL HANDLER ---
  const handleAiAutofill = (file) => {
    if (!file) return;

    identifyProductMutation.mutate(file, {
      onSuccess: (res) => {
        const aiData = res?.data || res;
        if (aiData) {
          setFormData((prev) => ({
            ...prev,
            title: aiData.title || prev.title,
            brand: aiData.brand || prev.brand,
            model: aiData.model || prev.model,
            price: aiData.price ? String(aiData.price) : prev.price,
            description: aiData.description || prev.description,
            categoryId: aiData.categoryId ? String(aiData.categoryId) : prev.categoryId,
          }));
        }
      },
      onError: (err) => {
        const errMsg = err?.response?.data?.message || "ไม่สามารถดึงข้อมูลอัตโนมัติได้ กรุณากรอกข้อมูลด้วยตัวเอง";
        showToast(errMsg, "error");
      }
    });
  };

  // --- SAVE DRAFT BUTTON HANDLER ---
  const handleSaveDraftAnytime = () => {
    if (!listingId) {
      showToast("กรุณากรอกข้อมูลเบื้องต้นและกดถัดไปอย่างน้อย 1 ครั้ง เพื่อสร้างแบบร่างก่อนครับ", "warning");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      price: Number(formData.price) || 0,
      categoryId: Number(formData.categoryId),
      description: formData.description?.trim() || "",
      brand: formData.brand?.trim() || "",
      model: formData.model?.trim() || "",
    };

    updateListingMutation.mutate(
      { listingId, payload },
      {
        onSuccess: () => {
          showToast("บันทึกแบบร่างเรียบร้อยแล้ว!", "success");
        },
        onError: (err) => {
          const errMsg = err?.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกแบบร่าง";
          showToast(errMsg, "error");
        }
      }
    );
  };

  // --- STEP 1 SUBMIT (แก้ไขจุดที่ทำให้เกิด HTTP 400 Bad Request) ---
  const handleStep1Submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const parsedCategoryId = Number(formData.categoryId);
    const parsedPrice = Number(formData.price);

    // ตรวจสอบค่า Number ป้องกันการส่ง NaN ไป Backend
    if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
      return showToast("กรุณาเลือกหมวดหมู่สินค้าให้ถูกต้อง", "warning");
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return showToast("กรุณาระบุราคาที่มากกว่า 0", "warning");
    }

    // สร้าง Payload ที่สมบูรณ์ตามที่ Backend ต้องการ
    const payload = {
      categoryId: parsedCategoryId,
      title: formData.title.trim(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      price: parsedPrice,
      description: formData.description.trim(),
      location: formData.location.trim(),
    };

    if (!listingId) {
      // สร้าง Listing ใหม่
      createListingMutation.mutate(payload, {
        onSuccess: (res) => {
          const newId = res?.data?.id || res?.id || res?.data?.listing?.id;
          setListingId(newId);
          setCurrentStep(2);
          scrollToSection(step2Ref);
          showToast("บันทึกข้อมูลเบื้องต้นแล้ว", "success");
        },
        onError: (err) => {
          console.error("Create Listing 400 Error Response:", err?.response?.data);
          const serverError = err?.response?.data?.message || err?.response?.data?.error || "ข้อมูลไม่ถูกต้อง (400 Bad Request)";
          showToast(Array.isArray(serverError) ? serverError[0]?.message || "ข้อมูลไม่ถูกต้อง" : serverError, "error");
        }
      });
    } else {
      // อัปเดต Listing ที่มีอยู่
      updateListingMutation.mutate(
        { listingId, payload },
        {
          onSuccess: () => {
            setCurrentStep(2);
            scrollToSection(step2Ref);
            showToast("อัปเดตข้อมูลเบื้องต้นเรียบร้อย", "success");
          },
          onError: (err) => {
            console.error("Update Listing Error Response:", err?.response?.data);
            const serverError = err?.response?.data?.message || "อัปเดตข้อมูลไม่สำเร็จ";
            showToast(serverError, "error");
          }
        }
      );
    }
  };

  // --- STEP 2 ---
  const handleStep2Submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const formattedAnswers = Object.keys(answers).map((qId) => ({
      questionId: Number(qId),
      answerValue: answers[qId],
    }));

    saveAnswersMutation.mutate(
      { listingId, answers: formattedAnswers },
      {
        onSuccess: () => {
          setCurrentStep(3);
          scrollToSection(step3Ref);
          showToast("บันทึกข้อมูลสภาพสินค้าแล้ว", "success");
        },
        onError: (err) => {
          const errMsg = err?.response?.data?.message || "บันทึกข้อมูลสภาพสินค้าไม่สำเร็จ";
          showToast(errMsg, "error");
        }
      }
    );
  };

  // --- STEP 3 ---
  const handleStep3Submit = () => {
    if (imageFiles.length === 0) {
      return showToast("กรุณาอัปโหลดรูปภาพสินค้าอย่างน้อย 1 รูป", "warning");
    }

    uploadImagesMutation.mutate(
      { listingId, images: imageFiles },
      {
        onSuccess: () => {
          setCurrentStep(4);
          scrollToSection(step4Ref);
          showToast("อัปโหลดรูปภาพสินค้าเรียบร้อย", "success");
        },
        onError: (err) => {
          const errMsg = err?.response?.data?.message || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ";
          showToast(errMsg, "error");
        }
      }
    );
  };

  // --- STEP 4 ---
  const handleStep4Analyze = () => {
    analyzeConditionMutation.mutate(listingId, {
      onSuccess: (res) => {
        const analysisData = res?.data?.analysis || res?.analysis || res?.data;
        setAiResult(analysisData);
        setCurrentStep(5);
        scrollToSection(step5Ref);
        showToast("AI ประเมินสภาพสินค้าเรียบร้อยแล้ว", "success");
      },
      onError: (err) => {
        const errMsg = err?.response?.data?.message || "AI ไม่สามารถประเมินสภาพสินค้าได้";
        showToast(errMsg, "error");
      }
    });
  };

  // --- STEP 5: CONFIRM PUBLISH FROM MODAL ---
  const handleFinalPublish = () => {
    const payload = {
      title: formData.title.trim(),
      price: Number(formData.price) || 0,
      categoryId: Number(formData.categoryId),
      description: formData.description?.trim() || "",
      brand: formData.brand?.trim() || "",
      model: formData.model?.trim() || "",
    };

    updateListingMutation.mutate(
      { listingId, payload },
      {
        onSuccess: () => {
          publishListingMutation.mutate(listingId, {
            onSuccess: () => {
              setIsSummaryModalOpen(false);
              showToast("ลงประกาศสินค้าเรียบร้อยแล้ว!", "success");
              setTimeout(() => {
                window.location.href = "/user/sell";
              }, 1000);
            },
            onError: (err) => {
              const errMsg = err?.response?.data?.message || "ไม่สามารถลงประกาศสินค้าได้";
              showToast(errMsg, "error");
            }
          });
        },
        onError: (err) => {
          const errMsg = err?.response?.data?.message || "บันทึกข้อมูลสินค้าก่อนลงประกาศไม่สำเร็จ";
          showToast(errMsg, "error");
        }
      }
    );
  };

  return (
    <div className="w-full min-h-screen bg-base-100 text-base-content pb-20 relative">
      
      {/* TOAST NOTIFICATION FLOATING UI */}
      {toast.show && (
        <div className="toast toast-top toast-end z-50 animate-bounce-in">
          <div className={`alert text-white font-bold shadow-lg flex items-center gap-2 ${
            toast.type === "error" ? "alert-error bg-rose-600" :
            toast.type === "warning" ? "alert-warning bg-amber-500" :
            toast.type === "success" ? "alert-success bg-emerald-600" : "alert-info bg-blue-600"
          }`}>
            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "warning" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5" />}
            {toast.type === "info" && <Info className="w-5 h-5" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <SellerStepProgress
        currentStep={currentStep}
        onSaveDraft={handleSaveDraftAnytime}
        savingDraft={updateListingMutation.isPending}
        listingId={listingId}
        onStepClick={handleGoToStep}
      />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          <div className="xl:col-span-2 space-y-8">
            
            {/* Step 1: ข้อมูลเบื้องต้น */}
            <div ref={step1Ref} className="relative">
              {currentStep > 1 && (
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleGoToStep(1)}
                    className="btn btn-ghost btn-xs text-accent gap-1 font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> แก้ไข
                  </button>
                </div>
              )}
              <ProductBasicForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleStep1Submit}
                loading={isGlobalLoading}
                onAiAutofill={handleAiAutofill}
                showToast={showToast}
              />
            </div>

            {/* Step 2: ตอบคำถามสภาพสินค้า */}
            <div className="relative">
              {currentStep > 2 && (
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleGoToStep(2)}
                    className="btn btn-ghost btn-xs text-accent gap-1 font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> แก้ไข 
                  </button>
                </div>
              )}
              <ConditionFormSection
                stepRef={step2Ref}
                currentStep={currentStep}
                questions={questions}
                answers={answers}
                setAnswers={setAnswers}
                onSubmit={handleStep2Submit}
                loading={isGlobalLoading || isQuestionsLoading}
              />
            </div>

            {/* Step 3: อัปโหลดรูปภาพ */}
            <section
              ref={step3Ref}
              className={`bg-base-100 p-6 rounded-box border border-base-300 shadow-sm space-y-6 transition-all duration-300 ${
                currentStep < 3 ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <div className="flex items-center justify-between border-b border-base-300 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <h2 className="text-xl font-bold text-base-content">
                    อัปโหลดรูปภาพสินค้าจริง
                  </h2>
                </div>
                {currentStep > 3 && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleGoToStep(3)}
                      className="btn btn-ghost btn-xs text-accent gap-1 font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> แก้ไขรูปภาพ
                    </button>
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                )}
              </div>

              {currentStep >= 3 && (
                <div className="space-y-4">
                  <ImageUploadPreview
                    imageFiles={imageFiles}
                    setImageFiles={setImageFiles}
                    disabled={false}
                  />
                  {currentStep === 3 && (
                    <button
                      onClick={handleStep3Submit}
                      disabled={isGlobalLoading}
                      className="btn btn-primary text-white w-full rounded-field font-bold"
                    >
                      {uploadImagesMutation.isPending ? (
                        <span className="loading loading-spinner" />
                      ) : (
                        "บันทึกรูปภาพ & ถัดไป"
                      )}
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Step 4: AI Analyze */}
            <AiConditionAnalysisSection
              stepRef={step4Ref}
              currentStep={currentStep}
              onAnalyze={handleStep4Analyze}
              aiResult={aiResult}
              loading={isGlobalLoading}
            />

            {/* Step 5: Publish */}
            <PublishStepSection
              stepRef={step5Ref}
              currentStep={currentStep}
              onOpenSummaryModal={() => setIsSummaryModalOpen(true)}
              loading={isGlobalLoading}
            />
          </div>

          <div className="xl:col-span-1 sticky top-20">
            <EscrowInfoSidebar />
          </div>

        </div>
      </div>

      <ProductSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        formData={formData}
        answers={answers}
        questions={questions}
        imageFiles={imageFiles}
        aiResult={aiResult}
        onConfirmPublish={handleFinalPublish}
        isPublishing={publishListingMutation.isPending || updateListingMutation.isPending}
        onUpdateFormData={setFormData}
        onUpdateAnswers={setAnswers}
      />
    </div>
  );
}