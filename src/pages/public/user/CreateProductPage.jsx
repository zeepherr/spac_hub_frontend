import React, { useState, useRef } from "react";
import axios from "axios";
import { Rocket, CheckCircle2 } from "lucide-react";

// Components
import SellerStepProgress from "@/components/userseller/SellerStepProgress";
import ProductBasicForm from "@/components/userseller/ProductBasicForm";
import ConditionFormSection from "@/components/userseller/ConditionFormSection";
import ImageUploadPreview from "@/components/userseller/ImageUploadPreview";
import AiConditionAnalysisSection from "@/components/userseller/AiConditionAnalysisSection";
import EscrowInfoSidebar from "@/components/userseller/EscrowInfoSidebar";

export default function CreateProductPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [listingId, setListingId] = useState(999); // กำหนด Mock Listing ID ไว้ก่อน
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    categoryId: 1,
    brand: "",
    model: "",
    price: "",
    location: "Bangkok",
    description: "",
  });

  // Mock Questions สำหรับ Step 2 ให้แสดงผลได้ขณะแต่ง UI
  const [questions, setQuestions] = useState([
    { id: 1, text: "สภาพภายนอกมีรอยขีดข่วนหรือไม่?" },
    { id: 2, text: "การใช้งานและฟังก์ชันต่างๆ ปกติหรือไม่?" },
  ]);
  const [answers, setAnswers] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [aiResult, setAiResult] = useState(null);

  // Section Refs
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);

  const scrollToSection = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  // --- SAVE DRAFT BUTTON HANDLER (Dev Bypass) ---
  const handleSaveDraftAnytime = async () => {
    alert("บันทึกแบบร่าง (Draft - Dev Mode) สำเร็จ!");
  };

  // Step 1: Create Draft Listing (Dev Mode Bypass)
  const handleStep1Submit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // --- [DEV MODE BYPASS] ข้ามการยิง API เพื่อแต่ง UI ---
    setListingId((prev) => prev || 999);
    setCurrentStep(2);
    scrollToSection(step2Ref);
  };

  // Step 2: Save Condition Answers (Dev Mode Bypass)
  const handleStep2Submit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // --- [DEV MODE BYPASS] ข้ามการยิง API เพื่อแต่ง UI ---
    setCurrentStep(3);
    scrollToSection(step3Ref);
  };

  // Step 3: Upload Images (Dev Mode Bypass)
  const handleStep3Submit = async () => {
    // --- [DEV MODE BYPASS] ข้ามการยิง API เพื่อแต่ง UI ---
    setCurrentStep(4);
    scrollToSection(step4Ref);
  };

  // Step 4: Run AI Analysis (Dev Mode Bypass)
  const handleStep4Analyze = async () => {
    // Mock ผลลัพธ์ AI สำหรับแต่ง UI Step 4/5
    setAiResult({
      grade: "A",
      score: 92,
      summary: "สินค้าอยู่ในสภาพดีเยี่ยม รอยขีดข่วนน้อยมาก ฟังก์ชันทำงานครบถ้วน",
    });
    setCurrentStep(5);
    scrollToSection(step5Ref);
  };

  // Step 5: Publish (Dev Mode Bypass)
  const handleStep5Publish = async () => {
    alert("ลงขายสินค้าสำเร็จ! (Dev Mode)");
    window.location.href = "/user/sell";
  };

  return (
    <div className="w-full min-h-screen bg-base-100 text-base-content pb-20">
      
      {/* Sticky Top Step Progress & Save Draft */}
      <SellerStepProgress
        currentStep={currentStep}
        onSaveDraft={handleSaveDraftAnytime}
        savingDraft={savingDraft}
        listingId={listingId}
      />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* Main Long Form Sections */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Step 1: Basic Info Form */}
            <ProductBasicForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleStep1Submit}
              currentStep={currentStep}
              loading={loading}
            />

            {/* Step 2: Condition Questions */}
            <ConditionFormSection
              stepRef={step2Ref}
              currentStep={currentStep}
              questions={questions}
              answers={answers}
              setAnswers={setAnswers}
              onSubmit={handleStep2Submit}
              loading={loading}
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
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">3</span>
                  <h2 className="text-xl font-bold text-base-content">อัปโหลดรูปภาพสินค้าจริง</h2>
                </div>
                {currentStep > 3 && <CheckCircle2 className="w-6 h-6 text-success" />}
              </div>

              {currentStep >= 3 && (
                <div className="space-y-4">
                  <ImageUploadPreview imageFiles={imageFiles} setImageFiles={setImageFiles} disabled={currentStep > 3} />
                  {currentStep === 3 && (
                    <button onClick={handleStep3Submit} disabled={loading} className="btn btn-primary text-white w-full rounded-field font-bold">
                      {loading ? <span className="loading loading-spinner" /> : "บันทึกรูปภาพ & ถัดไป"}
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
              loading={loading}
            />

            {/* Step 5: Publish */}
            <section
              ref={step5Ref}
              className={`bg-base-100 p-6 rounded-box border border-base-300 shadow-sm space-y-6 transition-all duration-300 ${
                currentStep < 5 ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <div className="flex items-center gap-3 border-b border-base-300 pb-4">
                <span className="w-8 h-8 rounded-full bg-success text-success-content flex items-center justify-center font-bold text-sm">5</span>
                <h2 className="text-xl font-bold text-base-content">ตรวจสอบและลงขายสินค้า</h2>
              </div>

              {currentStep === 5 && (
                <button
                  onClick={handleStep5Publish}
                  disabled={loading}
                  className="btn btn-success text-white w-full rounded-field font-black text-lg gap-2"
                >
                  {loading ? <span className="loading loading-spinner" /> : <><Rocket className="w-6 h-6" /> ยืนยันและลงขายทันที (Publish)</>}
                </button>
              )}
            </section>

          </div>

          {/* Sticky Sidebar */}
          <div className="xl:col-span-1 sticky top-20">
            <EscrowInfoSidebar />
          </div>

        </div>
      </div>
    </div>
  );
}


// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { Rocket, CheckCircle2 } from "lucide-react";

// // Components

// import SellerStepProgress from "@/components/userseller/SellerStepProgress";
// import ProductBasicForm from "@/components/userseller/ProductBasicForm";
// import ConditionFormSection from "@/components/userseller/ConditionFormSection";
// import ImageUploadPreview from "@/components/userseller/ImageUploadPreview";
// import AiConditionAnalysisSection from "@/components/userseller/AiConditionAnalysisSection";
// import EscrowInfoSidebar from "@/components/userseller/EscrowInfoSidebar";

// export default function CreateProductPage() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [listingId, setListingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [savingDraft, setSavingDraft] = useState(false);

//   // Form States
//   const [formData, setFormData] = useState({
//     title: "",
//     categoryId: 1,
//     brand: "",
//     model: "",
//     price: "",
//     location: "Bangkok",
//     description: "",
//   });
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [imageFiles, setImageFiles] = useState([]);
//   const [aiResult, setAiResult] = useState(null);

//   // Section Refs
//   const step2Ref = useRef(null);
//   const step3Ref = useRef(null);
//   const step4Ref = useRef(null);
//   const step5Ref = useRef(null);

//   const scrollToSection = (ref) => {
//     setTimeout(() => {
//       ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 150);
//   };

//   // --- SAVE DRAFT BUTTON HANDLER ---
//   const handleSaveDraftAnytime = async () => {
//     if (!listingId) return;
//     try {
//       setSavingDraft(true);
//       await axios.patch(`/api/listings/${listingId}`, {
//         title: formData.title,
//         price: Number(formData.price) || 0,
//         description: formData.description,
//         brand: formData.brand,
//         model: formData.model,
//         location: formData.location,
//       });
//       alert("บันทึกแบบร่าง (Draft) สำเร็จ!");
//     } catch (err) {
//       alert("ไม่สามารถบันทึกแบบร่างได้");
//     } finally {
//       setSavingDraft(false);
//     }
//   };

//   // Step 1: Create Draft Listing
//   const handleStep1Submit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const payload = {
//         categoryId: Number(formData.categoryId),
//         title: formData.title,
//         description: formData.description,
//         brand: formData.brand,
//         model: formData.model,
//         price: Number(formData.price),
//         location: formData.location,
//       };

//       const res = await axios.post("/api/listings", payload);
//       if (res.data.success) {
//         const id = res.data.data.id;
//         setListingId(id);

//         const qRes = await axios.get(`/api/listings/${id}/condition-questions`);
//         if (qRes.data.success) setQuestions(qRes.data.data);

//         setCurrentStep(2);
//         scrollToSection(step2Ref);
//       }
//     } catch (err) {
//       alert("เกิดข้อผิดพลาดในการสร้างแบบร่าง");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 2: Save Condition Answers
//   const handleStep2Submit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const formattedAnswers = Object.keys(answers).map((qId) => ({
//         questionId: Number(qId),
//         answerValue: answers[qId],
//       }));

//       const res = await axios.patch(`/api/listings/${listingId}/condition-answers`, {
//         answers: formattedAnswers,
//       });

//       if (res.data.success) {
//         setCurrentStep(3);
//         scrollToSection(step3Ref);
//       }
//     } catch (err) {
//       alert("กรุณาตอบคำถามที่จำเป็นให้ครบถ้วน");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 3: Upload Images
//   const handleStep3Submit = async () => {
//     if (imageFiles.length === 0) return alert("อัปโหลดรูปภาพอย่างน้อย 1 รูป");
//     try {
//       setLoading(true);
//       const data = new FormData();
//       imageFiles.forEach((file) => data.append("images", file));

//       const res = await axios.post(`/api/listings/${listingId}/images`, data);
//       if (res.data.success) {
//         setCurrentStep(4);
//         scrollToSection(step4Ref);
//       }
//     } catch (err) {
//       alert("อัปโหลดรูปภาพไม่สำเร็จ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 4: Run AI Analysis
//   const handleStep4Analyze = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.post(`/api/listings/${listingId}/analyze-condition`);
//       if (res.data.success) {
//         setAiResult(res.data.data.analysis);
//         setCurrentStep(5);
//         scrollToSection(step5Ref);
//       }
//     } catch (err) {
//       alert("วิเคราะห์สภาพสินค้าไม่สำเร็จ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 5: Publish
//   const handleStep5Publish = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.post(`/api/listings/${listingId}/publish`);
//       if (res.data.success) {
//         alert("ลงขายสินค้าสำเร็จ!");
//         window.location.href = "/user/sell";
//       }
//     } catch (err) {
//       alert("ลงขายสินค้าไม่สำเร็จ โปรดตรวจสอบข้อมูล");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-base-100 text-base-content pb-20">
      
//       {/* Sticky Top Step Progress & Save Draft */}
//       <SellerStepProgress
//         currentStep={currentStep}
//         onSaveDraft={handleSaveDraftAnytime}
//         savingDraft={savingDraft}
//         listingId={listingId}
//       />

//       <div className="max-w-7xl mx-auto px-4">
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
//           {/* Main Long Form Sections */}
//           <div className="xl:col-span-2 space-y-8">
            
//             {/* Step 1: Basic Info Form */}
//             <ProductBasicForm
//               formData={formData}
//               setFormData={setFormData}
//               onSubmit={handleStep1Submit}
//               currentStep={currentStep}
//               loading={loading}
//             />

//             {/* Step 2: Condition Questions */}
//             <ConditionFormSection
//               stepRef={step2Ref}
//               currentStep={currentStep}
//               questions={questions}
//               answers={answers}
//               setAnswers={setAnswers}
//               onSubmit={handleStep2Submit}
//               loading={loading}
//             />

//             {/* Step 3: Images Upload */}
//             <section
//               ref={step3Ref}
//               className={`bg-base-100 p-6 rounded-box border border-base-300 shadow-sm space-y-6 transition-all duration-300 ${
//                 currentStep < 3 ? "opacity-40 pointer-events-none" : ""
//               }`}
//             >
//               <div className="flex items-center justify-between border-b border-base-300 pb-4">
//                 <div className="flex items-center gap-3">
//                   <span className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">3</span>
//                   <h2 className="text-xl font-bold text-base-content">อัปโหลดรูปภาพสินค้าจริง</h2>
//                 </div>
//                 {currentStep > 3 && <CheckCircle2 className="w-6 h-6 text-success" />}
//               </div>

//               {currentStep >= 3 && (
//                 <div className="space-y-4">
//                   <ImageUploadPreview imageFiles={imageFiles} setImageFiles={setImageFiles} disabled={currentStep > 3} />
//                   {currentStep === 3 && (
//                     <button onClick={handleStep3Submit} disabled={loading} className="btn btn-primary text-white w-full rounded-field font-bold">
//                       {loading ? <span className="loading loading-spinner" /> : "บันทึกรูปภาพ & ถัดไป"}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </section>

//             {/* Step 4: AI Analysis */}
//             <AiConditionAnalysisSection
//               stepRef={step4Ref}
//               currentStep={currentStep}
//               onAnalyze={handleStep4Analyze}
//               aiResult={aiResult}
//               loading={loading}
//             />

//             {/* Step 5: Publish */}
//             <section
//               ref={step5Ref}
//               className={`bg-base-100 p-6 rounded-box border border-base-300 shadow-sm space-y-6 transition-all duration-300 ${
//                 currentStep < 5 ? "opacity-40 pointer-events-none" : ""
//               }`}
//             >
//               <div className="flex items-center gap-3 border-b border-base-300 pb-4">
//                 <span className="w-8 h-8 rounded-full bg-success text-success-content flex items-center justify-center font-bold text-sm">5</span>
//                 <h2 className="text-xl font-bold text-base-content">ตรวจสอบและลงขายสินค้า</h2>
//               </div>

//               {currentStep === 5 && (
//                 <button
//                   onClick={handleStep5Publish}
//                   disabled={loading}
//                   className="btn btn-success text-white w-full rounded-field font-black text-lg gap-2"
//                 >
//                   {loading ? <span className="loading loading-spinner" /> : <><Rocket className="w-6 h-6" /> ยืนยันและลงขายทันที (Publish)</>}
//                 </button>
//               )}
//             </section>

//           </div>

//           {/* Sticky Sidebar */}
//           <div className="xl:col-span-1 sticky top-20">
//             <EscrowInfoSidebar />
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }