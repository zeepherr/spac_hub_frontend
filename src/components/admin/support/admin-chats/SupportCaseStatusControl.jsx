import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { useUpdateSupportCaseStatus } from "@/hook/support/useUpdateSupportCaseStatus";

import { STATUS_OPTIONS } from "./adminChats.utils";

function SupportCaseStatusControl({ supportCase }) {
  const [status, setStatus] = useState(supportCase.status);

  const [resolutionNote, setResolutionNote] = useState(
    supportCase.resolutionNote || "",
  );

  const updateStatusMutation = useUpdateSupportCaseStatus();

  useEffect(() => {
    setStatus(supportCase.status);
    setResolutionNote(supportCase.resolutionNote || "");
  }, [supportCase.id, supportCase.status, supportCase.resolutionNote]);

  const normalizedNote = resolutionNote.trim();

  const hasChanges =
    status !== supportCase.status ||
    normalizedNote !== (supportCase.resolutionNote || "").trim();

  function handleSubmit(event) {
    event.preventDefault();

    if (!hasChanges || updateStatusMutation.isPending) {
      return;
    }

    updateStatusMutation.mutate({
      supportCaseId: supportCase.id,
      payload: {
        status,
        ...(normalizedNote ? { resolutionNote: normalizedNote } : {}),
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
    >
      <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)_120px]">
        <div>
          <label
            htmlFor="support-case-status"
            className="text-xs font-bold uppercase tracking-wider text-neutral-400"
          >
            Case status
          </label>

          <select
            id="support-case-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={updateStatusMutation.isPending}
            className="mt-2 h-11 w-full cursor-pointer rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="resolution-note"
            className="text-xs font-bold uppercase tracking-wider text-neutral-400"
          >
            Resolution note
          </label>

          <input
            id="resolution-note"
            type="text"
            value={resolutionNote}
            onChange={(event) => setResolutionNote(event.target.value)}
            maxLength={2000}
            disabled={updateStatusMutation.isPending}
            placeholder="Optional note about the resolution..."
            className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={!hasChanges || updateStatusMutation.isPending}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-900 px-4 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {updateStatusMutation.isPending ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SupportCaseStatusControl;
