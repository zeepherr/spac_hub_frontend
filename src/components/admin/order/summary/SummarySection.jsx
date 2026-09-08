import {
  PackageCheck,
  RotateCcw,
  Truck,
} from "lucide-react";

function SummarySection({
  type,
  title,
  description,
  orders,
}) {
  const isBuyer = type === "BUYER";

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* SECTION HEADER */}
      <div
        className={`flex items-center justify-between px-6 py-5 ${
          isBuyer
            ? "bg-orange-50"
            : "bg-red-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              isBuyer
                ? "bg-orange-100"
                : "bg-red-100"
            }`}
          >
            {isBuyer ? (
              <Truck
                size={21}
                className="text-orange-500"
              />
            ) : (
              <RotateCcw
                size={21}
                className="text-red-500"
              />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              {title}
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              {description}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
            isBuyer
              ? "bg-orange-100 text-orange-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {orders.length} items
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/60 text-left">
              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                Order
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                Product
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                Price
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                Carrier
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                Tracking Number
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                Shipment Status
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                Shipped Date
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-14 text-center"
                >
                  {isBuyer ? (
                    <Truck
                      size={34}
                      className="mx-auto text-neutral-300"
                    />
                  ) : (
                    <RotateCcw
                      size={34}
                      className="mx-auto text-neutral-300"
                    />
                  )}

                  <p className="mt-3 text-sm font-medium text-neutral-500">
                    {isBuyer
                      ? "No shipped products yet"
                      : "No returned products yet"}
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    Completed shipments will appear here.
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <SummaryRow
                  key={order.id}
                  order={order}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SummaryRow({ order }) {
  const listing = order.listing;
  const shipment =
    order.summaryShipment;

  const images =
    listing?.images ?? [];

  const coverImage =
    images.find(
      (image) => image.isCover,
    )?.imageUrl ||
    images[0]?.imageUrl ||
    null;

  return (
    <tr className="border-b border-neutral-100 last:border-b-0 transition hover:bg-neutral-50/60">
      {/* ORDER */}
      <td className="px-6 py-4">
        <div className="min-w-[210px]">
          <p className="text-sm font-semibold text-neutral-900">
            {order.orderNumber}
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            {formatDate(
              order.createdAt,
            )}
          </p>
        </div>
      </td>

      {/* PRODUCT */}
      <td className="px-6 py-4">
        <div className="flex min-w-[260px] items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
            {coverImage ? (
              <img
                src={coverImage}
                alt={
                  listing?.title ||
                  "Product"
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <PackageCheck
                  size={20}
                  className="text-neutral-300"
                />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="max-w-[220px] truncate text-sm font-medium text-neutral-900">
              {listing?.title || "-"}
            </p>

            <p className="mt-1 max-w-[220px] truncate text-xs text-neutral-400">
              {listing?.brand || "-"}

              {listing?.category?.name
                ? ` • ${listing.category.name}`
                : ""}
            </p>
          </div>
        </div>
      </td>

      {/* PRICE */}
      <td className="px-6 py-4">
        <p className="whitespace-nowrap text-sm font-semibold text-neutral-900">
          {formatPrice(
            order.agreedPrice,
          )}
        </p>
      </td>

      {/* CARRIER */}
      <td className="px-6 py-4">
        <p className="whitespace-nowrap text-sm text-neutral-700">
          {shipment?.carrier || "-"}
        </p>
      </td>

      {/* TRACKING */}
      <td className="px-6 py-4">
        <p className="whitespace-nowrap font-mono text-sm font-medium text-neutral-900">
          {shipment?.trackingNumber ||
            "-"}
        </p>
      </td>

      {/* STATUS */}
      <td className="px-6 py-4">
        <ShipmentStatusBadge
          status={shipment?.status}
        />
      </td>

      {/* SHIPPED DATE */}
      <td className="px-6 py-4">
        <p className="min-w-[150px] text-sm text-neutral-600">
          {formatDate(
            shipment?.shippedAt ||
              shipment?.createdAt,
          )}
        </p>
      </td>
    </tr>
  );
}

function ShipmentStatusBadge({
  status,
}) {
  const statusConfig = {
    PENDING: {
      label: "Pending",
      className:
        "bg-neutral-100 text-neutral-600",
    },

    SHIPPED: {
      label: "Shipped",
      className:
        "bg-blue-100 text-blue-600",
    },

    IN_TRANSIT: {
      label: "In Transit",
      className:
        "bg-blue-100 text-blue-600",
    },

    DELIVERED: {
      label: "Delivered",
      className:
        "bg-green-100 text-green-700",
    },

    FAILED: {
      label: "Delivery Failed",
      className:
        "bg-red-100 text-red-600",
    },
  };

  const config =
    statusConfig[status] ?? {
      label: status || "-",
      className:
        "bg-neutral-100 text-neutral-600",
    };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function formatPrice(price) {
  return `฿${Number(
    price || 0,
  ).toLocaleString("th-TH")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(date));
}

export default SummarySection;