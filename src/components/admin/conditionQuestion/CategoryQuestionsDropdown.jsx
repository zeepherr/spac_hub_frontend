import { useState } from "react";

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

  
  const [deleteQuestion, setDeleteQuestion] = useState(null);

  const handleOpenDeleteModal = (question) => {
    setDeleteQuestion(question);
  };

  const handleCloseDeleteModal = () => {
    setDeleteQuestion(null);
  };

  // ยังไม่ลบจริงและยังไม่เรียก API
  const handleConfirmDelete = () => {
    console.log("Question selected for deletion:", deleteQuestion);

    handleCloseDeleteModal();
  };

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
          <p className="py-3 text-sm text-gray-500">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="py-3 text-sm text-gray-500">No questions found</p>
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

                    {/* DELETE QUESTION */}
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(question)}
                      className="cursor-pointer text-xs font-medium text-red-500 hover:underline"
                    >
                      Delete
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

        {/* DELETE QUESTION MODAL */}
        {deleteQuestion && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={handleCloseDeleteModal}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-question-title"
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h2
                id="delete-question-title"
                className="text-xl font-bold text-gray-900"
              >
                Confirm Question Deletion
              </h2>

              <p className="mt-3 text-sm text-gray-600">
                Are you sure you want to delete this question?
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {deleteQuestion.label}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="cursor-pointer rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

export default CategoryQuestionsDropdown;