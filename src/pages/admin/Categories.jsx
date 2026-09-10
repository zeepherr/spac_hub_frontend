import { useMemo, useState } from "react";

import { useCategories } from "@/hook/category/useCategory";
import { useCreateCategory } from "@/hook/category/useCreateCategory";
import { useUpdateCategory } from "@/hook/category/useUpdateCategory";

import CategoryFilters from "@/components/admin/category/CategoryFilters";
import CategoryHeader from "@/components/admin/category/CategoryHeader";
import CategoryStats from "@/components/admin/category/CategoryStats";
import CategoryTable from "@/components/admin/category/CategoryTable";

import AddCategoryModal from "@/components/admin/category/AddCategoryModal";
import CategoryStatusModal from "@/components/admin/category/CategoryStatusModal";
import EditCategoryModal from "@/components/admin/category/EditCategoryModal";

function Categories() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isStatusModalOpen, setIsStatusModalOpen] =
    useState(false);

  const [statusCategory, setStatusCategory] =
    useState(null);

  /*
   * ================================
   * GET CATEGORIES
   * ================================
   */
  const {
    data: categoriesResponse,
    isPending: isLoading,
  } = useCategories({
    includeInactive: true,
  });

  /*
   * ================================
   * CREATE CATEGORY
   * ================================
   */
  const {
    mutate: createCategory,
    isPending: isCreating,
  } = useCreateCategory();

  /*
   * ================================
   * UPDATE CATEGORY
   * ================================
   */
  const {
    mutate: updateCategoryStatus,
    isPending: isUpdatingStatus,
  } = useUpdateCategory();

  const categories = categoriesResponse || [];

  /*
   * ================================
   * STATS
   * ================================
   */
  const stats = useMemo(() => {
    return {
      total: categories.length,

      active: categories.filter(
        (category) => category.isActive,
      ).length,

      disabled: categories.filter(
        (category) => !category.isActive,
      ).length,
    };
  }, [categories]);

  /*
   * ================================
   * FILTER
   * ================================
   */
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchSearch = category.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        status === "all" ||
        (status === "active" && category.isActive) ||
        (status === "disabled" && !category.isActive);

      return matchSearch && matchStatus;
    });
  }, [categories, search, status]);

  /*
   * ================================
   * ADD CATEGORY
   * ================================
   */
  const handleAddCategory = (event) => {
    event.preventDefault();

    createCategory(
      {
        name: categoryName,
      },
      {
        onSuccess: () => {
          setCategoryName("");
          setIsAddOpen(false);
        },
      },
    );
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    setCategoryName("");
  };

  /*
   * ================================
   * EDIT CATEGORY
   * ================================
   */
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedCategory(null);
  };

  /*
   * ================================
   * STATUS CATEGORY
   * ================================
   */
  const handleStatusChange = (category) => {
    setStatusCategory(category);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatus = () => {
    setIsStatusModalOpen(false);
    setStatusCategory(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* HEADER */}
        <CategoryHeader
          onAdd={() => setIsAddOpen(true)}
        />

        {/* STATS */}
        <CategoryStats stats={stats} />

        {/* FILTER */}
        <CategoryFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />

        {/* TABLE */}
        <CategoryTable
          categories={filteredCategories}
          isLoading={isLoading}
          isUpdatingStatus={isUpdatingStatus}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />

        {/* ADD CATEGORY */}
        <AddCategoryModal
          isOpen={isAddOpen}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          onSubmit={handleAddCategory}
          onClose={handleCloseAdd}
          isCreating={isCreating}
        />

        {/* STATUS CATEGORY */}
        <CategoryStatusModal
          isOpen={isStatusModalOpen}
          category={statusCategory}
          updateCategoryStatus={updateCategoryStatus}
          isUpdatingStatus={isUpdatingStatus}
          onClose={handleCloseStatus}
        />

        {/* EDIT CATEGORY */}
        <EditCategoryModal
          isOpen={isEditOpen}
          category={selectedCategory}
          onClose={handleCloseEdit}
        />
      </div>
    </div>
  );
}

export default Categories;