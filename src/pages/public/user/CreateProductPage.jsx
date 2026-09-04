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
    });
  };

  // --- SAVE DRAFT BUTTON HANDLER ---
  const handleSaveDraftAnytime = () => {
    if (!listingId) return;

    const payload = {
      title: formData.title.trim(),
      price: Number(formData.price) || 0,
      categoryId: Number(formData.categoryId),
      description: formData.description?.trim() || "",
      brand: formData.brand?.trim() || "",
      model: formData.model?.trim() || "",
      location: formData.location?.trim() || "",
    };

    updateListingMutation.mutate({ listingId, payload });
  };

  // --- STEP 1 SUBMIT ---
  const handleStep1Submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const parsedCategoryId = Number(formData.categoryId);
    const parsedPrice = Number(formData.price);

    if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) return;
    if (isNaN(parsedPrice) || parsedPrice <= 0) return;
    if (parsedPrice > 99999999) return;

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
        },
      });
    } else {
      updateListingMutation.mutate(
        { listingId, payload },
        {
          onSuccess: () => {
            setCurrentStep(2);
            scrollToSection(step2Ref);
          },
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
        },
      }
    );
  };

  // --- STEP 3 SUBMIT ---
  const handleStep3Submit = () => {
    if (imageFiles.length === 0) return;

    uploadImagesMutation.mutate(
      { listingId, images: imageFiles },
      {
        onSuccess: () => {
          setCurrentStep(4);
          scrollToSection(step4Ref);
        },
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
      },
    });
  };

  // --- STEP 5: CONFIRM PUBLISH FROM MODAL ---
  const handleFinalPublish = async () => {
    if (!listingId) return;

    const parsedPrice = Number(formData.price) || 0;
    if (parsedPrice > 99999999) return;

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

      setTimeout(() => {
        window.location.href = "/user/sell";
      }, 1000);
    } catch (err) {
      console.error("Publish listing error:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-base-100 text-base-content pb-20 relative">
      <SellerStepProgress
        currentStep={currentStep}
        onSaveDraft={handleSaveDraftAnytime}
        savingDraft={updateListingMutation.isPending}
        listingId={listingId}
      />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          <div className="xl:col-span-2 space-y-8">
            
            {/* Step 1: ข้อมูลเบื้องต้น */}
            <div ref={step1Ref} className="relative">
              <ProductBasicForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleStep1Submit}
                loading={isGlobalLoading}
                onAiAutofill={handleAiAutofill}
              />
            </div>

            {/* Step 2: ตอบคำถามสภาพสินค้า */}
            <div className="relative">
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