import { LoaderCircle, Send } from "lucide-react";

function SupportMessageComposer({
  handleSendMessage,
  composerRef,
  draft,
  setDraft,
  handleComposerKeyDown,
  isJoined,
  isSending,
  canSend,
}) {
  return (
    <form
      onSubmit={handleSendMessage}
      className="shrink-0 border-t border-neutral-200 bg-neutral-50 p-3"
    >
      <div className="flex items-end gap-2 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
        <textarea
          ref={composerRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleComposerKeyDown}
          maxLength={2000}
          rows={1}
          disabled={!isJoined || isSending}
          aria-label="Message"
          placeholder={isJoined ? "Write a message..." : "Connecting to support..."}
          className="chat-scrollbar min-h-10 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-neutral-800 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label={isSending ? "Sending message" : "Send message"}
          title={isSending ? "Sending" : "Send"}
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isSending ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </form>
  );
}

export default SupportMessageComposer;
