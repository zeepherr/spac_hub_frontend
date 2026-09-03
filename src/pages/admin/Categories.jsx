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

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusCategory, setStatusCategory] = useState(null);

  // GET
  const { data: categoriesResponse, isPending: isLoading } = useCategories({
    includeInactive: true,
  });

  // CREATE
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();

  // UPDATE
  const { mutate: updateCategoryStatus, isPending: isUpdatingStatus } =
    useUpdateCategory();

  const categories = categoriesResponse || [];

  const stats = useMemo(() => {
    return {
      total: categories.length,
      active: categories.filter((category) => category.isActive).length,
      disabled: categories.filter((category) => !category.isActive).length,
    };
  }, [categories]);

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
  // console.log(filteredCategories);

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

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedCategory(null);
  };

  const handleStatusChange = (category) => {
    setStatusCategory(category);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatus = () => {
    setIsStatusModalOpen(false);
    setStatusCategory(null);
  };

  return (
    <div className="mx-auto max-w-300 px-4 py-6 h-full">
      <CategoryHeader onAdd={() => setIsAddOpen(true)} />

      <CategoryStats stats={stats} />

      <CategoryFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      <CategoryTable
        categories={filteredCategories}
        isLoading={isLoading}
        isUpdatingStatus={isUpdatingStatus}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
      />

      <AddCategoryModal
        isOpen={isAddOpen}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        onSubmit={handleAddCategory}
        onClose={handleCloseAdd}
        isCreating={isCreating}
      />

      <CategoryStatusModal
        isOpen={isStatusModalOpen}
        category={statusCategory}
        updateCategoryStatus={updateCategoryStatus}
        isUpdatingStatus={isUpdatingStatus}
        onClose={handleCloseStatus}
      />

      <EditCategoryModal
        isOpen={isEditOpen}
        category={selectedCategory}
        onClose={handleCloseEdit}
      />
    </div>
  );
}

export default Categories;
