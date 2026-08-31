import EscrowInfoSidebar from '@/components/userseller/EscrowInfoSidebar';
import ImageUploadPreview from '@/components/userseller/ImageUploadPreview';

import ProductBasicForm from '@/components/userseller/ProductBasicForm';

import React, { useState } from 'react';


export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    model: '',
    price: '',
    description: '',
  });
  const [images, setImages] = useState([]);

  const handleSubmit = () => {
    alert('ส่งข้อมูลเรียบร้อยแล้ว');
  };

  const handleSaveDraft = () => {
    alert('บันทึกแบบร่างเรียบร้อยแล้ว');
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8 font-sans text-base-content">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-base-300 pb-4">
          <div>
            <h1 className="text-3xl font-black text-base-content tracking-tight">
              ลงขายสินค้า
            </h1>
            <p className="text-sm text-base-content font-medium mt-1.5 leading-relaxed">
              กรอกข้อมูลสินค้าของคุณให้ครบถ้วน ระบบ{' '}
              <span className="font-bold text-[#f97316] bg-[#f97316]/10 px-2 py-0.5 rounded border border-[#f97316]/30 inline-block">
                Escrow
              </span>{' '}
              ของเราจะดูแลการชำระเงินจนกว่าสินค้าจะผ่านการตรวจสอบคุณภาพจากทีมงาน
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="btn btn-outline border-base-300 hover:bg-base-200 text-base-content px-5 rounded-field text-sm font-bold self-start md:self-auto bg-base-100"
          >
            บันทึกแบบร่าง
          </button>
        </div>

        {/* MAIN LAYOUT GRID (3 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
          
          {/* ฝั่งซ้าย (2 คอลัมน์): Image Upload + Form */}
          <div className="lg:col-span-2 space-y-6 w-full">
            <ImageUploadPreview images={images} setImages={setImages} />
            <ProductBasicForm
              formData={formData}
              setFormData={setFormData}
              onNext={handleSubmit}
            />
          </div>

          {/* ฝั่งขวา (1 คอลัมน์): Escrow Sidebar */}
          <div className="lg:col-span-1 w-full">
            <EscrowInfoSidebar />
          </div>

        </div>

      </div>
    </div>
  );
}