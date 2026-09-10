// CreateProductPage.jsx
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import AiConditionAnalysisSection from "@/components/userseller/AiConditionAnalysisSection";
import ConditionFormSection from "@/components/userseller/ConditionFormSection";
import ConfirmUploadModal from "@/components/userseller/ConfirmUploadModal";
import EscrowInfoSidebar from "@/components/userseller/EscrowInfoSidebar";
import ImageUploadPreview from "@/components/userseller/ImageUploadPreview";
import ProductBasicForm from "@/components/userseller/ProductBasicForm";
import ProductSummaryModal from "@/components/userseller/ProductSummaryModal";
import PublishStepSection from "@/components/userseller/PublishStepSection";
import SellerStepProgress from "@/components/userseller/SellerStepProgress";
import { useAnalyzeListingCondition } from "@/hook/listing/useAnalyzeListingCondition";
import { useCreateListing } from "@/hook/listing/useCreateListing";
import { useIdentifyProduct } from "@/hook/listing/useIdentifyProduct";
import { useListingsByCategory } from "@/hook/listing/useListingByCategory";
import { useListingConditionQuestions } from "@/hook/listing/useListingConditionQuestions";
import { usePublishListing } from "@/hook/listing/usePublishListing";
import { useSaveListingConditionAnswers } from "@/hook/listing/useSavListingCondidionAnswer";
import { useUpdateListing } from "@/hook/listing/useUpdateListing";
import { useUploadListingImages } from "@/hook/listing/useUploadListingImages";
import { useNavigate } from "react-router";

// bg หลักมาตรฐานของทั้งเว็บ (เดียวกับที่ตั้งไว้ใน PublicLayout.jsx) - ใช้กับพื้นหลังหลักของหน้าเท่านั้น
// (ไฟล์นี้ที่ส่งมาใช้สีเขียวอมฟ้าอีกรอบ แก้กลับเป็นสีน้ำเงินมาตรฐานตามกฎที่ตกลงกันไว้)
const PAGE_BG =
  "bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(0deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)]";
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-[#f97316] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

export default function CreateProductPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [listingId, setListingId] = useState(null);
  const navitage = useNavigate();
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
  const [isConfirmUploadOpen, setIsConfirmUploadOpen] = useState(false);

  const identifyProductMutation = useIdentifyProduct();
  const createListingMutation = useCreateListing();
  const updateListingMutation = useUpdateListing();
  const saveAnswersMutation = useSaveListingConditionAnswers();
  const uploadImagesMutation = useUploadListingImages();
  const analyzeConditionMutation = useAnalyzeListingCondition();
  const publishListingMutation = usePublishListing();

  const { categories: categoriesData } = useListingsByCategory();
  const categories = useMemo(() => {
    return Array.isArray(categoriesData)
      ? categoriesData
      : categoriesData?.data || [];
  }, [categoriesData]);

  const currentCategoryName = useMemo(() => {
    if (!formData.categoryId) return "";
    const found = categories.find(
      (c) => String(c.id) === String(formData.categoryId),
    );
    return found?.name || found?.title || "";
  }, [formData.categoryId, categories]);

  const { data: questionsData, isPending: isQuestionsLoading } =
    useListingConditionQuestions(listingId);

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
        },
      );
    }
  };

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
      },
    );
  };

  const handleOpenUploadConfirm = () => {
    if (imageFiles.length === 0) {
      toast.error("กรุณาเลือกรูปภาพสินค้าอย่างน้อย 1 รูป");
      return;
    }
    setIsConfirmUploadOpen(true);
  };

  const handleStep3Submit = () => {
    uploadImagesMutation.mutate(
      { listingId, images: imageFiles },
      {
        onSuccess: () => {
          setIsConfirmUploadOpen(false);
          setCurrentStep(4);
          scrollToSection(step4Ref);
        },
      },
    );
  };

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

      navitage("/user/sell", { replace: true });
    } catch (err) {
      console.error("Publish listing error:", err);
    }
  };

  return (
    <div
      className={`relative w-full min-h-screen pb-20 text-neutral-900 ${PAGE_BG}`}
    >
      <SellerStepProgress
        currentStep={currentStep}
        onSaveDraft={handleSaveDraftAnytime}
        savingDraft={updateListingMutation.isPending}
        listingId={listingId}
      />

      <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          <div className="xl:col-span-3 space-y-8">
            <div ref={step1Ref} className="relative">
              <ProductBasicForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleStep1Submit}
                loading={isGlobalLoading}
                onAiAutofill={handleAiAutofill}
              />
            </div>

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

            <section
              ref={step3Ref}
              className={`rounded-2xl p-6 space-y-6 transition-all duration-300 ${GLASS_PANEL} ${
                currentStep < 3 ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <div className="flex items-center justify-between border-b border-neutral-200/70 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <h2 className="text-xl font-bold text-neutral-900">
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
                      className={`w-full rounded-xl py-3 text-sm font-bold transition disabled:opacity-50 ${CTA_GLASS}`}
                    >
                      บันทึกรูปภาพและไปขั้นตอนถัดไป
                    </button>
                  )}
                </div>
              )}
            </section>

            <AiConditionAnalysisSection
              stepRef={step4Ref}
              currentStep={currentStep}
              onAnalyze={handleStep4Analyze}
              aiResult={aiResult}
              loading={isGlobalLoading}
            />

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

      <ConfirmUploadModal
        isOpen={isConfirmUploadOpen}
        onClose={() => setIsConfirmUploadOpen(false)}
        onConfirm={handleStep3Submit}
        loading={uploadImagesMutation.isPending}
      />

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
