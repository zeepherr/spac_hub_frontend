import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { useCategories } from "@/hook/category/useCategory";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

function Categories() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // GET Categories ด้วย TanStack Query
  const { data: categoriesResponse, isPending: isLoading } = useCategories();

  const categories = categoriesResponse || [];

  // Stats
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

  // Search + Filter
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
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Categories</h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and control the product taxonomy used by every marketplace
            listing.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#FF6B1A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#E85D0F]"
        >
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="mb-5 grid max-w-[650px] grid-cols-3 gap-4">
        <StatCard number={stats.total} title="Total categories" />

        <StatCard number={stats.active} title="Active" />

        <StatCard number={stats.disabled} title="Disabled" />
      </div>

      {/* Search + Filter */}
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

      {/* Table */}
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
                  {/* Name */}
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {category.name}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge isActive={category.isActive} />
                  </td>

                  {/* Questions */}
                  <td className="px-4 py-4 text-gray-500">
                    {category._count.conditionQuestions} questions
                  </td>

                  {/* Created */}
                  <td className="px-4 py-4 text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
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

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
      
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
