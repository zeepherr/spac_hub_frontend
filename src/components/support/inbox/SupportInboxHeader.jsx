import { MessageSquareText } from "lucide-react";

function SupportInboxHeader() {
  return (
    <header className="flex shrink-0 items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Support center
        </p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-900">
          Support Inbox
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Choose an order and talk privately with SpecHub Support.
        </p>
      </div>

      <span className="hidden size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 sm:flex">
        <MessageSquareText size={22} />
      </span>
    </header>
  );
}

export default SupportInboxHeader;
