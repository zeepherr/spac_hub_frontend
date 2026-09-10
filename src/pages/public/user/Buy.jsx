import DashboardStatCard from "@/components/userDashboard/DashboardStatCard";
import PendingReceipt from "@/components/userDashboard/PendingReceipt";
import RecentOrders from "@/components/userDashboard/RecentOrders";
import { useBuyingOrders } from "@/hook/order/useBuyingOrders";
import useAuthStore from "@/stores/auth.store";
import {
  Clock3,
  PackageCheck,
  PackageOpen,
  ShoppingBag,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useMyCart } from "../../../hook/cart/useMyCart";

const FINISHED_ORDER_STATUSES = new Set([
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
  "REFUNDED",
]);

const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

const STAT_CARD_HIGHLIGHT =
  "border-orange-200/70 bg-gradient-to-br from-orange-50/70 to-white/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(249,115,22,0.08)]";
const STAT_CARD_NEUTRAL =
  "border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

function mapOrderForDashboard(order) {
  const images = order.listing?.images ?? [];

  const coverImage = images.find((image) => image.isCover) ?? images[0];

  return {
    id: order.id,
    orderNumber: order.orderNumber,

    productName:
      order.listing?.title ||
      [order.listing?.brand, order.listing?.model].filter(Boolean).join(" ") ||
      "Untitled Item",

    productImageUrl: coverImage?.imageUrl || coverImage?.url || "",

    price: Number(order.agreedPrice ?? 0),
    status: order.status,
    createdAt: order.createdAt,
  };
}

function Buy() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const {
    data: buyingOrders = [],
    isPending,
    isError,
    refetch,
  } = useBuyingOrders();

  const displayName = user?.firstName || user?.email || "User";

  const totalOrders = buyingOrders.length;

  const processingOrders = buyingOrders.filter(
    (order) =>
      !FINISHED_ORDER_STATUSES.has(order.status) &&
      order.status !== "AWAITING_PAYMENT" &&
      order.status !== "SHIPPING_TO_BUYER",
  ).length;

  const shippingOrders = buyingOrders.filter(
    (order) => order.status === "SHIPPING_TO_BUYER",
  ).length;

  const actionItems = buyingOrders
    .filter((order) =>
      ["AWAITING_PAYMENT", "PENDING_PAYMENT", "SHIPPING_TO_BUYER"].includes(
        order.status,
      ),
    )
    .map((order) => {
      const mappedOrder = mapOrderForDashboard(order);

      const needsPayment =
        order.status === "AWAITING_PAYMENT" ||
        order.status === "PENDING_PAYMENT";

      const hasBeenDelivered =
        order.status === "SHIPPING_TO_BUYER" &&
        Boolean(order.deliveryShipment?.deliveredAt);

      if (needsPayment) {
        return {
          ...mappedOrder,
          actionType: "PAYMENT",
          actionLabel: "Pay Now",
          statusLabel: "PAYMENT REQUIRED",
          message: "Complete payment to continue your order.",
        };
      }

      if (hasBeenDelivered) {
        return {
          ...mappedOrder,
          actionType: "CONFIRM_DELIVERY",
          actionLabel: "Confirm Delivery",
          statusLabel: "DELIVERED",
          message: "Your item has arrived. Please confirm receipt.",
        };
      }

      return {
        ...mappedOrder,
        actionType: "VIEW_ORDER",
        actionLabel: "View Order",
        statusLabel: "SHIPPING",
        message:
          "Your item is on the way. Open the order to view shipping details.",
      };
    });
  /*
   * แสดง Order ล่าสุดสูงสุด 2 รายการ
   */
  const recentOrders = buyingOrders.map(mapOrderForDashboard);

  /* ข้อมูลสำหรับการ์ดสรุปด้านบน */
  const stats = [
    {
      id: "cart",
      label: "Cart",
      value: useMyCart().data?.length,
      unit: "Items",
      icon: ShoppingCart,

      cardClassName: STAT_CARD_HIGHLIGHT,

      iconClassName: "bg-orange-100/80 text-orange-500",

      watermarkClassName: "text-orange-500",

      actionText: "View cart",

      onClick: () => navigate("/cart"),
    },

    {
      id: "all-orders",
      label: "Total Orders",
      value: totalOrders,
      unit: "Items",
      icon: PackageOpen,

      cardClassName: STAT_CARD_NEUTRAL,

      iconClassName: "bg-neutral-100/80 text-neutral-900",

      watermarkClassName: "text-neutral-500",

      actionText: "View orders",

      onClick: () => navigate("/user/orders"),
    },

    {
      id: "processing",
      label: "Processing",
      value: processingOrders,
      unit: "Items",
      icon: Clock3,

      cardClassName: STAT_CARD_HIGHLIGHT,

      iconClassName: "bg-orange-100/80 text-orange-500",

      watermarkClassName: "text-orange-500",

      actionText: "View details",

      onClick: () => navigate("/user/orders?status=processing"),
    },

    {
      id: "shipping",
      label: "Shipping",
      value: shippingOrders,
      unit: "Items",
      icon: Truck,

      cardClassName: STAT_CARD_NEUTRAL,

      iconClassName: "bg-neutral-100/80 text-neutral-900",

      watermarkClassName: "text-neutral-500",

      actionText: "Track shipment",

      onClick: () => navigate("/user/orders?status=shipping"),
    },
  ];

  if (isPending) {
    return (
      <div className="flex min-h-96 items-center justify-center gap-3">
        <Clock3 size={30} className="animate-pulse text-orange-500" />

        <span className="text-sm text-neutral-500">Loading Dashboard...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500">Unable to load order data.</p>

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
    <section className="min-h-full bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(0deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold text-neutral-900 sm:text-3xl">
              Hello, <span className="text-orange-500">{displayName}</span> 👋
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Track your orders and activity
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition sm:w-auto ${CTA_GLASS}`}
          >
            <ShoppingBag size={20} />
            Shop Now
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {stats.map((stat) => (
            <DashboardStatCard key={stat.id} {...stat} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
          {/* ตรงนี้คือส่วนของ Pay now */}
          <PendingReceipt
            orders={actionItems}
            icon={PackageCheck}
            onViewAll={() => navigate("/user/orders")}
            onConfirm={(order) => {
              if (order.actionType === "PAYMENT") {
                navigate(`/user/orders/${order.id}`);
                return;
              }

              navigate(`/user/orders/${order.id}`);
            }}
          />

          <RecentOrders
            orders={recentOrders}
            onViewAll={() => navigate("/user/orders")}
            onSelectOrder={(orderId) => navigate(`/user/orders/${orderId}`)}
          />
        </div>
      </div>
    </section>
  );
}

export default Buy;
