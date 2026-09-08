import { hasUnreadSupportMessage } from "@/components/support/support.constants";
import { useBuyingOrders } from "@/hook/order/useBuyingOrders";
import { useMySupportCases } from "@/hook/support/useMySupportCases";
import useAuthStore from "@/stores/auth.store";
import {
  ChevronDown,
  ChevronRight,
  LoaderCircle,
  MessageSquareText,
  PackageOpen,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import BackButton from "./BackButton";
const FINISHED_STATUSES = new Set([
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
  "REFUNDED",
]);

/* สถานะที่ถือว่ายกเลิกหรือไม่สำเร็จ */
const CANCELLED_STATUSES = new Set(["CANCELLED", "REJECTED", "REFUNDED"]);

/* ข้อความและสีที่ใช้แสดงสถานะ */
const ORDER_STATUS_CONFIG = {
  AWAITING_PAYMENT: {
    label: "Awaiting Payment",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },

  PAID: {
    label: "Paid",
    className: "bg-orange-50 text-orange-600 ring-orange-200",
  },

  SELLER_SHIPPING: {
    label: "Seller Shipping",
    className: "bg-violet-50 text-violet-600 ring-violet-200",
  },

  SHIPPING_TO_ADMIN: {
    label: "Shipping to Admin",
    className: "bg-violet-50 text-violet-600 ring-violet-200",
  },

  RECEIVED_BY_ADMIN: {
    label: "Received by Admin",
    className: "bg-indigo-50 text-indigo-600 ring-indigo-200",
  },

  INSPECTING: {
    label: "Inspecting",
    className: "bg-purple-50 text-purple-600 ring-purple-200",
  },

  INSPECTION_PASSED: {
    label: "Inspection Passed",
    className: "bg-teal-50 text-teal-600 ring-teal-200",
  },

  SHIPPING_TO_BUYER: {
    label: "Shipping",
    className: "bg-blue-50 text-blue-600 ring-blue-200",
  },

  COMPLETED: {
    label: "Completed",
    className: "bg-green-50 text-green-600 ring-green-200",
  },

  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 ring-red-200",
  },

  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-600 ring-red-200",
  },

  REFUNDED: {
    label: "Refunded",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

/* ตรวจสอบว่า Order อยู่ในหมวดที่เลือกหรือไม่ */
function isOrderInCategory(order, category) {
  const status = order.status;

  if (category === "awaiting-payment") {
    return status === "AWAITING_PAYMENT";
  }

  if (category === "shipping") {
    return status === "SHIPPING_TO_BUYER";
  }

  if (category === "completed") {
    return status === "COMPLETED";
  }

  if (category === "cancelled") {
    return CANCELLED_STATUSES.has(status);
  }

  if (category === "processing") {
    return (
      status !== "AWAITING_PAYMENT" &&
      status !== "SHIPPING_TO_BUYER" &&
      !FINISHED_STATUSES.has(status)
    );
  }

  // category === "all"
  return true;
}

function BuyingOrders() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const { data: supportCases = [] } = useMySupportCases();

  const supportCaseByOrderId = useMemo(() => {
    return new Map(
      supportCases.map((supportCase) => [
        String(supportCase.orderId),
        supportCase,
      ]),
    );
  }, [supportCases]);

  const [searchParams, setSearchParams] = useSearchParams();

  /* อ่านหมวดจาก URL ตัวอย่าง: /user/orders?status=shipping*/
  const selectedStatus = searchParams.get("status") || "all";

  /* State สำหรับช่องค้นหาและการเรียงลำดับ */
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const { data: orders = [], isPending, isError, refetch } = useBuyingOrders();

  /*จำนวนรายการในแต่ละหมวด*/
  const categoryCounts = useMemo(
    () => ({
      all: orders.length,

      "awaiting-payment": orders.filter((order) =>
        isOrderInCategory(order, "awaiting-payment"),
      ).length,

      processing: orders.filter((order) =>
        isOrderInCategory(order, "processing"),
      ).length,

      shipping: orders.filter((order) => isOrderInCategory(order, "shipping"))
        .length,

      completed: orders.filter((order) => isOrderInCategory(order, "completed"))
        .length,

      cancelled: orders.filter((order) => isOrderInCategory(order, "cancelled"))
        .length,
    }),
    [orders],
  );

  /*
   * ข้อมูลของแต่ละ Tab
   */
  const categories = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "awaiting-payment",
      label: "Awaiting Payment",
    },
    {
      value: "processing",
      label: "Processing",
    },
    {
      value: "shipping",
      label: "Shipping",
    },
    {
      value: "completed",
      label: "Completed",
    },
    {
      value: "cancelled",
      label: "Cancelled",
    },
  ];

  /* กรอง + ค้นหา + เรียงลำดับ */
  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return orders
      .filter((order) => isOrderInCategory(order, selectedStatus))
      .filter((order) => {
        if (!normalizedSearch) {
          return true;
        }

        const orderNumber = order.orderNumber?.toLowerCase() || "";
        const title = order.listing?.title?.toLowerCase() || "";
        const brand = order.listing?.brand?.toLowerCase() || "";
        const model = order.listing?.model?.toLowerCase() || "";

        return (
          orderNumber.includes(normalizedSearch) ||
          title.includes(normalizedSearch) ||
          brand.includes(normalizedSearch) ||
          model.includes(normalizedSearch)
        );
      })
      .sort((firstOrder, secondOrder) => {
        const firstDate = new Date(firstOrder.createdAt).getTime();
        const secondDate = new Date(secondOrder.createdAt).getTime();

        if (sortOrder === "oldest") {
          return firstDate - secondDate;
        }

        return secondDate - firstDate;
      });
  }, [orders, selectedStatus, searchText, sortOrder]);

  const handleCategoryChange = (category) => {
    if (category === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({
      status: category,
    });
  };

  if (isPending) {
    return (
      <div className="flex min-h-96 items-center justify-center gap-3">
        <LoaderCircle size={28} className="animate-spin text-orange-500" />

        <span className="text-sm text-neutral-500">Loading orders...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <p className="text-red-500">Unable to load your orders.</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-xl border border-orange-500 px-5 py-2.5 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-full bg-neutral-50 px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <BackButton />
        {/* หัวข้อของหน้า */}
        <header className="mb-7">
          <h1 className="text-3xl font-bold text-neutral-900">My Orders</h1>

          <p className="mt-2 text-sm text-neutral-500">
            View and track all your purchases
          </p>
        </header>

        {/* แถบเลือกหมวดหมู่ */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max items-center justify-between gap-2 lg:min-w-full">
            {categories.map((category) => {
              const isActive = selectedStatus === category.value;

              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleCategoryChange(category.value)}
                  className={`flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition lg:flex-1 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-neutral-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {category.label}

                  <span
                    className={`flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-xs ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {categoryCounts[category.value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {/* ช่องค้นหาและเรียงลำดับ */}
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
            <Search size={20} className="shrink-0 text-neutral-400" />

            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by order number or product name..."
              className="h-14 w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </label>

          <label className="relative rounded-2xl border border-neutral-200 bg-white px-5 shadow-sm">
            <span className="absolute left-5 top-2 text-xs text-neutral-400">
              Sort by
            </span>

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="h-14 w-full cursor-pointer appearance-none bg-transparent pt-4 text-sm font-semibold text-neutral-800 outline-none"
            >
              <option value="newest">Most Recent</option>
              <option value="oldest">Oldest First</option>
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </label>
        </div>

        {/* รายการคำสั่งซื้อ */}
        <div className="mt-5">
          {filteredOrders.length === 0 ? (
            <EmptyOrders hasSearchText={Boolean(searchText.trim())} />
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const supportCase = supportCaseByOrderId.get(String(order.id));

                const hasUnreadSupport = hasUnreadSupportMessage(
                  supportCase,
                  currentUser?.id,
                );

                return (
                  <OrderRow
                    key={order.id}
                    order={order}
                    hasUnreadSupport={hasUnreadSupport}
                    onClick={() => navigate(`/user/orders/${order.id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function OrderRow({ order, onClick, hasUnreadSupport = false }) {
  /* หารูปปก ถ้าไม่มีให้ใช้รูปแรก */
  const images = order.listing?.images ?? [];

  const coverImage = images.find((image) => image.isCover) ?? images[0];

  const imageUrl = coverImage?.imageUrl || coverImage?.url || "";

  /* หาชื่อสินค้า */
  const productName =
    order.listing?.title ||
    [order.listing?.brand, order.listing?.model].filter(Boolean).join(" ") ||
    "Untitled Item";

  /* แปลงวันที่เป็นรูปแบบภาษาอังกฤษ */
  const createdAt = order.createdAt
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(order.createdAt))
    : "-";

  /* เลือกข้อความและสีของสถานะ */
  const status = ORDER_STATUS_CONFIG[order.status] ?? {
    label: order.status || "Unknown",
    className: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full cursor-pointer grid-cols-[76px_minmax(0,1fr)_20px] items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md sm:grid-cols-[84px_minmax(0,1fr)_140px_180px_24px] sm:p-5"
    >
      {/* รูปสินค้า */}
      <div className="flex size-19 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 sm:size-20">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            className="size-full object-cover"
          />
        ) : (
          <PackageOpen size={30} className="text-neutral-400" />
        )}
      </div>

      {/* เลขคำสั่งซื้อ ชื่อสินค้า และวันที่ */}
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-xs font-medium text-neutral-400">
            {order.orderNumber}
          </p>

          {hasUnreadSupport && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-orange-500" />
              </span>
              <MessageSquareText size={12} />
              New message
            </span>
          )}
        </div>

        <h2 className="mt-1 truncate font-semibold text-neutral-900">
          {productName}
        </h2>

        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Ordered on {createdAt}
        </p>

        {/* ราคาและสถานะสำหรับหน้าจอมือถือ */}
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:hidden">
          <p className="font-bold text-neutral-900">
            ฿{Number(order.agreedPrice ?? 0).toLocaleString("th-TH")}
          </p>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${status.className}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* ราคาสำหรับหน้าจอใหญ่ */}
      <p className="hidden font-bold text-neutral-900 sm:block sm:text-right">
        ฿{Number(order.agreedPrice ?? 0).toLocaleString("th-TH")}
      </p>

      {/* สถานะสำหรับหน้าจอใหญ่ */}
      <div className="hidden sm:text-right md:block">
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <ChevronRight size={20} className="shrink-0 text-neutral-400" />
    </button>
  );
}

function EmptyOrders({ hasSearchText }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <span className="flex size-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
        <PackageOpen size={30} />
      </span>

      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        {hasSearchText ? "No matching orders" : "No orders in this category"}
      </h2>

      <p className="mt-2 text-sm text-neutral-500">
        {hasSearchText
          ? "Try searching with another order number or product name."
          : "Your orders will appear here when they are available."}
      </p>
    </div>
  );
}

export default BuyingOrders;
