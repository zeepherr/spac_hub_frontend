import { LoaderCircle, Package } from "lucide-react";

function getSellerShipment(order) {
  return order.shipments?.find(
    (shipment) => shipment.shipmentType === "SELLER_TO_ADMIN",
  );
}

function getSellerName(order) {
  const firstName = order.seller?.firstName ?? "";

  const lastName = order.seller?.lastName ?? "";

  return `${firstName} ${lastName}`.trim() || "-";
}

function getCoverImage(order) {
  const images = order.listing?.images ?? [];

  return (
    images.find((image) => image.isCover)?.imageUrl ||
    images[0]?.imageUrl ||
    null
  );
}

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getShipmentStatus(status) {
  switch (status) {
    case "DELIVERED":
      return {
        label: "Delivered",
        className: "bg-green-100 text-green-700",
      };

    case "SHIPPED":
      return {
        label: "In Transit",
        className: "bg-blue-100 text-blue-700",
      };

    default:
      return {
        label: status || "Pending Shipment",
        className: "bg-neutral-100 text-neutral-600",
      };
  }
}

function AwaitingReceiptTable({
  orders,
  isPending,
  isError,
  onRetry,
  onManage,
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {isPending ? (
        <div className="flex min-h-[500px] items-center justify-center">
          <LoaderCircle size={28} className="animate-spin text-orange-500" />

          <span className="ml-3 text-sm text-neutral-500">
            Loading items...
          </span>
        </div>
      ) : isError ? (
        <div className="flex min-h-[500px] flex-col items-center justify-center">
          <p className="text-sm font-medium text-red-500">
            Unable to load parcels
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-[500px] flex-col items-center justify-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
            <Package size={25} className="text-orange-400" />
          </div>

          <p className="font-medium text-neutral-700">
            No parcels awaiting receive
          </p>

          <p className="mt-1 text-sm text-neutral-400">
            Parcels currently being shipped by sellers will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="w-[21%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                  Order
                </th>

                <th className="w-[23%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                  Product
                </th>

                <th className="w-[19%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                  Seller
                </th>

                <th className="w-[17%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                  Shipping
                </th>

                <th className="w-[10%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                  Status
                </th>

                <th className="w-[10%] px-6 py-4 text-right text-xs font-semibold text-neutral-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => {
                const shipment = getSellerShipment(order);

                const coverImage = getCoverImage(order);

                const shipmentStatus = getShipmentStatus(shipment?.status);

                return (
                  <tr
                    key={order.id}
                    className="h-[90px] transition hover:bg-neutral-50"
                  >
                    {/* Order */}
                    <td className="px-6 py-4">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-neutral-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={order.listing?.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package size={20} className="text-neutral-300" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-neutral-900">
                            {order.listing?.title || "-"}
                          </p>

                          <p className="mt-1 truncate text-xs text-neutral-500">
                            {order.listing?.brand || "-"}

                            {order.listing?.model
                              ? ` • ${order.listing.model}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Seller */}
                    <td className="px-6 py-4">
                      <p className="truncate text-sm font-medium text-neutral-800">
                        {getSellerName(order)}
                      </p>
                    </td>

                    {/* Shipping */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-neutral-800">
                        {shipment?.carrier || "-"}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {shipment?.trackingNumber || "-"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${shipmentStatus.className}`}
                      >
                        {shipmentStatus.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onManage(order)}
                        className="whitespace-nowrap rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:bg-orange-700"
                      >
                        Manage Product
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

export default AwaitingReceiptTable;
