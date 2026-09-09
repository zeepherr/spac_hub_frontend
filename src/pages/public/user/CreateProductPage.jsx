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
import ConfirmUploadModal from "@/components/userseller/ConfirmUploadModal";

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
  
  // Modal States
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isConfirmUploadOpen, setIsConfirmUploadOpen] = useState(false);

  // --- React Query Mutations & Queries ---
  const identifyProductMutation = useIdentifyProduct();
  const createListingMutation = useCreateListing();
  const updateListingMutation = useUpdateListing();
  const saveAnswersMutation = useSaveListingConditionAnswers();
  const uploadImagesMutation = useUploadListingImages();
  const analyzeConditionMutation = useAnalyzeListingCondition();
  const publishListingMutation = usePublishListing();

  // Fetch all categories
  const { categories: categoriesData } = useListingsByCategory();
  const categories = useMemo(() => {
    return Array.isArray(categoriesData)
      ? categoriesData
      : categoriesData?.data || [];
  }, [categoriesData]);

  // Find category name
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
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file provided");

      identifyProductMutation.mutate(file, {
        onSuccess: (res) => {
          const aiData = res?.data || res;
          if (aiData?.categoryId) {
            setFormData((prev) => ({
              ...prev,
              categoryId: String(aiData.categoryId),
            }));
          }
          resolve(aiData);
        },
        onError: (err) => {
          reject(err);
        },
      });
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

  // --- STEP 3 HANDLER ---
  const handleOpenUploadConfirm = () => {
    if (imageFiles.length === 0) {
      toast.error("กรุณาเลือกรูปภาพสินค้าอย่างน้อย 1 รูป");
      return;
    }
    setIsConfirmUploadOpen(true);
  };

  // --- STEP 3 SUBMIT ---
  const handleStep3Submit = () => {
    uploadImagesMutation.mutate(
      { listingId, images: imageFiles },
      {
        onSuccess: () => {
          setIsConfirmUploadOpen(false);
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

      {/* 🟢 เปลี่ยนจาก max-w-7xl mx-auto px-4 เป็น w-full px-4 sm:px-6 md:px-8 เพื่อขยายเต็มจอ */}
      <div className="w-full px-4 sm:px-6 md:px-8">
        {/* 🟢 ปรับเป็น grid-cols-4 ให้ฝั่ง Form กินพื้นที่ 3 ส่วน และ Sidebar กิน 1 ส่วน */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          
          <div className="xl:col-span-3 space-y-8">
            
            {/* Step 1: Basic Info */}
            <div ref={step1Ref} className="relative">
              <ProductBasicForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleStep1Submit}
                loading={isGlobalLoading}
                onAiAutofill={handleAiAutofill}
              />
            </div>

            {/* Step 2: Answer Condition Questions */}
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

            {/* Step 3: Upload Images */}
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
                    Upload Actual Product Images
                  </h2>
                </div>
              </div>

              {currentStep >= 3 && (
                <div className="space-y-4">
                  <ImageUploadPreview
                    imageFiles={imageFiles}
                    setImageFiles={setImageFiles}
                    disabled={currentStep > 3}
                  />
                  {currentStep === 3 && (
                    <button
                      onClick={handleOpenUploadConfirm}
                      disabled={isGlobalLoading}
                      className="btn btn-primary text-white w-full rounded-field font-bold"
                    >
                      บันทึกรูปภาพและไปขั้นตอนถัดไป
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

      {/* Modal ยืนยันการอัปโหลดภาพก่อนไปขั้นตอนถัดไป */}
      <ConfirmUploadModal
        isOpen={isConfirmUploadOpen}
        onClose={() => setIsConfirmUploadOpen(false)}
        onConfirm={handleStep3Submit}
        loading={uploadImagesMutation.isPending}
      />

      {/* Summary Modal */}
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