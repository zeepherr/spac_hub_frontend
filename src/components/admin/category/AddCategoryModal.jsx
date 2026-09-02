function AddCategoryModal({
  isOpen,
  categoryName,
  setCategoryName,
  onSubmit,
  onClose,
  isCreating,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Add Category
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a new product category.
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name
            </label>

            <input
              type="text"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="e.g. Monitor"
              maxLength={50}
              autoFocus
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#FF6B1A]"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating}
              className="cursor-pointer rounded-lg bg-[#FF6B1A] px-4 py-2 text-sm font-medium text-white hover:bg-[#E85D0F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategoryModal;