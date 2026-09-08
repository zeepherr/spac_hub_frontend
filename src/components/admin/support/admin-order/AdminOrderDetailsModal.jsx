import {
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  MapPin,
  Package,
  Store,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useEffect } from "react";

import {
  DetailCard,
  EmptyValue,
  InfoSection,
  ModalInfoRow,
  OrderStatusBadge,
  PersonCard,
} from "./AdminOrderDetailParts";
import {
  formatDate,
  formatPrice,
  getCoverImage,
  getProductName,
} from "./adminOrderContext.utils";

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
                <img src={coverImage} alt={productName} className="size-full object-cover" />
              ) : (
                <Package size={34} className="text-neutral-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-neutral-900">{productName}</h3>
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
            <DetailCard icon={CalendarDays} label="Order date" value={formatDate(order.createdAt)} />
            <DetailCard
              icon={CircleDollarSign}
              label="Payment status"
              value={order.checkout?.payment?.status || order.checkout?.status || "Not available"}
            />
            <DetailCard icon={ClipboardCheck} label="Inspection" value={inspection?.result || "Not inspected"} />
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
                  <p className="leading-6">{address.address || "Address not available"}</p>
                </div>
              ) : (
                <EmptyValue text="No delivery address available" />
              )}
            </InfoSection>

            <InfoSection icon={Truck} title="Shipment">
              {shipment ? (
                <dl className="space-y-3 text-sm">
                  <ModalInfoRow label="Carrier" value={shipment.carrier} />
                  <ModalInfoRow label="Tracking" value={shipment.trackingNumber} />
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

export default AdminOrderDetailsModal;
