import { useState } from "react";
import { useCreateConditionQuestion } from "@/hook/conditionQuestion/useCreateConditionQuestion";

function AddQuestionModal({ isOpen, onClose, categoryId }) {
  const { mutate: createQuestion, isPending: isCreating } =
    useCreateConditionQuestion();

  const [label, setLabel] = useState("");
  const [answerType, setAnswerType] = useState("BOOLEAN");
  const [options, setOptions] = useState([""]);
  const [isRequired, setIsRequired] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  if (!isOpen) return null;

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

    createQuestion(
      {
        categoryId,
        payload,
      },
      {
        onSuccess: () => {
          setLabel("");
          setAnswerType("BOOLEAN");
          setOptions([""]);
          setIsRequired(true);
          setSortOrder(0);
          onClose();
        },
      },
    );
  };

  const handleOptionChange = (index, value) => {
    setOptions((currentOptions) =>
      currentOptions.map((option, optionIndex) =>
        optionIndex === index ? value : option,
      ),
    );
  };

  const handleAddOption = () => {
    setOptions((currentOptions) => [...currentOptions, ""]);
  };

  const handleRemoveOption = (index) => {
    setOptions((currentOptions) =>
      currentOptions.filter((_, optionIndex) => optionIndex !== index),
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Add Condition Question
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a new condition question for this category.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* LABEL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Question
              </label>

              <input
                type="text"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Enter question"
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
                  setAnswerType(event.target.value);

                  if (event.target.value !== "SELECT") {
                    setOptions([""]);
                  }
                }}
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FF6B1A]"
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
                          className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
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
                  className="mt-2 cursor-pointer text-sm font-medium text-[#FF6B1A] hover:underline"
                >
                  + Add Option
                </button>
              </div>
            )}

            {/* REQUIRED */}
            <div className="flex items-center gap-2">
              <input
                id="isRequired"
                type="checkbox"
                checked={isRequired}
                onChange={(event) => setIsRequired(event.target.checked)}
                className="h-4 w-4"
              />

              <label
                htmlFor="isRequired"
                className="text-sm font-medium text-gray-700"
              >
                Required
              </label>
            </div>

            {/* SORT ORDER */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort Order
              </label>

              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#FF6B1A]"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
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
              {isCreating ? "Creating..." : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddQuestionModal;