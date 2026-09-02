function CategoryStatusModal({
  isOpen,
  category,
  updateCategoryStatus,
  isUpdatingStatus,
  onClose,
}) {
  if (!isOpen || !category) return null;

  const handleConfirm = () => {
    updateCategoryStatus(
      {
        id: category.id,
        payload: {
          isActive: !category.isActive,
        },
      },
      {
        onSuccess: onClose,
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            {category.isActive ? "Disable Category" : "Enable Category"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Are you sure you want to{" "}
            {category.isActive ? "disable" : "enable"}{" "}
            <span className="font-medium text-gray-800">
              {category.name}
            </span>
            ?
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdatingStatus}
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            No
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isUpdatingStatus}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
              category.isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isUpdatingStatus
              ? "Updating..."
              : category.isActive
                ? "Yes, Disable"
                : "Yes, Enable"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryStatusModal;