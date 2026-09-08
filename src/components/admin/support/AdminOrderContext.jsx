import {
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  ImageIcon,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Store,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useEffect } from "react";

const ORDER_STATUS_STYLES = {
  AWAITING_PAYMENT: "bg-amber-50 text-amber-700",
  PAID: "bg-emerald-50 text-emerald-700",
  SELLER_SHIPPING: "bg-amber-50 text-amber-700",
  SHIPPING_TO_ADMIN: "bg-blue-50 text-blue-700",
  RECEIVED_BY_ADMIN: "bg-violet-50 text-violet-700",
  INSPECTING: "bg-purple-50 text-purple-700",
  INSPECTION_PASSED: "bg-teal-50 text-teal-700",
  VERIFIED: "bg-teal-50 text-teal-700",
  SHIPPING_TO_BUYER: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
  REJECTED: "bg-red-50 text-red-700",
  REFUNDED: "bg-neutral-100 text-neutral-700",
};

function AdminOrderPreview({
  order,
  fallbackOrderNumber,
  supportCaseId,
  issueType,
  isPending,
  isError,
  hasFullDetails,
  onRetry,
  onViewDetails,
}) {
  if (isPending && !order) {
    return <OrderPreviewSkeleton />;
  }

  if (isError && !order) {
    return (
      <section className="flex shrink-0 items-center justify-between gap-4 rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-sm">
        <div className="min-w-0">
          <p className="text-sm font-bold text-neutral-900">
            Order details are unavailable
          </p>
          <p className="mt-1 truncate text-xs text-neutral-500">
            {fallbackOrderNumber || "Unable to load this order."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRetry()}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-red-200 px-3 text-xs font-bold text-red-600 transition hover:bg-red-50"
        >
          <RefreshCw size={15} />
          Retry
        </button>
      </section>
    );
  }

  if (!order) {
    return null;
  }

  const productName = getProductName(order);
  const coverImage = getCoverImage(order);

  return (
    <section className="shrink-0 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
          {coverImage ? (
            <img
              src={coverImage}
              alt={productName}
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon size={24} className="text-neutral-300" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="max-w-full truncate text-sm font-bold text-neutral-900">
              {productName}
            </h2>

            <OrderStatusBadge status={order.status} />
          </div>

          <p className="mt-1 truncate text-xs text-neutral-500">
            {order.orderNumber || fallbackOrderNumber || `Order #${order.id}`}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="font-bold text-orange-600">
              {formatPrice(order.agreedPrice)}
            </span>

            <span className="truncate text-neutral-500">
              Case #{supportCaseId} · {formatEnumLabel(issueType)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={isError ? () => onRetry() : onViewDetails}
          disabled={isPending || (!hasFullDetails && !isError)}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-neutral-900 px-4 text-xs font-bold text-white transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isError
            ? "Retry Order Details"
            : isPending
              ? "Loading Details..."
              : "View Order Details"}
          {isError ? <RefreshCw size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>
    </section>
  );
}

function AdminOrderDetailsModal({ isOpen, order, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) {
    return null;
  }

  const productName = getProductName(order);
  const coverImage = getCoverImage(order);
  const shipment = order.deliveryShipment;
  const address = order.deliveryAddress;
  const inspection = order.inspection;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/55 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-order-detail-title"
        className="flex max-h-[88dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Order details
            </p>
            <h2
              id="admin-order-detail-title"
              className="mt-1 truncate text-xl font-bold text-neutral-900"
            >
              {order.orderNumber || `Order #${order.id}`}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <OrderStatusBadge status={order.status} />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close order details"
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="chat-scrollbar min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <article className="flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center">
            <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={productName}
                  className="size-full object-cover"
                />
              ) : (
                <Package size={34} className="text-neutral-300" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-neutral-900">
                {productName}
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                {[order.listing?.brand, order.listing?.model]
                  .filter(Boolean)
                  .join(" · ") || "Product information unavailable"}
              </p>

              {order.listing?.description && (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500">
                  {order.listing.description}
                </p>
              )}

              <p className="mt-3 text-xl font-bold text-orange-600">
                {formatPrice(order.agreedPrice)}
              </p>
            </div>
          </article>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailCard
              icon={CalendarDays}
              label="Order date"
              value={formatDate(order.createdAt)}
            />
            <DetailCard
              icon={CircleDollarSign}
              label="Payment status"
              value={
                order.checkout?.payment?.status ||
                order.checkout?.status ||
                "Not available"
              }
            />
            <DetailCard
              icon={ClipboardCheck}
              label="Inspection"
              value={inspection?.result || "Not inspected"}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <PersonCard icon={UserRound} title="Buyer" person={order.buyer} />
            <PersonCard icon={Store} title="Seller" person={order.seller} />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <InfoSection icon={MapPin} title="Delivery address">
              {address ? (
                <div className="space-y-2 text-sm text-neutral-600">
                  <p className="font-semibold text-neutral-900">
                    {address.recipientName || "Recipient not available"}
                  </p>
                  <p>{address.phone || "Phone not available"}</p>
                  <p className="leading-6">
                    {address.address || "Address not available"}
                  </p>
                </div>
              ) : (
                <EmptyValue text="No delivery address available" />
              )}
            </InfoSection>

            <InfoSection icon={Truck} title="Shipment">
              {shipment ? (
                <dl className="space-y-3 text-sm">
                  <ModalInfoRow label="Carrier" value={shipment.carrier} />
                  <ModalInfoRow
                    label="Tracking"
                    value={shipment.trackingNumber}
                  />
                  <ModalInfoRow label="Status" value={shipment.status} />
                </dl>
              ) : (
                <EmptyValue text="No shipment information available" />
              )}
            </InfoSection>
          </div>
        </div>

        <footer className="flex shrink-0 justify-end border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 cursor-pointer rounded-xl bg-neutral-900 px-5 text-sm font-bold text-white transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}

function OrderStatusBadge({ status }) {
  const className =
    ORDER_STATUS_STYLES[status] || "bg-neutral-100 text-neutral-700";

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${className}`}
    >
      {formatEnumLabel(status || "Unknown")}
    </span>
  );
}

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <span className="flex size-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        <Icon size={18} />
      </span>
      <p className="mt-3 text-xs font-semibold text-neutral-400">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-neutral-800">
        {formatDisplayValue(value) || "-"}
      </p>
    </div>
  );
}

function PersonCard({ icon: Icon, title, person }) {
  return (
    <InfoSection icon={Icon} title={title}>
      <div className="space-y-3">
        <p className="font-bold text-neutral-900">
          {getPersonName(person, `Unknown ${title}`)}
        </p>

        <div className="space-y-2 text-sm text-neutral-500">
          <p className="flex items-center gap-2 break-all">
            <Mail size={15} className="shrink-0 text-neutral-400" />
            {person?.email || "Email not available"}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={15} className="shrink-0 text-neutral-400" />
            {person?.phone || person?.phoneNumber || "Phone not available"}
          </p>
        </div>
      </div>
    </InfoSection>
  );
}

function InfoSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-neutral-200 p-4">
      <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-3">
        <Icon size={18} className="text-orange-500" />
        <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ModalInfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="break-all text-right font-semibold text-neutral-800">
        {formatDisplayValue(value) || "-"}
      </dd>
    </div>
  );
}

function EmptyValue({ text }) {
  return <p className="text-sm text-neutral-400">{text}</p>;
}

function OrderPreviewSkeleton() {
  return (
    <div className="flex shrink-0 animate-pulse items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="size-16 shrink-0 rounded-xl bg-neutral-100" />
      <div className="min-w-0 flex-1">
        <div className="h-4 w-48 rounded bg-neutral-100" />
        <div className="mt-2 h-3 w-64 max-w-full rounded bg-neutral-100" />
        <div className="mt-2 h-3 w-36 rounded bg-neutral-100" />
      </div>
      <div className="h-10 w-36 rounded-xl bg-neutral-100" />
    </div>
  );
}

function getCoverImage(order) {
  const images = order?.listing?.images ?? [];
  const coverImage = images.find((image) => image.isCover) ?? images[0];

  return coverImage?.imageUrl || coverImage?.url || "";
}

function getProductName(order) {
  return (
    order?.listing?.title ||
    [order?.listing?.brand, order?.listing?.model].filter(Boolean).join(" ") ||
    "Untitled item"
  );
}

function getPersonName(person, fallback) {
  return (
    [person?.firstName, person?.lastName].filter(Boolean).join(" ") || fallback
  );
}

function formatPrice(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function formatEnumLabel(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDisplayValue(value) {
  if (!value) {
    return "";
  }

  const stringValue = String(value);

  if (stringValue.includes("_") || stringValue === stringValue.toUpperCase()) {
    return formatEnumLabel(stringValue);
  }

  return stringValue;
}

export { AdminOrderDetailsModal, AdminOrderPreview };
