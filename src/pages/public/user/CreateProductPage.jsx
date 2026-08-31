import EscrowInfoSidebar from '@/components/userseller/EscrowInfoSidebar';
import ImageUploadPreview from '@/components/userseller/ImageUploadPreview';
import ProductBasicForm from '@/components/userseller/ProductBasicForm';
import SellerStepProgress from '@/components/userseller/SellerStepProgress';
import React, { useState } from 'react';
//  แก้ไขจาก ../../../ เป็น ../../ (ถอยแค่ 2 ชั้น)

export default function CreateProductPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    model: '',
    price: '',
    description: '',
  });
  const [images, setImages] = useState([]);

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handleSaveDraft = () => {
    alert('บันทึกแบบร่างเรียบร้อยแล้ว');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 lg:p-8 font-sans text-[#171717]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#171717] tracking-tight">
              ลงขายสินค้า
            </h1>
            <p className="text-sm text-[#525252] mt-1">
              กรอกข้อมูลสินค้าของคุณให้ครบถ้วน ระบบ <span className="font-bold text-[#f97316]">Escrow</span> ของเราจะดูแลการชำระเงินจนกว่าสินค้าจะผ่านการตรวจสอบคุณภาพจากทีมงาน
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="btn btn-outline border-[#a3a3a3] hover:bg-[#ebebeb] text-[#171717] px-5 rounded-lg text-sm self-start md:self-auto"
          >
            บันทึกแบบร่าง
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <SellerStepProgress currentStep={currentStep} />

        {/* MAIN LAYOUT GRID (Left Form / Right Sidebars) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ฝั่งซ้าย: ฟอร์มกรอกข้อมูล (กว้าง 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <ProductBasicForm
              formData={formData}
              setFormData={setFormData}
              onNext={handleNextStep}
            />
          </div>

          {/* ฝั่งขวา: Escrow Sidebar & Upload Zone (กว้าง 1/3) */}
          <div className="space-y-6">
            {/* Box ขวาบน: คำอธิบายระบบ Escrow */}
            <EscrowInfoSidebar />

            {/* Box ขวาล่าง: โซน Upload & Preview */}
            <ImageUploadPreview images={images} setImages={setImages} />
          </div>

        </div>
      </div>
    </div>
  );
}