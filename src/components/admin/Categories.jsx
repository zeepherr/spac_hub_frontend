import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hook/category/useCategory";
import { useCreateCategory } from "@/hook/category/useCreateCategory";
import EditCategoryModal from "./EditCategoryModal";

function Categories() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // GET categories
  const { data: categoriesResponse, isPending: isLoading } = useCategories();

  // CREATE category
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();

  const categories = categoriesResponse || [];

  // CREATE CATEGORY
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

  // STATS
  const stats = useMemo(() => {
    const total = categories.length;

    const active = categories.filter((category) => category.isActive).length;

    const disabled = categories.filter((category) => !category.isActive).length;

    return {
      total,
      active,
      disabled,
    };
  }, [categories]);

  // SEARCH + STATUS FILTER
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

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Categories</h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and control the product taxonomy used by every marketplace
            listing.
          </p>
        </div>

        {/* OPEN MODAL */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#FF6B1A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#E85D0F]"
        >
          Add Category
        </button>
      </div>

      {/* STATS */}
      <div className="mb-5 grid max-w-[650px] grid-cols-3 gap-4">
        <StatCard number={stats.total} title="Total categories" />

        <StatCard number={stats.active} title="Active" />

        <StatCard number={stats.disabled} title="Disabled" />
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-3 flex justify-between">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-[320px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B1A]"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B1A]"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr className="text-xs text-gray-500">
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Questions</th>
              <th className="px-4 py-4">Created</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-gray-100 last:border-none"
                >
                  {/* NAME */}
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {category.name}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4">
                    <StatusBadge isActive={category.isActive} />
                  </td>

                  {/* QUESTIONS */}
                  <td className="px-4 py-4 text-gray-500">
                    {category._count.conditionQuestions} questions
                  </td>

                  {/* CREATED */}
                  <td className="px-4 py-4 text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 text-xs font-medium">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsEditOpen(true);
                        }}
                        className="cursor-pointer text-[#FF6B1A] hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        className={`cursor-pointer hover:underline ${
                          category.isActive ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {category.isActive ? "Disable" : "Enable"}
                      </button>

                      <button className="flex cursor-pointer items-center gap-1 text-[#FF6B1A] hover:underline">
                        Manage Questions
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ADD CATEGORY MODAL ================= */}

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            {/* Modal Header */}
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">Add Category</h2>

              <p className="mt-1 text-sm text-gray-500">
                Create a new product category.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleAddCategory}>
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

                {/* <p className="mt-1 text-xs text-gray-400">
                  2–50 characters
                </p> */}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setCategoryName("");
                  }}
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
      )}

      {/* EDIT CATEGORY MODAL */}
      <EditCategoryModal
        isOpen={isEditOpen}
        category={selectedCategory}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedCategory(null);
        }}
      />
    </div>
  );
}

function StatCard({ number, title }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-2xl font-bold text-gray-900">{number}</p>

      <p className="mt-1 text-xs text-gray-500">{title}</p>
    </div>
  );
}

function StatusBadge({ isActive }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
      }`}
    >
      {isActive ? "Active" : "Disabled"}
    </span>
  );
}

export default Categories;
