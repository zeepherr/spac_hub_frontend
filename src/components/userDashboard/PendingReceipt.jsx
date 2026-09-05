import {ChevronRight,PackageCheck,} from "lucide-react";

function PendingReceipt({
    pendingReceipt,
    onConfirm,
}) {
    return (
        <section className="h-full rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm lg:p-6">
            <h2 className="text-lg font-bold text-base-content">
                Action Items
            </h2>

            {pendingReceipt ? (
                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                            <PackageCheck
                                size={27}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </span>

                        <div className="min-w-0">
                            <h3 className="font-bold text-base-content">
                                Confirm Receipt
                            </h3>

                            <p className="mt-1 text-sm text-base-content/55">
                                {pendingReceipt.message}
                            </p>

                            <p className="mt-1 truncate text-xs text-base-content/40">
                                {pendingReceipt.orderNumber}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onConfirm(pendingReceipt.id)
                        }
                        className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-500 px-5 py-2.5 text-sm font-bold text-orange-500 transition hover:bg-orange-50"
                    >
                        Confirm Receipt

                        <ChevronRight
                            size={18}
                            aria-hidden="true"
                        />
                    </button>
                </div>
            ) : (
                <div className="mt-5 flex min-h-24 items-center justify-center rounded-xl bg-base-200/40">
                    <p className="text-sm text-base-content/50">
                        No action items
                    </p>
                </div>
            )}
        </section>
    );
}

export default PendingReceipt;