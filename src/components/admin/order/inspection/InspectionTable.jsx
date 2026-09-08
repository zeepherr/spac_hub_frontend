import {
  ClipboardCheck,
  LoaderCircle,
} from "lucide-react";

function getProductName(order) {
  return order.listing?.title || "-";
}

function getCoverImage(order) {
  const images = order.listing?.images ?? [];

  return (
    images.find((image) => image.isCover)?.imageUrl ||
    images[0]?.imageUrl ||
    null
  );
}

function formatPrice(price) {
  return `฿${Number(price || 0).toLocaleString("th-TH")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function InspectionTable({
  orders,
  isPending,
  isError,
  onRetry,
  onInspection,
  startInspectionMutation,
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {isPending ? (
        <div className="flex min-h-[500px] items-center justify-center">
          <LoaderCircle
            size={28}
            className="animate-spin text-orange-500"
          />

          <span className="ml-3 text-sm text-neutral-500">
            Loading items...
          </span>
        </div>
      ) : isError ? (
        <div className="flex min-h-[500px] flex-col items-center justify-center">
          <p className="text-sm font-medium text-red-500">
            Unable to load inspection items
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-[500px] flex-col items-center justify-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
            <ClipboardCheck
              size={25}
              className="text-orange-400"
            />
          </div>

          <p className="font-medium text-neutral-700">
            No products awaiting inspection
          </p>

          <p className="mt-1 text-sm text-neutral-400">
            Products that have been received
            will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="w-[24%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Order
                </th>

                <th className="w-[34%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Product
                </th>

                <th className="w-[14%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Price
                </th>

                <th className="w-[14%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </th>

                <th className="w-[14%] px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => {
                const coverImage =
                  getCoverImage(order);

                const isStarting =
                  startInspectionMutation.isPending &&
                  startInspectionMutation
                    .variables?.orderId ===
                    order.id;

                return (
                  <tr
                    key={order.id}
                    className="h-[78px] transition hover:bg-neutral-50"
                  >
                    {/* Order */}
                    <td className="px-6 py-4">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {order.orderNumber ||
                          "-"}
                      </p>

                      <p className="mt-1 text-xs text-neutral-400">
                        {formatDate(
                          order.createdAt,
                        )}
                      </p>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={getProductName(
                                order,
                              )}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ClipboardCheck
                                size={19}
                                className="text-neutral-300"
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-neutral-900">
                            {order.listing
                              ?.title ||
                              "-"}
                          </p>

                          <p className="mt-1 truncate text-xs text-neutral-400">
                            {order.listing
                              ?.brand ||
                              "-"}

                            {order.listing
                              ?.model
                              ? ` • ${order.listing.model}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-neutral-900">
                        {formatPrice(
                          order.agreedPrice,
                        )}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {order.status ===
                      "INSPECTING" ? (
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                          Under Inspection
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                          Awaiting Inspection
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onInspection(order)
                        }
                        disabled={isStarting}
                        className="min-w-[140px] rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isStarting
                          ? "Starting..."
                          : order.status ===
                              "INSPECTING"
                            ? "Inspect Product"
                            : "Start Inspection"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InspectionTable;