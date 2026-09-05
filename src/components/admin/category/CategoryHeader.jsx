function CategoryHeader({ onAdd }) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Category</h1>

        <div className="mt-1 text-sm text-gray-500">
          <p>            Create and manage product categories used across all listings in the marketplace
          </p>
        </div>
      </div>

      <button
        onClick={onAdd}
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#FF6B1A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#E85D0F]"
      >
        Add Category
      </button>
    </div>
  );
}

export default CategoryHeader;
