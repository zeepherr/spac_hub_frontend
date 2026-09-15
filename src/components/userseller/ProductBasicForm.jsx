import { useCategories } from "@/hook/category/useCategory";
import { createListingSchema } from "@/validations/listing.schema";
import { useEffect, useState } from "react";
import CategorySelectModal from "./CategorySelectModal";
import ProvinceSelectModal from "./ProvinceSelectModal";
import ProductAiAutofillSection from "./product-basic-form/ProductAiAutofillSection";
import ProductDescriptionField from "./product-basic-form/ProductDescriptionField";
import ProductFormSubmitButton from "./product-basic-form/ProductFormSubmitButton";
import ProductInformationFields from "./product-basic-form/ProductInformationFields";
import ProductLocationField from "./product-basic-form/ProductLocationField";
import ProductPriceField from "./product-basic-form/ProductPriceField";
import { GLASS_PANEL } from "./product-basic-form/productBasicForm.constants";
import { typeEffect } from "./product-basic-form/productBasicForm.utils";

export default function ProductBasicForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  onAiAutofill,
  showToast,
}) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [aiImagePreview, setAiImagePreview] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAiSuccess, setIsAiSuccess] = useState(false);
  const [marketPrice, setMarketPrice] = useState(null);
  const [errors, setErrors] = useState({});

  const { data: categoriesData } = useCategories({ includeInactive: false });

  useEffect(() => {
    if (formData.categoryId) {
      const list = Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData?.data || [];
      const found = list.find(
        (c) => String(c.id) === String(formData.categoryId),
      );
      if (found) {
        setSelectedCategoryName(found.name || found.title || "");
      }
    } else {
      setSelectedCategoryName("");
    }
  }, [formData.categoryId, categoriesData]);

  const notify = (msg, type = "error") => {
    if (showToast) showToast(msg, type);
    else console.warn(`[Toast ${type}]: ${msg}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      if (value !== "" && Number(value) > 999999999) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategoryName(category.name);
    setFormData((prev) => ({ ...prev, categoryId: Number(category.id) }));
    if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: null }));
  };

  const handleSelectProvince = (provinceName) => {
    setFormData((prev) => ({ ...prev, location: provinceName }));
    if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setAiImagePreview(URL.createObjectURL(file));
    setIsAiSuccess(false);
    setMarketPrice(null);
  };

  const handleConfirmAiAutofill = async () => {
    if (!selectedFile || !onAiAutofill) return;
    try {
      setIsAiLoading(true);
      setIsAiSuccess(false);
      setMarketPrice(null);

      const aiResult = await onAiAutofill(selectedFile);
      const data = aiResult?.data || aiResult || {};

      setIsAiLoading(false);
      setIsTyping(true);

      setFormData((prev) => ({
        ...prev,
        title: "",
        brand: "",
        model: "",
        description: "",
      }));

      if (data.title) {
        await typeEffect(
          data.title,
          (val) => setFormData((prev) => ({ ...prev, title: val })),
          20,
        );
      }
      if (data.brand) {
        await typeEffect(
          data.brand,
          (val) => setFormData((prev) => ({ ...prev, brand: val })),
          25,
        );
      }
      if (data.model) {
        await typeEffect(
          data.model,
          (val) => setFormData((prev) => ({ ...prev, model: val })),
          25,
        );
      }

      if (data.description) {
        await typeEffect(
          data.description,
          (val) => setFormData((prev) => ({ ...prev, description: val })),
          10,
        );
      }
      setMarketPrice(data.marketPrice ?? null);
      setIsAiSuccess(true);
    } catch (error) {
      console.error("AI Autofill Failed:", error);
      notify("Failed to extract data from image. Please try again.", "error");
    } finally {
      setIsAiLoading(false);
      setIsTyping(false);
    }
  };

  const handleClearAiImage = () => {
    setSelectedFile(null);
    setAiImagePreview(null);
    setIsAiSuccess(false);
    setMarketPrice(null);
  };

  const handleFormSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const result = createListingSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (!formattedErrors[fieldName]) {
          formattedErrors[fieldName] = issue.message;
        }
      });
      setErrors(formattedErrors);
      notify("Please fill in all required fields correctly", "warning");
      return;
    }

    setErrors({});
    if (onSubmit) onSubmit(e);
  };

  const isFormDisabled = isAiLoading || isTyping || loading;

  return (
    <>
      <div className={`p-6 rounded-3xl space-y-6 ${GLASS_PANEL}`}>
        <div className="border-b border-neutral-200/70 pb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
            Basic Information
          </h3>
        </div>

        <ProductAiAutofillSection
          aiImagePreview={aiImagePreview}
          handleFileSelect={handleFileSelect}
          handleClearAiImage={handleClearAiImage}
          handleConfirmAiAutofill={handleConfirmAiAutofill}
          isFormDisabled={isFormDisabled}
          isAiLoading={isAiLoading}
          isTyping={isTyping}
          isAiSuccess={isAiSuccess}
        />

        <ProductInformationFields
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isFormDisabled={isFormDisabled}
          isAiLoading={isAiLoading}
          isTyping={isTyping}
          selectedCategoryName={selectedCategoryName}
          setIsCategoryModalOpen={setIsCategoryModalOpen}
        >
          <ProductPriceField
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            isFormDisabled={isFormDisabled}
            isAiLoading={isAiLoading}
            isTyping={isTyping}
            marketPrice={marketPrice}
            isAiSuccess={isAiSuccess}
          />
        </ProductInformationFields>

        <ProductLocationField
          formData={formData}
          errors={errors}
          isFormDisabled={isFormDisabled}
          setIsProvinceModalOpen={setIsProvinceModalOpen}
        />

        <ProductDescriptionField
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isFormDisabled={isFormDisabled}
          isAiLoading={isAiLoading}
          isTyping={isTyping}
        />

        <ProductFormSubmitButton
          handleFormSubmit={handleFormSubmit}
          isFormDisabled={isFormDisabled}
          loading={loading}
          isAiLoading={isAiLoading}
          isTyping={isTyping}
        />
      </div>

      <CategorySelectModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedCategoryId={formData.categoryId}
        onSelectCategory={handleSelectCategory}
      />

      <ProvinceSelectModal
        isOpen={isProvinceModalOpen}
        onClose={() => setIsProvinceModalOpen(false)}
        selectedProvince={formData.location}
        onSelectProvince={handleSelectProvince}
      />
    </>
  );
}
