import { LoaderCircle, Package } from "lucide-react";

function getSellerShipment(order) {
  return order.shipments?.find(
    (shipment) =>
      shipment.shipmentType === "SELLER_TO_ADMIN",
  );
}

function getSellerName(order) {
  const firstName =
    order.seller?.firstName ?? "";

  const lastName =
    order.seller?.lastName ?? "";

  return (
    `${firstName} ${lastName}`.trim() || "-"
  );
}

function getCoverImage(order) {
  const images =
    order.listing?.images ?? [];

  return (
    images.find(
      (image) => image.isCover,
    )?.imageUrl ||
    images[0]?.imageUrl ||
    null
  );
}

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(parsedDate);
}

function getShipmentStatus(status) {
  switch (status) {
    case "DELIVERED":
      return {
        label: "Delivered",
        className:
          "bg-green-100 text-green-700",
      };

    case "SHIPPED":
      return {
        label: "In Transit",
        className:
          "bg-blue-100 text-blue-700",
      };

    default:
      return {
        label:
          status || "Pending Shipment",
        className:
          "bg-neutral-100 text-neutral-600",
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
      {/* LOADING */}
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
        /* ERROR */
        <div className="flex min-h-[500px] flex-col items-center justify-center">
          <p className="text-sm font-medium text-red-500">
            Unable to load parcels
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="
              mt-4 rounded-xl
              bg-orange-500
              px-5 py-2.5
              text-sm font-medium
              text-white
              transition
              hover:bg-orange-600
            "
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        /* EMPTY */
        <div className="flex min-h-[500px] flex-col items-center justify-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-orange-50">
            <Package
              size={25}
              className="text-orange-400"
            />
          </div>

          <p className="font-medium text-neutral-700">
            No parcels awaiting receive
          </p>

          <p className="mt-1 text-sm text-neutral-400">
            Parcels currently being shipped by
            sellers will appear here.
          </p>
        </div>
      ) : (
        /* TABLE */
        <div className="w-full">
          <table className="w-full table-fixed text-left">
            {/* COLUMN WIDTH */}
            <colgroup>
              <col className="w-[19%]" />
              <col className="w-[24%]" />
              <col className="w-[14%]" />
              <col className="w-[17%]" />
              <col className="w-[10%]" />
              <col className="w-[16%]" />
            </colgroup>

            {/* HEADER */}
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-5 py-4 text-xs font-semibold text-neutral-500">
                  Order
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-neutral-500">
                  Product
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-neutral-500">
                  Seller
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-neutral-500">
                  Shipping
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold text-neutral-500">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold text-neutral-500">
                  Action
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => {
                const shipment =
                  getSellerShipment(order);

                const coverImage =
                  getCoverImage(order);

                const shipmentStatus =
                  getShipmentStatus(
                    shipment?.status,
                  );

                return (
                  <tr
                    key={order.id}
                    className="
                      h-[90px]
                      transition-colors
                      hover:bg-neutral-50
                    "
                  >
                    {/* ================= ORDER ================= */}
                    <td className="min-w-0 px-5 py-4">
                      <p
                        title={
                          order.orderNumber
                        }
                        className="truncate text-sm font-semibold text-neutral-900"
                      >
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 truncate text-xs text-neutral-400">
                        {formatDate(
                          order.createdAt,
                        )}
                      </p>
                    </td>

                    {/* ================= PRODUCT ================= */}
                    <td className="min-w-0 px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {coverImage ? (
                            <img
                              src={
                                coverImage
                              }
                              alt={
                                order.listing
                                  ?.title ||
                                "Product"
                              }
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center">
                              <Package
                                size={20}
                                className="text-neutral-300"
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            title={
                              order.listing
                                ?.title
                            }
                            className="truncate text-sm font-semibold text-neutral-900"
                          >
                            {order.listing
                              ?.title || "-"}
                          </p>

                          <p className="mt-1 truncate text-xs text-neutral-500">
                            {order.listing
                              ?.brand || "-"}

                            {order.listing
                              ?.model
                              ? ` • ${order.listing.model}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ================= SELLER ================= */}
                    <td className="min-w-0 px-5 py-4">
                      <p
                        title={getSellerName(
                          order,
                        )}
                        className="truncate text-sm font-medium text-neutral-800"
                      >
                        {getSellerName(
                          order,
                        )}
                      </p>
                    </td>

                    {/* ================= SHIPPING ================= */}
                    <td className="min-w-0 px-5 py-4">
                      <p
                        title={
                          shipment?.carrier
                        }
                        className="truncate text-sm font-medium text-neutral-800"
                      >
                        {shipment?.carrier ||
                          "-"}
                      </p>

                      <p
                        title={
                          shipment?.trackingNumber
                        }
                        className="mt-1 truncate text-xs text-neutral-500"
                      >
                        {shipment?.trackingNumber ||
                          "-"}
                      </p>
                    </td>

                    {/* ================= STATUS ================= */}
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`
                          inline-flex
                          whitespace-nowrap
                          rounded-full
                          px-2.5 py-1
                          text-[11px]
                          font-medium
                          ${shipmentStatus.className}
                        `}
                      >
                        {
                          shipmentStatus.label
                        }
                      </span>
                    </td>

                    {/* ================= ACTION ================= */}
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          onManage(
                            order,
                          )
                        }
                        className="
                          inline-flex
                          max-w-full
                          items-center
                          justify-center
                          whitespace-nowrap
                          rounded-xl
                          bg-orange-500
                          px-4 py-2.5
                          text-xs
                          font-semibold
                          text-white
                          shadow-sm
                          transition
                          hover:bg-orange-600
                          active:bg-orange-700
                        "
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