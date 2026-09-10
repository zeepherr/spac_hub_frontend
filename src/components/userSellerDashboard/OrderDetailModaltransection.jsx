import React from "react";
import {
  X,
  Package,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { OrderProductImage } from "./OrderProductImage";

// เดียวกับ GLASS_MODAL/GLASS_IDLE ที่ใช้ทั้งเว็บ
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";
const GLASS_IDLE =
  "border border-neutral-200/70 bg-white/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)]";

export function OrderDetailModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const listing = order.listing || order.product || {};
  const title = listing.title || order.title || `Order #${order.id}`;
  const categoryName =
    listing.category?.name || order.categoryName || "General";
  const imagesSource =
    listing.images || listing.image || order.images || order.imageUrl;
  const price = Number(order.agreedPrice || order.totalPrice || 0);

  const getBuyerInfo = (ord) => {
    const buyer = ord.buyer || ord.user || ord.buyerUser || {};
    const name =
      buyer.name || buyer.fullName || buyer.username || buyer.firstName
        ? `${buyer.firstName || ""} ${buyer.lastName || ""}`.trim()
        : null || ord.buyerName || "N/A";

    const contact =
      buyer.email ||
      buyer.phone ||
      buyer.phoneNumber ||
      ord.buyerEmail ||
      ord.buyerPhone ||
      "No contact info";

    return { name, contact };
  };

  const getShippingAddress = (ord) => {
    const addr =
      ord.shippingAddress || ord.address || ord.deliveryAddress || {};
    const buyer = ord.buyer || ord.user || {};

    const receiverName =
      addr.receiverName ||
      addr.name ||
      addr.fullName ||
      buyer.name ||
      buyer.fullName ||
      "Recipient";

    let fullAddress = "No shipping address specified";
    if (typeof addr === "string") {
      fullAddress = addr;
    } else if (addr.fullAddress || addr.addressLine1 || addr.street) {
      const parts = [
        addr.fullAddress || addr.addressLine1 || addr.street,
        addr.addressLine2,
        addr.subdistrict || addr.subDistrict || addr.tambon,
        addr.district || addr.amphoe,
        addr.province,
        addr.postalCode || addr.zipCode,
      ].filter(Boolean);

      fullAddress = parts.join(", ");
    } else if (ord.fullAddress || ord.address) {
      fullAddress =
        typeof ord.address === "string"
          ? ord.address
          : ord.fullAddress || fullAddress;
    }

    const phone =
      addr.phone || addr.phoneNumber || addr.tel || ord.phone || null;

    return { receiverName, fullAddress, phone };
  };

  const buyerInfo = getBuyerInfo(order);
  const shippingInfo = getShippingAddress(order);

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: "Completed",
        };
      case "CANCELLED":
      case "REFUNDED":
      case "REJECTED":
        return {
          bg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: status,
        };
      default:
        return {
          bg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          icon: <Clock className="w-3.5 h-3.5" />,
          label: status,
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl transition-all transform scale-100 ${GLASS_MODAL}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-2xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Order Details
              </h2>
              <p className="text-xs text-neutral-400 font-medium">
                ID: #{order.id || "N/A"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Status & Date Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-neutral-200/70">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-semibold">
                Current Status:
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}
              >
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Product Info Card */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
              Product Info
            </h3>
            <div className="flex gap-4 p-4 bg-white/40 backdrop-blur-sm border border-neutral-200/70 rounded-2xl">
              <OrderProductImage
                images={imagesSource}
                title={title}
                className="w-20 h-20 rounded-xl"
              />
              <div className="flex-1 space-y-1.5 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-semibold text-[10px]">
                  {categoryName}
                </span>
                <h4 className="font-bold text-sm text-neutral-900 line-clamp-2 leading-tight">
                  {title}
                </h4>
                {listing.description && (
                  <p className="text-xs text-neutral-500 line-clamp-1 font-medium">
                    {listing.description}
                  </p>
                )}
                <p className="text-sm font-black text-orange-500 pt-1">
                  ฿{price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Buyer & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Buyer Details */}
            <div className="p-4 bg-white/40 backdrop-blur-sm border border-neutral-200/70 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Buyer Information</span>
              </div>
              <div className="text-xs space-y-1 pt-1">
                <p className="font-bold text-neutral-900 text-sm">
                  {buyerInfo.name}
                </p>
                <p className="text-neutral-500">{buyerInfo.contact}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-4 bg-white/40 backdrop-blur-sm border border-neutral-200/70 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Shipping Address</span>
              </div>
              <div className="text-xs space-y-1 pt-1">
                <p className="font-bold text-neutral-900">
                  {shippingInfo.receiverName}
                </p>
                <p className="text-neutral-500 leading-relaxed line-clamp-2">
                  {shippingInfo.fullAddress}
                </p>
                {shippingInfo.phone && (
                  <p className="text-neutral-400 font-medium">
                    Tel: {shippingInfo.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tracking Number (If available) */}
          {(order.trackingNumber || order.courier) && (
            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900">
                    {order.courier || "Shipment Tracking"}
                  </p>
                  <p className="text-xs font-extrabold text-orange-600 tracking-wide">
                    {order.trackingNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-neutral-200/70 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-400 uppercase tracking-wider pb-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment Summary</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>฿{price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping Fee</span>
                <span>
                  ฿{(Number(order.shippingFee) || 0).toLocaleString()}
                </span>
              </div>
              <div className="border-t border-neutral-200/70 pt-2 flex justify-between font-black text-sm text-neutral-900">
                <span>Total Amount</span>
                <span className="text-orange-500">
                  ฿{(price + (Number(order.shippingFee) || 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white/30 border-t border-neutral-200/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex cursor-pointer items-center rounded-xl px-6 py-2 text-sm font-bold text-neutral-700 transition hover:border-orange-300 hover:bg-orange-50/70 hover:text-orange-600 ${GLASS_IDLE}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
