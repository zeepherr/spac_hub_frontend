import { ListTree, Plus } from "lucide-react";

function CategoryHeader({ onAdd }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
          <ListTree
            size={22}
            className="text-orange-500"
          />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            Categories
          </h1>

          <p className="mt-1 text-xs text-neutral-500">
            Create and manage product categories used across all listings in
            the marketplace.
          </p>
        </div>
      </div>

      {/* ADD BUTTON */}
      <button
        type="button"
        onClick={onAdd}
        className="
          inline-flex cursor-pointer items-center gap-2
          rounded-xl
          bg-orange-500
          px-4 py-2.5
          text-sm font-medium text-white
          shadow-sm
          transition
          hover:bg-orange-600
          focus:outline-none
          focus:ring-2
          focus:ring-orange-300
        "
      >
        <Plus size={17} />

        Add Category
      </button>
    </div>
  );
}

export default CategoryHeader;