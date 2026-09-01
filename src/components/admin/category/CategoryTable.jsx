import { Fragment, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

import CategoryQuestionsDropdown from "@/components/admin/conditionQuestion/CategoryQuestionsDropdown";

function CategoryTable({
  categories,
  isLoading,
  isUpdatingStatus,
  onEdit,
  onStatusChange,
}) {
  const [openCategoryId, setOpenCategoryId] = useState(null);

  const handleManageQuestions = (categoryId) => {
    setOpenCategoryId((currentId) =>
      currentId === categoryId ? null : categoryId,
    );
  };

  return (
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
          ) : categories.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-500">
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <Fragment key={category.id}>
                {/* CATEGORY ROW */}
                <tr className="border-b border-gray-100">
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
                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="cursor-pointer text-[#FF6B1A] hover:underline"
                      >
                        Edit
                      </button>

                      {/* ENABLE / DISABLE */}
                      <button
                        type="button"
                        onClick={() => onStatusChange(category)}
                        disabled={isUpdatingStatus}
                        className={`cursor-pointer hover:underline disabled:cursor-not-allowed disabled:opacity-50 ${
                          category.isActive
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {category.isActive ? "Disable" : "Enable"}
                      </button>

                      {/* MANAGE QUESTIONS */}
                      <button
                        type="button"
                        onClick={() => handleManageQuestions(category.id)}
                        className="flex cursor-pointer items-center gap-1 text-[#FF6B1A] hover:underline"
                      >
                        Manage Questions

                        {openCategoryId === category.id ? (
                          <ChevronDown size={13} />
                        ) : (
                          <ArrowRight size={13} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* QUESTIONS DROPDOWN */}
                <CategoryQuestionsDropdown
                  categoryId={category.id}
                  isOpen={openCategoryId === category.id}
                />
              </Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ isActive }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-600"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {isActive ? "Active" : "Disabled"}
    </span>
  );
}

export default CategoryTable;