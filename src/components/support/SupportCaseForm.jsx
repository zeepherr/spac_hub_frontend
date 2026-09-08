import { LoaderCircle, MessageSquareText, Send } from "lucide-react";
import { useState } from "react";

import { useCreateSupportCase } from "@/hook/support/useCreateSupportCase";

import {
  BUYER_SUPPORT_ISSUES,
  SELLER_SUPPORT_ISSUES,
} from "./support.constants";

function SupportCaseForm({
  orderId,
  role = "BUYER",
  onCreated,
  compact = false,
}) {
  const issueOptions =
    role === "SELLER" ? SELLER_SUPPORT_ISSUES : BUYER_SUPPORT_ISSUES;

  const [issueType, setIssueType] = useState(issueOptions[0].value);

  const [message, setMessage] = useState("");

  const createCaseMutation = useCreateSupportCase();

  const normalizedMessage = message.trim();

  const canSubmit =
    Number(orderId) > 0 &&
    Boolean(issueType) &&
    normalizedMessage.length > 0 &&
    normalizedMessage.length <= 2000 &&
    !createCaseMutation.isPending;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const submittedMessage = normalizedMessage;

    try {
      const response = await createCaseMutation.mutateAsync({
        orderId: Number(orderId),
        issueType,
        message: submittedMessage,
      });

      /*
       * Pass the case and creation result to
       * BuyerOrderSupport/SellerOrderSupport.
       */
      onCreated?.(response.data, {
        created: response.meta?.created === true,

        /*
         * If the case already existed, Backend did not
         * save this submitted message. The parent can
         * send it through Socket after joining the room.
         */
        pendingMessage:
          response.meta?.created === false ? submittedMessage : null,
      });

      setMessage("");
    } catch {
      /*
       * Error toast is already handled
       * inside useCreateSupportCase.
       */
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-neutral-200 bg-white shadow-sm ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 ${
            compact ? "size-10" : "size-11"
          }`}
        >
          <MessageSquareText size={compact ? 19 : 21} />
        </span>

        <div>
          <h2
            className={`${compact ? "text-base" : "text-lg"} font-bold text-neutral-900`}
          >
            Contact SpecHub Support
          </h2>

          <p
            className={`mt-1 text-neutral-500 ${
              compact ? "text-xs leading-5" : "text-sm leading-6"
            }`}
          >
            This conversation is private between you and SpecHub Admin.
          </p>
        </div>
      </div>

      <div className={compact ? "mt-4" : "mt-6"}>
        <label
          htmlFor="support-issue-type"
          className="text-sm font-semibold text-neutral-800"
        >
          What do you need help with?
        </label>

        <select
          id="support-issue-type"
          value={issueType}
          onChange={(event) => setIssueType(event.target.value)}
          disabled={createCaseMutation.isPending}
          className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {issueOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={compact ? "mt-4" : "mt-5"}>
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="support-first-message"
            className="text-sm font-semibold text-neutral-800"
          >
            Describe the issue
          </label>

          <span
            className={`text-xs ${
              message.length > 2000 ? "text-red-500" : "text-neutral-400"
            }`}
          >
            {message.length}/2000
          </span>
        </div>

        <textarea
          id="support-first-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={createCaseMutation.isPending}
          rows={compact ? 3 : 5}
          maxLength={2000}
          placeholder="Please explain what happened..."
          className="mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-white p-3 text-sm leading-6 text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div
        className={`mt-4 rounded-xl border border-orange-100 bg-orange-50 ${
          compact ? "p-3" : "p-4"
        }`}
      >
        <p
          className={`text-orange-800 ${
            compact ? "text-xs leading-5" : "text-sm leading-6"
          }`}
        >
          You can return to this inbox anytime to read replies and continue the
          conversation with SpecHub Admin.
        </p>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 ${
          compact ? "mt-4 py-2.5" : "mt-5 py-3"
        }`}
      >
        {createCaseMutation.isPending ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Creating Support Case...
          </>
        ) : (
          <>
            <Send size={18} />
            Start Support Conversation
          </>
        )}
      </button>
    </form>
  );
}

export default SupportCaseForm;
