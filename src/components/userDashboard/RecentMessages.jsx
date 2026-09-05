import {ChevronRight,UserRound,} from "lucide-react";

function RecentMessages({
    messages,
    onViewAll,
    onOpenMessage,
}) {
    return (
        <section className="h-full rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm lg:p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-base-content">
                    Recent Messages
                </h2>

                <button
                    type="button"
                    onClick={onViewAll}
                    className="cursor-pointer text-sm font-bold text-orange-500 hover:text-orange-600"
                >
                    See All
                </button>
            </div>

            {messages.length > 0 ? (
                <div className="mt-4 divide-y divide-base-300">
                    {messages.map((message) => (
                        <button
                            key={message.id}
                            type="button"
                            onClick={() =>
                                onOpenMessage(
                                    message.conversationId,
                                )
                            }
                            className="flex w-full cursor-pointer items-center gap-3 py-4 text-left transition first:pt-2 hover:bg-base-200/30"
                        >
                            <MessageAvatar
                                imageUrl={
                                    message.senderImageUrl
                                }
                                name={message.senderName}
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-bold text-base-content">
                                        {message.senderName}
                                    </p>

                                    {message.isUnread && (
                                        <span
                                            className="size-2 shrink-0 rounded-full bg-orange-500"
                                            aria-label="Unread Messages"
                                        />
                                    )}
                                </div>

                                <p className="mt-1 truncate text-xs text-base-content/55">
                                    {message.message}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <span className="text-xs text-base-content/40">
                                    {formatRelativeTime(
                                        message.createdAt,
                                    )}
                                </span>

                                <ChevronRight
                                    size={17}
                                    className="text-base-content/30"
                                />
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="mt-4 flex min-h-28 items-center justify-center">
                    <p className="text-sm text-base-content/50">
                        No messages
                    </p>
                </div>
            )}
        </section>
    );
}

function MessageAvatar({ imageUrl, name }) {
    return (
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-base-200">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={`image ${name}`}
                    className="size-full object-cover"
                />
            ) : (
                <UserRound
                    size={21}
                    className="text-base-content/40"
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

function formatRelativeTime(dateValue) {
    const date = new Date(dateValue);
    const now = new Date();

    const difference =
        now.getTime() - date.getTime();

    const minutes = Math.floor(
        difference / (1000 * 60),
    );

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} days ago`;
}

export default RecentMessages;