import { useEffect, useState } from "react";
import { useUpdateConditionQuestion } from "@/hook/conditionQuestion/useUpdateConditionQuestion";

function EditQuestionModal({
  isOpen,
  onClose,
  categoryId,
  question,
}) {
  const { mutate: updateQuestion, isPending } =
    useUpdateConditionQuestion();

  const [label, setLabel] = useState("");
  const [answerType, setAnswerType] = useState("BOOLEAN");
  const [options, setOptions] = useState([""]);
  const [isRequired, setIsRequired] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    if (!question) return;

    setLabel(question.label);
    setAnswerType(question.answerType);
    setIsRequired(question.isRequired);
    setSortOrder(question.sortOrder);

    if (
      question.answerType === "SELECT" &&
      Array.isArray(question.options)
    ) {
      setOptions(question.options);
    } else {
      setOptions([""]);
    }
  }, [question]);

  if (!isOpen || !question) return null;

  const handleOptionChange = (index, value) => {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? value : option,
      ),
    );
  };

  const handleAddOption = () => {
    setOptions((current) => [...current, ""]);
  };

  const handleRemoveOption = (index) => {
    setOptions((current) =>
      current.filter((_, optionIndex) => optionIndex !== index),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      label,
      answerType,
      isRequired,
      sortOrder: Number(sortOrder),
    };

    if (answerType === "SELECT") {
      payload.options = options
        .map((option) => option.trim())
        .filter((option) => option !== "");
    }

    updateQuestion(
      {
        categoryId,
        questionId: question.id,
        payload,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900">
          Edit Question
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update condition question.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* QUESTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Question
            </label>

            <input
              type="text"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#FF6B1A]"
            />
          </div>

          {/* ANSWER TYPE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Answer Type
            </label>

            <select
              value={answerType}
              onChange={(event) => {
                const value = event.target.value;

                setAnswerType(value);

                if (value !== "SELECT") {
                  setOptions([""]);
                }
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FF6B1A]"
            >
              <option value="BOOLEAN">BOOLEAN</option>
              <option value="NUMBER">NUMBER</option>
              <option value="TEXT">TEXT</option>
              <option value="SELECT">SELECT</option>
            </select>
          </div>

          {/* SELECT OPTIONS */}
          {answerType === "SELECT" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Options
              </label>

              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(event) =>
                        handleOptionChange(index, event.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#FF6B1A]"
                    />

                    {options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="cursor-pointer text-sm text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2 cursor-pointer text-sm font-medium text-[#FF6B1A]"
              >
                + Add Option
              </button>
            </div>
          )}

          {/* REQUIRED */}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(event) =>
                setIsRequired(event.target.checked)
              }
            />

            <span className="text-sm text-gray-700">
              Required
            </span>
          </label>

          {/* SORT ORDER */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Sort Order
            </label>

            <input
              type="number"
              min="0"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#FF6B1A]"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-lg bg-[#FF6B1A] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditQuestionModal;