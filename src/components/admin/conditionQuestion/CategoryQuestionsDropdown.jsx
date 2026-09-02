import { useState } from "react";
import { useUpdateConditionQuestionStatus } from "@/hook/conditionQuestion/useUpdateConditionQuestionStatus";

import AddQuestionModal from "./AddQuestionModal";
import EditQuestionModal from "./EditQuestionModal";

function CategoryQuestionsDropdown({
  categoryId,
  isOpen,
  questions = [],
  isPending,
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    mutate: updateQuestionStatus,
    isPending: isUpdatingStatus,
  } = useUpdateConditionQuestionStatus();

  if (!isOpen) return null;

  return (
    <tr>
      <td colSpan={5} className="bg-gray-50 px-6 py-4">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Condition Questions
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Manage questions for this category.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="cursor-pointer rounded-lg bg-[#FF6B1A] px-3 py-2 text-xs font-medium text-white hover:bg-[#E85D0F]"
          >
            Add Question
          </button>
        </div>

        {/* QUESTIONS */}
        {isPending ? (
          <p className="py-3 text-sm text-gray-500">
            Loading questions...
          </p>
        ) : questions.length === 0 ? (
          <p className="py-3 text-sm text-gray-500">
            No questions found
          </p>
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between gap-6">
                  {/* QUESTION INFO */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400">
                        {index + 1}.
                      </span>

                      <p className="text-sm font-medium text-gray-900">
                        {question.label}
                      </p>

                      {question.isRequired && (
                        <span className="text-xs text-red-500">
                          Required
                        </span>
                      )}
                    </div>

                    <p className="mt-1 pl-5 text-xs text-gray-400">
                      {question.answerType}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedQuestion(question);
                        setIsEditOpen(true);
                      }}
                      className="cursor-pointer text-xs font-medium text-[#FF6B1A] hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuestionStatus({
                          categoryId,
                          questionId: question.id,
                          payload: {
                            isActive: !question.isActive,
                          },
                        })
                      }
                      disabled={isUpdatingStatus}
                      className={`cursor-pointer text-xs font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-50 ${
                        question.isActive
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {question.isActive ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD MODAL */}
        <AddQuestionModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          categoryId={categoryId}
        />

        {/* EDIT MODAL */}
        <EditQuestionModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedQuestion(null);
          }}
          categoryId={categoryId}
          question={selectedQuestion}
        />
      </td>
    </tr>
  );
}

export default CategoryQuestionsDropdown;