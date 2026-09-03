import React, { useState, useRef, useMemo } from "react";
import { CheckCircle2, Edit3, AlertCircle, Info, X } from "lucide-react";
import { toast } from "sonner";


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
import { useListingsByCategory } from "@/hook/listing/useListingByCategory";


export default function CreateProductPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [listingId, setListingId] = useState(null);

  const [showToast] = useState(() => (message, type = "info") => {
    if (type === "error") toast.error(message);
    else if (type === "warning") toast.warning(message);
    else if (type === "success") toast.success(message);
    else toast.info(message);
  });

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    brand: "",
    model: "",
    price: "",
    description: "",
    location: "",
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

  // ดึงรายการหมวดหมู่ทั้งหมดเพื่อนำมา match หาชื่อหมวดหมู่จริงจาก categoryId
  const { categories: categoriesData } = useListingsByCategory();
  const categories = useMemo(() => {
    return Array.isArray(categoriesData)
      ? categoriesData
      : categoriesData?.data || [];
  }, [categoriesData]);

  // หาชื่อหมวดหมู่จาก categoryId ปัจจุบัน
  const currentCategoryName = useMemo(() => {
    if (!formData.categoryId) return "";
    const found = categories.find(
      (c) => String(c.id) === String(formData.categoryId)
    );
    return found?.name || found?.title || "";
  }, [formData.categoryId, categories]);

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

  // --- AI AUTOFILL HANDLER ---
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
      location: formData.location?.trim() || "",
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

  // --- STEP 1 SUBMIT ---
  const handleStep1Submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const parsedCategoryId = Number(formData.categoryId);
    const parsedPrice = Number(formData.price);

    if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
      return showToast("กรุณาเลือกหมวดหมู่สินค้าให้ถูกต้อง", "warning");
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return showToast("กรุณาระบุราคาที่มากกว่า 0", "warning");
    }
    if (parsedPrice > 99999999) {
      return showToast("ราคาสินค้าสูงเกินกำหนด (สูงสุดไม่เกิน 99,999,999 บาท)", "warning");
    }

    const payload = {
      categoryId: parsedCategoryId,
      title: formData.title.trim(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      price: parsedPrice,
      description: formData.description.trim(),
      location: formData.location ? formData.location.trim() : "",
    };

    if (!listingId) {
      createListingMutation.mutate(payload, {
        onSuccess: (res) => {
          const newId = res?.data?.id || res?.id || res?.data?.listing?.id;
          setListingId(newId);
          setCurrentStep(2);
          scrollToSection(step2Ref);
          showToast("บันทึกข้อมูลเบื้องต้นแล้ว", "success");
        },
        onError: (err) => {
          const serverError = err?.response?.data?.message || err?.response?.data?.error || "ข้อมูลไม่ถูกต้อง (400 Bad Request)";
          showToast(Array.isArray(serverError) ? serverError[0]?.message || "ข้อมูลไม่ถูกต้อง" : serverError, "error");
        }
      });
    } else {
      updateListingMutation.mutate(
        { listingId, payload },
        {
          onSuccess: () => {
            setCurrentStep(2);
            scrollToSection(step2Ref);
            showToast("อัปเดตข้อมูลเบื้องต้นเรียบร้อย", "success");
          },
          onError: (err) => {
            const serverError = err?.response?.data?.message || "อัปเดตข้อมูลไม่สำเร็จ";
            showToast(serverError, "error");
          }
        }
      );
    }
  };

  // --- STEP 2 SUBMIT ---
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

  // --- STEP 3 SUBMIT ---
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

  // --- STEP 4 ANALYZE ---
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
  const handleFinalPublish = async () => {
    if (!listingId) {
      showToast("ไม่พบรหัสสินค้า กรุณาลองใหม่อีกครั้ง", "error");
      return;
    }

    const parsedPrice = Number(formData.price) || 0;
    if (parsedPrice > 99999999) {
      showToast("ราคาสินค้าสูงเกินกำหนด (สูงสุดไม่เกิน 99,999,999 บาท)", "warning");
      return;
    }

    try {
      // 1. เซฟอัปเดตข้อมูลสินค้าล่าสุด
      const payload = {
        title: formData.title?.trim() || "",
        price: parsedPrice,
        categoryId: Number(formData.categoryId),
        description: formData.description?.trim() || "",
        brand: formData.brand?.trim() || "",
        model: formData.model?.trim() || "",
        location: formData.location?.trim() || "",
      };

      await updateListingMutation.mutateAsync({ listingId, payload });

      // 2. เซฟอัปเดตคำตอบสภาพสินค้าล่าสุด
      if (Object.keys(answers).length > 0) {
        const formattedAnswers = Object.keys(answers).map((qId) => ({
          questionId: Number(qId),
          answerValue: answers[qId],
        }));

        await saveAnswersMutation.mutateAsync({
          listingId,
          answers: formattedAnswers,
        });
      }

      // 3. เรียก Publish
      await publishListingMutation.mutateAsync(listingId);

      setIsSummaryModalOpen(false);
      showToast("ลงประกาศสินค้าเรียบร้อยแล้ว!", "success");

      setTimeout(() => {
        window.location.href = "/user/sell";
      }, 1000);
    } catch (err) {
      console.error("Publish listing error:", err);
      const serverErrorMessage =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.error)
          ? err?.response?.data?.error[0]?.message
          : err?.response?.data?.error) ||
        "เกิดข้อผิดพลาดในการลงประกาศสินค้า";

      showToast(serverErrorMessage, "error");
    }
  };

  return (
    <div className="w-full min-h-screen bg-base-100 text-base-content pb-20 relative">
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
        isPublishing={
          publishListingMutation.isPending ||
          updateListingMutation.isPending ||
          saveAnswersMutation.isPending
        }
        onUpdateFormData={setFormData}
        onUpdateAnswers={setAnswers}
        categoryName={currentCategoryName}
      />
    </div>
  );
}