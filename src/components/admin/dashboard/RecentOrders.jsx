import {
  ImageIcon,
  LoaderCircle,
  PackageCheck,
} from "lucide-react";
import { Link } from "react-router";

function RecentOrders({
  orders,
  latestOrders,
  isPending,
  hasData,
  summaryItems,
  statusConfig,
  formatPrice,
  formatCreatedDate,
  getProductImage,
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

      {/* =====================================
          HEADER
      ===================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Orders
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            Orders awaiting action, sorted
            by most recently created.
          </p>
        </div>

        {hasData && (
          <div className="rounded-full bg-orange-50 px-3 py-1.5">
            <span className="text-xs font-medium text-orange-600">
              Total{" "}
              {orders.length.toLocaleString(
                "en-US",
              )}{" "}
              orders
            </span>
          </div>
        )}
      </div>

      {/* =====================================
          LOADING
      ===================================== */}
      {isPending ? (
        <div className="flex min-h-[260px] items-center justify-center">
          <div className="flex flex-col items-center">
            <LoaderCircle
              size={30}
              className="animate-spin text-orange-500"
            />

            <p className="mt-3 text-sm text-neutral-500">
              Loading orders...
            </p>
          </div>
        </div>
      ) : !hasData ? (

        /* =====================================
            NO DATA
        ===================================== */
        <div className="flex min-h-[260px] items-center justify-center">
          <p className="text-sm text-neutral-500">
            Unable to display data.
          </p>
        </div>
      ) : orders.length === 0 ? (

        /* =====================================
            EMPTY
        ===================================== */
        <div className="flex min-h-[300px] flex-col items-center justify-center px-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
            <PackageCheck
              size={28}
              className="text-neutral-400"
            />
          </div>

          <p className="mt-4 font-medium text-neutral-800">
            No orders require action
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Orders will appear here when
            sellers ship their items.
          </p>
        </div>
      ) : (
        <>
          {/* =====================================
              TABLE
          ===================================== */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">

              {/* TABLE HEADER */}
              <thead className="bg-neutral-50">
                <tr className="text-xs text-neutral-500">
                  <th className="px-6 py-4 font-medium">
                    Order
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Product
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Seller
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Price
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-neutral-200">
                {latestOrders.map(
                  (order) => {
                    /*
                     * STATUS
                     */
                    const status =
                      statusConfig[
                        order.status
                      ] ?? {
                        label:
                          order.status ||
                          "Unknown Status",

                        className:
                          "bg-neutral-100 text-neutral-600",
                      };

                    /*
                     * SELLER
                     */
                    const sellerName = [
                      order.seller
                        ?.firstName,
                      order.seller
                        ?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ");

                    /*
                     * FIND QUEUE
                     */
                    const queue =
                      summaryItems.find(
                        (item) =>
                          item.statuses.includes(
                            order.status,
                          ),
                      );

                    /*
                     * PRODUCT IMAGE
                     */
                    const productImage =
                      getProductImage(
                        order,
                      );

                    return (
                      <tr
                        key={order.id}
                        className="
                          text-sm
                          transition-colors
                          hover:bg-neutral-50/80
                        "
                      >
                        {/* =====================
                            ORDER
                        ===================== */}
                        <td className="px-6 py-5">
                          <p className="whitespace-nowrap font-semibold text-neutral-900">
                            {order.orderNumber ||
                              `#${order.id}`}
                          </p>

                          <p className="mt-1 whitespace-nowrap text-[11px] text-neutral-400">
                            {formatCreatedDate(
                              order.createdAt,
                            )}
                          </p>
                        </td>

                        {/* =====================
                            PRODUCT
                        ===================== */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">

                            {/* IMAGE */}
                            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
                              {productImage ? (
                                <img
                                  src={
                                    productImage
                                  }
                                  alt={
                                    order
                                      .listing
                                      ?.title ||
                                    "Product"
                                  }
                                  className="size-full object-cover"
                                />
                              ) : (
                                <ImageIcon
                                  size={18}
                                  className="text-neutral-400"
                                />
                              )}
                            </div>

                            {/* PRODUCT INFO */}
                            <div className="min-w-0">
                              <p className="max-w-[280px] truncate font-medium text-neutral-900">
                                {order.listing
                                  ?.title ||
                                  "Product name unavailable"}
                              </p>

                              {(order.listing
                                ?.brand ||
                                order.listing
                                  ?.model) && (
                                <p className="mt-1 max-w-[280px] truncate text-xs text-neutral-400">
                                  {[
                                    order
                                      .listing
                                      ?.brand,
                                    order
                                      .listing
                                      ?.model,
                                  ]
                                    .filter(
                                      Boolean,
                                    )
                                    .join(
                                      " • ",
                                    )}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* =====================
                            SELLER
                        ===================== */}
                        <td className="px-6 py-5 text-neutral-600">
                          {sellerName ||
                            "Name unavailable"}
                        </td>

                        {/* =====================
                            PRICE
                        ===================== */}
                        <td className="whitespace-nowrap px-6 py-5 font-semibold text-neutral-900">
                          {formatPrice(
                            order.agreedPrice,
                          )}
                        </td>

                        {/* =====================
                            STATUS
                        ===================== */}
                        <td className="px-6 py-5">
                          <span
                            className={`
                              inline-flex
                              whitespace-nowrap
                              rounded-full
                              px-3 py-1
                              text-xs
                              font-medium
                              ${status.className}
                            `}
                          >
                            {status.label}
                          </span>
                        </td>

                        {/* =====================
                            ACTION
                        ===================== */}
                        <td className="px-6 py-5">
                          {queue ? (
                            <Link
                              to={
                                queue.path
                              }
                              className="
                                whitespace-nowrap
                                font-medium
                                text-orange-500
                                transition
                                hover:text-orange-600
                                hover:underline
                              "
                            >
                              Manage
                            </Link>
                          ) : (
                            <span className="text-neutral-400">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>

          {/* =====================================
              FOOTER
          ===================================== */}
          <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
            <p className="text-xs text-neutral-500">
              Showing{" "}
              {latestOrders.length.toLocaleString(
                "en-US",
              )}{" "}
              of{" "}
              {orders.length.toLocaleString(
                "en-US",
              )}{" "}
              orders
            </p>
          </div>
        </>
      )}
    </section>
  );
}

export default RecentOrders;