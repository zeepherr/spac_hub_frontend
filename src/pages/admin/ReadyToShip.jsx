import { useMemo, useState } from "react";
import {
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router";

import { useAdminOrders } from "@/hook/order/useAdminOrder";

function ReadyToShip() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const ordersQuery = useAdminOrders({
    statuses: ["VERIFIED", "REJECTED"],
  });

  const orders = ordersQuery.data ?? [];

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return orders.filter((order) => {
      const listing = order.listing;

      const matchesSearch =
        !keyword ||
        order.orderNumber?.toLowerCase().includes(keyword) ||
        listing?.title?.toLowerCase().includes(keyword) ||
        listing?.brand?.toLowerCase().includes(keyword) ||
        listing?.model?.toLowerCase().includes(keyword);

      const matchesFilter =
        filter === "ALL" || order.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  if (ordersQuery.isPending) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <LoaderCircle
          size={30}
          className="animate-spin text-orange-500"
        />

        <span className="ml-3 text-sm text-neutral-500">
          กำลังโหลดข้อมูล...
        </span>
      </div>
    );
  }

  if (ordersQuery.isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">
            ไม่สามารถโหลดข้อมูลได้
          </p>

          <button
            type="button"
            onClick={() => ordersQuery.refetch()}
            className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
              <PackageCheck
                size={22}
                className="text-orange-500"
              />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                พร้อมจัดส่ง
              </h1>

              <p className="mt-1 text-xs text-neutral-500">
                จัดการสินค้าที่ตรวจสอบเรียบร้อยแล้ว
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => ordersQuery.refetch()}
            disabled={ordersQuery.isFetching}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                ordersQuery.isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            รีเฟรช
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="mb-5 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="ค้นหา Order, สินค้า, Brand หรือ Model"
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* FILTER */}
            <div className="flex gap-2">
              <FilterButton
                active={filter === "ALL"}
                onClick={() => setFilter("ALL")}
              >
                ทั้งหมด
              </FilterButton>

              <FilterButton
                active={filter === "VERIFIED"}
                onClick={() =>
                  setFilter("VERIFIED")
                }
              >
                รอส่งผู้ซื้อ
              </FilterButton>

              <FilterButton
                active={filter === "REJECTED"}
                onClick={() =>
                  setFilter("REJECTED")
                }
              >
                รอคืนผู้ขาย
              </FilterButton>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/60 text-left">
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                    ออเดอร์
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                    สินค้า
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                    ราคาซื้อขาย
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                    สถานะ
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500">
                    จัดการ
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length === 0 ? (
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
                        ไม่พบรายการสินค้า
                      </p>

                      <p className="mt-1 text-xs text-neutral-400">
                        ลองเปลี่ยนคำค้นหาหรือตัวกรอง
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onOpen={() =>
                        navigate(
                          `/admin/orders/ready-to-ship/${order.id}`,
                        )
                      }
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order, onOpen }) {
  const listing = order.listing;

  const images = listing?.images ?? [];

  const coverImage =
    images.find((image) => image.isCover)
      ?.imageUrl ||
    images[0]?.imageUrl ||
    null;

  const isVerified =
    order.status === "VERIFIED";

  return (
    <tr className="border-b border-neutral-100 last:border-b-0 transition hover:bg-neutral-50/60">
      {/* ORDER */}
      <td className="px-6 py-4">
        <div className="min-w-[220px]">
          <p className="text-sm font-semibold text-neutral-900">
            {order.orderNumber}
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            {formatDate(order.createdAt)}
          </p>
        </div>
      </td>

      {/* PRODUCT */}
      <td className="px-6 py-4">
        <div className="flex min-w-[280px] items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
            {coverImage ? (
              <img
                src={coverImage}
                alt={listing?.title || "Product"}
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

      {/* PRICE */}
      <td className="px-6 py-4">
        <p className="whitespace-nowrap text-sm font-semibold text-neutral-900">
          {formatPrice(order.agreedPrice)}
        </p>
      </td>

      {/* STATUS */}
      <td className="px-6 py-4">
        {isVerified ? (
          <span className="inline-flex whitespace-nowrap rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
            ผ่านการตรวจ
          </span>
        ) : (
          <span className="inline-flex whitespace-nowrap rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600">
            ไม่ผ่านการตรวจ
          </span>
        )}
      </td>

      {/* ACTION */}
      <td className="px-6 py-4 text-right">
        {isVerified ? (
          <button
            type="button"
            onClick={onOpen}
            className="min-w-[130px] rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            จัดส่งสินค้า
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="min-w-[130px] rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            คืนสินค้า
          </button>
        )}
      </td>
    </tr>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 whitespace-nowrap rounded-xl border px-5 text-sm font-medium transition ${
        active
          ? "border-orange-500 bg-orange-500 text-white shadow-sm"
          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
      }`}
    >
      {children}
    </button>
  );
}

function formatPrice(price) {
  return `฿${Number(
    price || 0,
  ).toLocaleString("th-TH")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default ReadyToShip;