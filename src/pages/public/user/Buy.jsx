import {Clock3,PackageCheck,ShoppingBag,ShoppingCart,Truck,} from "lucide-react";
import { useNavigate } from "react-router";
import DashboardStatCard from "@/components/userDashboard/DashboardStatCard";
import PendingReceipt from "@/components/userDashboard/PendingReceipt";
import RecentMessages from "@/components/userDashboard/RecentMessages";
import RecentOrders from "@/components/userDashboard/RecentOrders";
import { useBuyingOrders } from "@/hook/order/useBuyingOrders";
import useAuthStore from "@/stores/auth.store";

const FINISHED_ORDER_STATUSES = new Set([
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
  "REFUNDED",
]);

/*
 * Mock data for backend API endpoints not yet implemented.
 * Remove and replace with actual queries when available.
 */

const recentMessagesMock = [
  {
    id: 1,
    senderName: "Tech Corner",
    senderImageUrl: "",
    message: "Hello! Your item is ready for shipment.",
    timeText: "20 mins ago",
    isUnread: true,
  },
  {
    id: 2,
    senderName: "NextGen Gadget",
    senderImageUrl: "",
    message: "Thank you! 🙏",
    timeText: "2 hours ago",
    isUnread: true,
  },
];

function mapOrderForDashboard(order) {
  const images = order.listing?.images ?? [];

  const coverImage = images.find((image) => image.isCover) ?? images[0];

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    productName:
      order.listing?.title ||
      [order.listing?.brand, order.listing?.model]
        .filter(Boolean)
        .join(" ") ||
      "Untitled Item",

    productImageUrl:
      coverImage?.imageUrl ||
      coverImage?.url ||
      "",

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
  console.log(buyingOrders);

  const displayName = user?.firstName || user?.email || "User";

  /* Total order count */
  const totalOrders = buyingOrders.length;

  /* In Progress: Count orders not in a finished state */
  const processingOrders =
    buyingOrders.filter(
      (order) => !FINISHED_ORDER_STATUSES.has(order.status)
    ).length;

  /* Shipping: Must have deliveryShipment and no delivery timestamp */
  const shippingOrders =
    buyingOrders.filter((order) => {
      const shipment = order.deliveryShipment;

      return shipment && !shipment.deliveredAt;
    }).length;

  /* Find order where item has arrived but buyer hasn't confirmed receipt */
  const orderWaitingForReceipt =
    buyingOrders.find((order) => {
      const shipment = order.deliveryShipment;

      return shipment?.deliveredAt && order.status !== "COMPLETED";
    });

  /* Map data for PendingReceipt */
  const pendingReceipt =
    orderWaitingForReceipt
      ? {
          id: orderWaitingForReceipt.id,
          orderNumber: orderWaitingForReceipt.orderNumber,
          productName:
            orderWaitingForReceipt.listing?.title || "Ordered Item",
          message:
            "Your order has arrived. Please confirm receipt.",
        }
      : null;

  /* Backend orders by createdAt desc; select top 3 */
  const recentOrders = buyingOrders
    .slice(0, 3)
    .map(mapOrderForDashboard);

  const stats = [
    {
      id: "cart",
      label: "Cart Items",
      value: 0,
      unit: "items",
      icon: ShoppingCart,
      iconClassName: "bg-emerald-50 text-emerald-600",
      onClick: () => navigate("/cart"),
    },
    {
      id: "all-orders",
      label: "Total Orders",
      value: totalOrders,
      unit: "items",
      icon: ShoppingBag,
      iconClassName: "bg-orange-50 text-orange-600",
      onClick: () => navigate("/user/orders"),
    },
    {
      id: "processing",
      label: "In Progress",
      value: processingOrders,
      unit: "items",
      icon: Clock3,
      iconClassName: "bg-amber-50 text-amber-600",
      onClick: () => navigate("/user/orders?status=processing"),
    },
    {
      id: "shipping",
      label: "In Transit",
      value: shippingOrders,
      unit: "items",
      icon: Truck,
      iconClassName: "bg-blue-50 text-blue-600",
      onClick: () => navigate("/user/orders?status=shipping"),
    },
  ];

  if (isPending) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Clock3 size={30} className="animate-pulse text-orange-500" />
        <span className="ml-3 text-sm text-neutral-500">
          Loading Dashboard...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500">
          Unable to load order data.
        </p>

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
        {/* Header & Shop Button */}
        <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Hello, {displayName} 👋
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Track your orders and activity
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/listings")}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <ShoppingBag size={20} />
            Shop Now
          </button>
        </header>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
              icon={stat.icon}
              iconClassName={stat.iconClassName}
              onClick={stat.onClick}
            />
          ))}
        </div>

        {/* Action Items + Recent Messages */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <PendingReceipt
            order={pendingReceipt}
            icon={PackageCheck}
            onConfirm={(orderId) => {
              /*
               * Confirmation API not implemented yet;
               * redirect to order details page.
               */
              navigate(`/user/orders/${orderId}`);
            }}
          />

          <RecentMessages
            messages={recentMessagesMock}
            onViewAll={() => navigate("/messages")}
          />
        </div>

        {/* Recent Orders */}
        <div className="mt-5">
          <RecentOrders
            orders={recentOrders}
            onViewAll={() => navigate("/user/orders")}
            onSelectOrder={(orderId) =>
              navigate(`/user/orders/${orderId}`)
            }
          />
        </div>
      </div>
    </section>
  );
}

export default Buy;