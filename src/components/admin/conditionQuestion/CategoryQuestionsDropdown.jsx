import { useConditionQuestions } from "@/hook/conditionQuestion/useConditionQuestion";
import QuestionAnswerInput from "./QuestionAnswerInput";

function CategoryQuestionsDropdown({ categoryId, isOpen }) {
  const {
    data: questions = [],
    isPending,
    isError,
  } = useConditionQuestions(categoryId, isOpen);

  if (!isOpen) return null;

  return (
    <tr>
      <td colSpan={5} className="bg-gray-50 px-6 py-4">
        {isPending ? (
          <p className="py-3 text-sm text-gray-500">
            Loading questions...
          </p>
        ) : isError ? (
          <p className="py-3 text-sm text-red-500">
            Failed to load questions
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

                  <QuestionAnswerInput question={question} />
                </div>
              </div>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}

export default CategoryQuestionsDropdown;