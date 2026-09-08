import { ClipboardCheck } from "lucide-react";

function InspectionResultForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  isPending,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:sticky xl:top-6"
    >
      <div className="flex items-center gap-2">
        <ClipboardCheck
          size={20}
          className="text-orange-500"
        />

        <h2 className="text-base font-semibold text-neutral-900">
          Inspection Result
        </h2>
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        Record the inspection result for the
        product received from the seller.
      </p>

      {/* RESULT */}
      <div className="mt-6">
        <label className="text-sm font-medium text-neutral-800">
          Inspection Result
          <span className="ml-1 text-red-500">
            *
          </span>
        </label>

        <select
          name="result"
          value={form.result}
          onChange={onChange}
          required
          className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        >
          <option value="">
            Select Result
          </option>

          <option value="PASSED">
            Passed
          </option>

          <option value="FAILED">
            Failed
          </option>
        </select>
      </div>

      {/* CONDITION */}
      {form.result === "PASSED" && (
        <div className="mt-5">
          <label className="text-sm font-medium text-neutral-800">
            Verified Condition
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <select
            name="verifiedCondition"
            value={
              form.verifiedCondition
            }
            onChange={onChange}
            required
            className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">
              Select Condition
            </option>

            <option value="LIKE_NEW">
              LIKE NEW
            </option>

            <option value="GOOD">
              GOOD
            </option>

            <option value="FAIR">
              FAIR
            </option>

            <option value="POOR">
              POOR
            </option>
          </select>
        </div>
      )}

      {/* SCORE */}
      {form.result === "PASSED" && (
        <div className="mt-5">
          <label className="text-sm font-medium text-neutral-800">
            Condition Score
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            type="number"
            name="verifiedScore"
            value={
              form.verifiedScore
            }
            onChange={onChange}
            min={0}
            max={100}
            required
            placeholder="0 - 100"
            className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>
      )}

      {/* NOTES */}
      {form.result && (
        <div className="mt-5">
          <label className="text-sm font-medium text-neutral-800">
            Notes

            {form.result !==
              "PASSED" && (
              <span className="ml-1 text-red-500">
                *
              </span>
            )}
          </label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={onChange}
            required={
              form.result !== "PASSED"
            }
            rows={6}
            maxLength={2000}
            placeholder={
              form.result === "PASSED"
                ? "Add notes if needed"
                : "Describe the reason the product failed inspection"
            }
            className="mt-2 w-full resize-none rounded-xl border border-neutral-200 p-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />

          <p className="mt-1 text-right text-xs text-neutral-400">
            {form.notes.length}/2000
          </p>
        </div>
      )}

      {/* BUTTON */}
      <div className="mt-7 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isPending ||
            !form.result
          }
          className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : "Confirm Result"}
        </button>
      </div>
    </form>
  );
}

export default InspectionResultForm;