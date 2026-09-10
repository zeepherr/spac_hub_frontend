import { PackageCheck } from "lucide-react";

function ReadyToShipTable({
  orders,
  onOpen,
}) {
  /*
   * ================================
   * EMPTY STATE
   * ================================
   */
  if (orders.length === 0) {
    return (
      <div className="flex min-h-[500px] w-full flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-50">
          <PackageCheck
            size={25}
            className="text-orange-500"
          />
        </div>

        <p className="mt-4 text-sm font-medium text-neutral-700">
          No products found
        </p>

        <p className="mt-1 text-xs text-neutral-400">
          Try changing your search or filter.
        </p>
      </div>
    );
  }

  /*
   * ================================
   * TABLE
   * ================================
   */
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full table-fixed text-left">
        <colgroup>
          <col className="w-[21%]" />
          <col className="w-[31%]" />
          <col className="w-[14%]" />
          <col className="w-[16%]" />
          <col className="w-[18%]" />
        </colgroup>

        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="px-5 py-4 text-xs font-semibold text-neutral-500">
              Order
            </th>

            <th className="px-5 py-4 text-xs font-semibold text-neutral-500">
              Product
            </th>

            <th className="px-5 py-4 text-xs font-semibold text-neutral-500">
              Price
            </th>

            <th className="px-5 py-4 text-center text-xs font-semibold text-neutral-500">
              Status
            </th>

            <th className="px-5 py-4 text-center text-xs font-semibold text-neutral-500">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-100">
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onOpen={() =>
                onOpen(order)
              }
            />
          ))}
        </tbody>
      </table>
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
    <tr className="h-[90px] transition-colors hover:bg-neutral-50">
      {/* ORDER */}
      <td className="min-w-0 px-5 py-4">
        <p className="truncate text-sm font-semibold text-neutral-900">
          {order.orderNumber || "-"}
        </p>

        <p className="mt-1 truncate text-xs text-neutral-400">
          {formatDate(order.createdAt)}
        </p>
      </td>

      {/* PRODUCT */}
      <td className="min-w-0 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="size-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
            {coverImage ? (
              <img
                src={coverImage}
                alt={
                  listing?.title ||
                  "Product"
                }
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <PackageCheck
                  size={20}
                  className="text-neutral-300"
                />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {listing?.title || "-"}
            </p>

            <p className="mt-1 truncate text-xs text-neutral-500">
              {listing?.brand || "-"}

              {listing?.category?.name
                ? ` • ${listing.category.name}`
                : ""}
            </p>
          </div>
        </div>
      </td>

      {/* PRICE */}
      <td className="px-5 py-4">
        <p className="whitespace-nowrap text-sm font-semibold text-neutral-900">
          {formatPrice(
            order.agreedPrice,
          )}
        </p>
      </td>

      {/* STATUS */}
      <td className="px-5 py-4 text-center">
        {isVerified ? (
          <span className="inline-flex whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-700">
            Inspection Passed
          </span>
        ) : (
          <span className="inline-flex whitespace-nowrap rounded-full bg-red-100 px-3 py-1 text-[11px] font-medium text-red-600">
            Inspection Failed
          </span>
        )}
      </td>

      {/* ACTION */}
      <td className="px-5 py-4 text-center">
        <button
          type="button"
          onClick={onOpen}
          className={`inline-flex whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition ${
            isVerified
              ? "bg-orange-500 hover:bg-orange-600 active:bg-orange-700"
              : "bg-red-500 hover:bg-red-600 active:bg-red-700"
          }`}
        >
          {isVerified
            ? "Ship Product"
            : "Return Product"}
        </button>
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

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
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

export default ReadyToShipTable;