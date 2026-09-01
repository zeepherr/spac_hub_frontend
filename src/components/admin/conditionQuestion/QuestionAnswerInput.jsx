function QuestionAnswerInput({ question }) {
  switch (question.answerType) {
    case "BOOLEAN":
      return (
        <div className="flex gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:border-[#FF6B1A] hover:text-[#FF6B1A]"
          >
            Yes
          </button>

          <button
            type="button"
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:border-[#FF6B1A] hover:text-[#FF6B1A]"
          >
            No
          </button>
        </div>
      );

    case "NUMBER":
      return (
        <input
          type="number"
          placeholder="Enter number"
          className="w-[220px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B1A]"
        />
      );

    case "TEXT":
      return (
        <input
          type="text"
          placeholder="Enter answer"
          className="w-[220px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B1A]"
        />
      );

    case "SELECT":
      return (
        <select className="w-[220px] cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B1A]">
          <option value="">Select option</option>

          {Array.isArray(question.options) &&
            question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      );

    default:
      return null;
  }
}

export default QuestionAnswerInput;