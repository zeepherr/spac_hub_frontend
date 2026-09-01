import React, { useState, useRef } from "react";
import { Rocket, CheckCircle2 } from "lucide-react";


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
    location: "Bangkok",
    description: "",
  });

  const [answers, setAnswers] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [aiResult, setAiResult] = useState(null);

  // --- React Query Mutations & Queries ---
  const identifyProductMutation = useIdentifyProduct();
  const createListingMutation = useCreateListing();
  const updateListingMutation = useUpdateListing();
  const saveAnswersMutation = useSaveListingConditionAnswers();
  const uploadImagesMutation = useUploadListingImages();
  const analyzeConditionMutation = useAnalyzeListingCondition();
  const publishListingMutation = usePublishListing();

  // ดึงคำถามสภาพสินค้าอัตโนมัติเมื่อได้ listingId
  const {
    data: questionsData,
    isPending: isQuestionsLoading,
  } = useListingConditionQuestions(listingId);

  // แปลงโครงสร้าง questions จาก React Query ให้พร้อมใช้
  const questions = Array.isArray(questionsData)
    ? questionsData
    : questionsData?.data || [];

  // สถานะ Loading รวมสำหรับปุ่มกด
  const isGlobalLoading =
    identifyProductMutation.isPending ||
    createListingMutation.isPending ||
    updateListingMutation.isPending ||
    saveAnswersMutation.isPending ||
    uploadImagesMutation.isPending ||
    analyzeConditionMutation.isPending ||
    publishListingMutation.isPending;

  // Section Refs สำหรับ Smooth Scroll
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);

  const scrollToSection = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
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
        console.error("AI Autofill Error:", err.response?.data || err);
      },
    });
  };

  // --- SAVE DRAFT BUTTON HANDLER ---
  const handleSaveDraftAnytime = () => {
    if (!listingId) {
      alert("กรุณากรอกข้อมูลเบื้องต้นและกดถัดไปอย่างน้อย 1 ครั้ง เพื่อสร้างแบบร่างก่อนครับ");
      return;
    }

    const payload = {
      title: formData.title,
      price: Number(formData.price) || 0,
      categoryId: Number(formData.categoryId),
      description: formData.description || undefined,
      brand: formData.brand || undefined,
      model: formData.model || undefined,
      location: formData.location || undefined,
    };

    updateListingMutation.mutate({ listingId, payload });
  };

  // --- STEP 1: CREATE OR UPDATE DRAFT LISTING ---
  const handleStep1Submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const parsedCategoryId = Number(formData.categoryId);
    const parsedPrice = Number(formData.price);

    if (!formData.title?.trim()) {
      alert("กรุณากรอกชื่อสินค้า");
      return;
    }
    if (!formData.categoryId || isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
      alert("กรุณาเลือกหมวดหมู่สินค้าให้ถูกต้อง");
      return;
    }
    if (!formData.price || isNaN(parsedPrice) || parsedPrice <= 0) {
      alert("กรุณากรอกราคาให้ถูกต้อง (ต้องเป็นตัวเลขมากกว่า 0)");
      return;
    }

    const payload = {
      categoryId: parsedCategoryId,
      title: formData.title.trim(),
      price: parsedPrice,
    };

    if (formData.description?.trim()) payload.description = formData.description.trim();
    if (formData.brand?.trim()) payload.brand = formData.brand.trim();
    if (formData.model?.trim()) payload.model = formData.model.trim();
    if (formData.location?.trim()) payload.location = formData.location.trim();

    if (!listingId) {
      // สร้าง Draft ครั้งแรก
      createListingMutation.mutate(payload, {
        onSuccess: (res) => {
          const newId = res?.data?.id || res?.id;
          setListingId(newId);
          setCurrentStep(2);
          scrollToSection(step2Ref);
        },
        onError: (err) => {
          console.error("Create Listing Error:", err.response?.data || err);
        },
      });
    } else {
      // อัปเดต Draft เดิม
      updateListingMutation.mutate(
        { listingId, payload },
        {
          onSuccess: () => {
            setCurrentStep(2);
            scrollToSection(step2Ref);
          },
          onError: (err) => {
            console.error("Update Listing Error:", err.response?.data || err);
          },
        }
      );
    }
  };

  // --- STEP 2: SAVE CONDITION ANSWERS ---
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
        onError: (err) => {
          console.error("Save Condition Answers Error:", err.response?.data || err);
        },
      }
    );
  };

  // --- STEP 3: UPLOAD IMAGES ---
  const handleStep3Submit = () => {
    if (imageFiles.length === 0) {
      return alert("กรุณาอัปโหลดรูปภาพสินค้าอย่างน้อย 1 รูป");
    }

    uploadImagesMutation.mutate(
      { listingId, images: imageFiles },
      {
        onSuccess: () => {
          setCurrentStep(4);
          scrollToSection(step4Ref);
        },
        onError: (err) => {
          console.error("Upload Images Error:", err.response?.data || err);
        },
      }
    );
  };

  // --- STEP 4: RUN AI ANALYSIS ---
  const handleStep4Analyze = () => {
    analyzeConditionMutation.mutate(listingId, {
      onSuccess: (res) => {
        const analysisData = res?.data?.analysis || res?.analysis || res?.data;
        setAiResult(analysisData);
        setCurrentStep(5);
        scrollToSection(step5Ref);
      },
      onError: (err) => {
        console.error("AI Analysis Error:", err.response?.data || err);
      },
    });
  };

  // --- STEP 5: PUBLISH LISTING ---
  const handleStep5Publish = () => {
    publishListingMutation.mutate(listingId, {
      onSuccess: () => {
        window.location.href = "/user/sell";
      },
      onError: (err) => {
        console.error("Publish Listing Error:", err.response?.data || err);
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-base-100 text-base-content pb-20">
      {/* Sticky Top Step Progress & Save Draft */}
      <SellerStepProgress
        currentStep={currentStep}
        onSaveDraft={handleSaveDraftAnytime}
        savingDraft={updateListingMutation.isPending}
        listingId={listingId}
      />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* Main Form Sections */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Step 1: Basic Info Form */}
            <ProductBasicForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleStep1Submit}
              loading={isGlobalLoading}
              onAiAutofill={handleAiAutofill}
            />

            {/* Step 2: Condition Questions */}
            <ConditionFormSection
              stepRef={step2Ref}
              currentStep={currentStep}
              questions={questions}
              answers={answers}
              setAnswers={setAnswers}
              onSubmit={handleStep2Submit}
              loading={isGlobalLoading || isQuestionsLoading}
            />

            {/* Step 3: Images Upload */}
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
                {currentStep > 3 && <CheckCircle2 className="w-6 h-6 text-success" />}
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

            {/* Step 4: AI Analysis */}
            <AiConditionAnalysisSection
              stepRef={step4Ref}
              currentStep={currentStep}
              onAnalyze={handleStep4Analyze}
              aiResult={aiResult}
              loading={isGlobalLoading}
            />

            {/* Step 5: Publish */}
            <section
              ref={step5Ref}
              className={`bg-base-100 p-6 rounded-box border border-base-300 shadow-sm space-y-6 transition-all duration-300 ${
                currentStep < 5 ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <div className="flex items-center gap-3 border-b border-base-300 pb-4">
                <span className="w-8 h-8 rounded-full bg-success text-success-content flex items-center justify-center font-bold text-sm">
                  5
                </span>
                <h2 className="text-xl font-bold text-base-content">
                  ตรวจสอบและลงขายสินค้า
                </h2>
              </div>

              {currentStep === 5 && (
                <button
                  onClick={handleStep5Publish}
                  disabled={isGlobalLoading}
                  className="btn btn-success text-white w-full rounded-field font-black text-lg gap-2"
                >
                  {publishListingMutation.isPending ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    <>
                      <Rocket className="w-6 h-6" /> ยืนยันและลงขายทันที (Publish)
                    </>
                  )}
                </button>
              )}
            </section>

          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 sticky top-20">
            <EscrowInfoSidebar />
          </div>

        </div>
      </div>
    </div>
  );
}