import { PackageCheck } from "lucide-react";

function ReadyToShipTable({
  orders,
  onOpen,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
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
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center"
                >
                  <PackageCheck
                    size={36}
                    className="mx-auto text-neutral-300"
                  />

                  <p className="mt-3 text-sm font-medium text-neutral-500">
                    No products found
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    Try changing your search or filter.
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onOpen={() =>
                    onOpen(order)
                  }
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  onOpen,
}) {
  const listing = order.listing;

  const images =
    listing?.images ?? [];

  const coverImage =
    images.find(
      (image) => image.isCover,
    )?.imageUrl ||
    images[0]?.imageUrl ||
    null;

  const isVerified =
    order.status === "VERIFIED";

  return (
    <tr className="border-b border-neutral-100 last:border-b-0 transition hover:bg-neutral-50/60">
      <td className="px-6 py-4">
        <div className="min-w-[220px]">
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

      <td className="px-6 py-4">
        <div className="flex min-w-[280px] items-center gap-3">
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
            <p className="max-w-[250px] truncate text-sm font-medium text-neutral-900">
              {listing?.title || "-"}
            </p>

            <p className="mt-1 max-w-[250px] truncate text-xs text-neutral-400">
              {listing?.brand || "-"}

              {listing?.category?.name
                ? ` • ${listing.category.name}`
                : ""}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <p className="whitespace-nowrap text-sm font-semibold text-neutral-900">
          {formatPrice(
            order.agreedPrice,
          )}
        </p>
      </td>

      <td className="px-6 py-4">
        {isVerified ? (
          <span className="inline-flex whitespace-nowrap rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
            Inspection Passed
          </span>
        ) : (
          <span className="inline-flex whitespace-nowrap rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600">
            Inspection Failed
          </span>
        )}
      </td>

      <td className="px-6 py-4 text-right">
        {isVerified ? (
          <button
            type="button"
            onClick={onOpen}
            className="min-w-[130px] rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Ship Product
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="min-w-[130px] rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Return Product
          </button>
        )}
      </td>
    </tr>
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

export default ReadyToShipTable;