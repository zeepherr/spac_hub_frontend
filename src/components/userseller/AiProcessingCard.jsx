import { Bot, Loader2, Save } from "lucide-react";

export default function AiProcessingCard({
  isAiLoading = false,
  isTyping = false,
  isSaving = false,
}) {
  if (!isAiLoading && !isTyping && !isSaving) {
    return null;
  }

  const title = isSaving
    ? "Saving Product Details..."
    : isTyping
      ? "Applying AI Results..."
      : "Analyzing Product Image...";

  const description = isSaving
    ? "Saving your product information. Please wait."
    : isTyping
      ? "Adding the detected product details to the form."
      : "Identifying the product and researching current market prices.";

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-4 flex w-full max-w-md items-center gap-3 rounded-2xl border border-amber-300/70 bg-white/85 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_12px_32px_rgba(249,115,22,0.14)] backdrop-blur-xl"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
        {isSaving ? <Save className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-extrabold text-neutral-900">{title}</h4>

          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-orange-500" />
        </div>

        <p className="mt-0.5 text-xs leading-5 text-neutral-500">
          {description}
        </p>
      </div>
    </div>
  );
}
