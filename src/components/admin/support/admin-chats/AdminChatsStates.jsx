import {
  AlertCircle,
  Inbox,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";

function QueueError({ onRetry }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
      <AlertCircle size={34} className="text-red-500" />
      <p className="mt-3 text-sm font-bold text-neutral-800">
        Unable to load support cases
      </p>
      <button
        type="button"
        onClick={() => onRetry()}
        className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}

function EmptyQueue() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
      <Inbox size={38} className="text-neutral-300" />
      <p className="mt-3 font-bold text-neutral-700">No support cases found</p>
      <p className="mt-1 text-xs text-neutral-400">
        New Buyer and Seller cases will appear here.
      </p>
    </div>
  );
}

function NoSelectedCase() {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
        <MessageSquareText size={30} />
      </span>
      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        Select a support case
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
        Choose the order you want to handle. Its details and conversation will
        open here.
      </p>
    </div>
  );
}

function ConversationError({ error, onRetry }) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center rounded-2xl border border-red-100 bg-white p-8 text-center">
      <AlertCircle size={38} className="text-red-500" />
      <p className="mt-4 font-bold text-neutral-900">
        Unable to open conversation
      </p>
      <p className="mt-2 text-sm text-neutral-500">
        {error?.response?.data?.message || error?.message}
      </p>
      <button
        type="button"
        onClick={() => onRetry()}
        className="mt-5 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-orange-200"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}

function CaseListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="h-36 animate-pulse rounded-xl bg-neutral-100"
        />
      ))}
    </div>
  );
}

function ConversationSkeleton() {
  return (
    <div className="h-full min-h-0 animate-pulse rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="h-8 w-48 rounded bg-neutral-100" />
      <div className="mt-5 h-24 rounded-xl bg-neutral-100" />
      <div className="mt-5 h-[460px] rounded-xl bg-neutral-50" />
    </div>
  );
}

export {
  CaseListSkeleton,
  ConversationError,
  ConversationSkeleton,
  EmptyQueue,
  NoSelectedCase,
  QueueError,
};
