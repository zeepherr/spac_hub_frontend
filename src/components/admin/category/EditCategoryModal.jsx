import { useEffect, useState } from "react";
import { useUpdateCategory } from "@/hook/category/useUpdateCategory";

function EditCategoryModal({
  isOpen,
  onClose,
  category,
}) {
  const [categoryName, setCategoryName] = useState("");
  console.log(category)

  const {
    mutate: updateCategory,
    isPending: isUpdating,
  } = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  if (!isOpen || !category) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = categoryName.trim();

    // validate ให้ตรง backend
    if (name.length < 2 || name.length > 50) {
      return;
    }

    // ถ้าชื่อเดิม ไม่ต้องยิง API
    if (name === category.name) {
      onClose();
      return;
    }

    updateCategory(
      {
        id: category.id,
        payload: {
          name,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setCategoryName(category.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Category
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update the category name.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name
            </label>

            <input
              type="text"
              value={categoryName}
              onChange={(event) =>
                setCategoryName(event.target.value)
              }
              placeholder="e.g. Monitor"
              maxLength={50}
              autoFocus
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#FF6B1A]"
            />

            <p className="mt-1 text-xs text-gray-400">
              2–50 characters
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUpdating}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isUpdating ||
                categoryName.trim().length < 2 ||
                categoryName.trim().length > 50
              }
              className="cursor-pointer rounded-lg bg-[#FF6B1A] px-4 py-2 text-sm font-medium text-white hover:bg-[#E85D0F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating
                ? "Updating..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCategoryModal;