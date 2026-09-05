import {ChevronRight,Package,} from "lucide-react";

const orderStatusConfig = {
    PENDING_PAYMENT: {
        label: "Pending Payment",
        className:
            "bg-orange-50 text-orange-600",
    },

    PROCESSING: {
        label: "Processing",
        className:
            "bg-amber-50 text-amber-600",
    },

    SHIPPING: {
        label: "Shipping",
        className: "bg-blue-50 text-blue-600",
    },

    COMPLETED: {
        label: "Completed",
        className: "bg-green-50 text-green-600",
    },

    CANCELLED: {
        label: "Cancelled",
        className: "bg-red-50 text-red-600",
    },
};

function RecentOrders({
    orders,
    onViewAll,
    onOpenOrder,
}) {
    return (
        <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm lg:p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-base-content">
                    Recent Orders
                </h2>

                <button
                    type="button"
                    onClick={onViewAll}
                    className="cursor-pointer text-sm font-bold text-orange-500 hover:text-orange-600"
                >
                    See All
                </button>
            </div>

            {orders.length > 0 ? (
                <div className="mt-4 divide-y divide-base-300">
                    {orders.map((order) => {
                        const status =
                            orderStatusConfig[order.status] ?? {
                                label: order.status,
                                className:
                                    "bg-base-200 text-base-content/60",
                            };

                        return (
                            <button
                                key={order.id}
                                type="button"
                                onClick={() =>
                                    onOpenOrder(order.id)
                                }
                                className="grid w-full cursor-pointer grid-cols-1 gap-4 py-4 text-left transition first:pt-2 hover:bg-base-200/30 md:grid-cols-[minmax(0,1fr)_130px_150px_24px] md:items-center"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <ProductImage
                                        imageUrl={
                                            order.productImageUrl
                                        }
                                        productName={
                                            order.productName
                                        }
                                    />

                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-base-content">
                                            {order.orderNumber}
                                        </p>

                                        <p className="mt-1 truncate text-sm text-base-content/65">
                                            {order.productName}
                                        </p>

                                        <p className="mt-1 text-xs text-base-content/45">
                                            Ordered on{" "}
                                            {formatOrderDate(
                                                order.createdAt,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <p className="font-bold text-base-content md:text-right">
                                    ฿
                                    {order.price.toLocaleString(
                                        "th-TH",
                                    )}
                                </p>

                                <div className="md:text-right">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
                                    >
                                        {status.label}
                                    </span>
                                </div>

                                <ChevronRight
                                    size={20}
                                    className="hidden text-base-content/30 md:block"
                                    aria-hidden="true"
                                />
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="mt-4 flex min-h-32 items-center justify-center">
                    <p className="text-sm text-base-content/50">
                        No orders yet
                    </p>
                </div>
            )}
        </section>
    );
}

function ProductImage({
    imageUrl,
    productName,
}) {
    return (
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-base-300 bg-base-200/50">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={productName}
                    className="size-full object-cover"
                />
            ) : (
                <Package
                    size={27}
                    className="text-base-content/35"
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

function formatOrderDate(dateValue) {
    return new Intl.DateTimeFormat("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(dateValue));
}

export default RecentOrders;