import { useState } from "react";
import {
  ArrowLeft,
  ImageIcon,
  LoaderCircle,
  MapPin,
  Package,
  UserRound,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router";

import { useAdminOrderById } from "@/hook/order/useAdminOrderById";
import { useShipOrderToBuyer } from "@/hook/order/useShipOrderToBuyer";
import { useReturnOrderToSeller } from "@/hook/order/useReturnToSeller";

const THAI_CARRIERS = [
  "Thailand Post",
  "Kerry Express",
  "Flash Express",
  "J&T Express",
  "Ninja Van",
  "Shopee Xpress",
  "DHL Express",
  "SCG Express",
];

function ShippingDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const orderQuery =
    useAdminOrderById(orderId);

  const shipMutation =
    useShipOrderToBuyer();

  const returnMutation =
    useReturnOrderToSeller();

  const [form, setForm] = useState({
    carrier: "",
    trackingNumber: "",
  });

  const order = orderQuery.data;

  if (orderQuery.isPending) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <LoaderCircle
          size={30}
          className="animate-spin text-orange-500"
        />

        <span className="ml-3 text-sm text-neutral-500">
          Loading order details...
        </span>
      </div>
    );
  }

  if (orderQuery.isError || !order) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">
            Unable to load order details
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/orders/ready-to-ship",
              )
            }
            className="mt-4 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const isVerified =
    order.status === "VERIFIED";

  const isRejected =
    order.status === "REJECTED";

  const isPending =
    shipMutation.isPending ||
    returnMutation.isPending;

  const listing = order.listing;

  const buyer = order.buyer;
  const seller = order.seller;

  const buyerName = [
    buyer?.firstName,
    buyer?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const sellerName = [
    seller?.firstName,
    seller?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const images = listing?.images ?? [];

  const coverImage =
    images.find((image) => image.isCover) ||
    images[0];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      carrier: form.carrier,
      trackingNumber:
        form.trackingNumber.trim(),
    };

    /*
     * ===========================
     * Ship product to Buyer
     * ===========================
     */
    if (isVerified) {
      shipMutation.mutate(
        {
          orderId: Number(orderId),
          payload,
        },
        {
          onSuccess: () => {
            navigate(
              "/admin/orders/summary",
            );
          },
        },
      );

      return;
    }

    /*
     * ===========================
     * Return product to Seller
     * ===========================
     */
    if (isRejected) {
      returnMutation.mutate(
        {
          orderId: Number(orderId),
          payload,
        },
        {
          onSuccess: () => {
            navigate(
              "/admin/orders/summary",
            );
          },
        },
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1450px]">
        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/orders/ready-to-ship",
            )
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={17} />
          Back to Ready to Ship
        </button>

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {isVerified
                ? "Ship Product to Buyer"
                : "Return Product to Seller"}
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              {order.orderNumber}
            </p>
          </div>

          <StatusBadge
            status={order.status}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
          {/* ======================
              LEFT
          ======================= */}
          <div className="space-y-5">
            {/* ORDER */}
            <Card
              title="Order Information"
              icon={Package}
            >
              <InfoGrid>
                <Info
                  label="Order Number"
                  value={order.orderNumber}
                />

                <Info
                  label="Price"
                  value={formatPrice(
                    order.agreedPrice,
                  )}
                />

                <Info
                  label="Status"
                  value={
                    isVerified
                      ? "Inspection Passed"
                      : "Inspection Failed"
                  }
                />

                <Info
                  label="Order Date"
                  value={formatDate(
                    order.createdAt,
                  )}
                />
              </InfoGrid>
            </Card>

            {/* BUYER */}
            {isVerified && (
              <Card
                title="Buyer Information"
                icon={UserRound}
              >
                <InfoGrid>
                  <Info
                    label="Buyer Name"
                    value={buyerName}
                  />

                  <Info
                    label="Recipient Name"
                    value={
                      order.deliveryAddress
                        ?.recipientName
                    }
                  />

                  <Info
                    label="Phone Number"
                    value={
                      order.deliveryAddress
                        ?.phone
                    }
                  />

                  <Info
                    label="Shipping Address"
                    value={
                      order.deliveryAddress
                        ?.address
                    }
                    full
                  />
                </InfoGrid>
              </Card>
            )}

            {/* SELLER */}
            {isRejected && (
              <Card
                title="Seller Information"
                icon={UserRound}
              >
                <InfoGrid>
                  <Info
                    label="Seller Name"
                    value={sellerName}
                  />

                  <Info
                    label="Seller ID"
                    value={seller?.id}
                  />

                  <Info
                    label="Phone Number"
                    value={seller?.phone}
                  />

                  <Info
                    label="Return Address"
                    value={seller?.address}
                    full
                  />
                </InfoGrid>
              </Card>
            )}

            {/* PRODUCT */}
            <Card
              title="Product Information"
              icon={Package}
            >
              <div className="flex flex-col gap-5 md:flex-row">
                <div className="h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                  {coverImage?.imageUrl ? (
                    <img
                      src={
                        coverImage.imageUrl
                      }
                      alt={
                        listing?.title ||
                        "Product"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon
                        size={32}
                        className="text-neutral-300"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {listing?.title || "-"}
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    {listing?.brand || "-"}
                    {listing?.category?.name
                      ? ` • ${listing.category.name}`
                      : ""}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <Info
                      label="Brand"
                      value={listing?.brand}
                    />

                    <Info
                      label="Model"
                      value={listing?.model}
                    />

                    <Info
                      label="Category"
                      value={
                        listing?.category
                          ?.name
                      }
                    />

                    <Info
                      label="Price"
                      value={formatPrice(
                        order.agreedPrice,
                      )}
                    />

                    <Info
                      label="Estimated Condition"
                      value={
                        listing?.estimatedCondition
                      }
                    />

                    {isVerified && (
                      <>
                        <Info
                          label="Verified Condition"
                          value={
                            order.inspection
                              ?.verifiedCondition
                          }
                        />

                        <Info
                          label="Condition Score"
                          value={
                            order.inspection
                              ?.verifiedScore !==
                            null
                              ? `${order.inspection?.verifiedScore}/100`
                              : "-"
                          }
                        />
                      </>
                    )}

                    <Info
                      label="Location"
                      value={
                        listing?.location
                      }
                    />
                  </div>

                  {listing?.description && (
                    <div className="mt-5">
                      <p className="text-xs font-medium text-neutral-400">
                        Product Description
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                        {
                          listing.description
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* IMAGES */}
            <Card
              title="Product Images"
              icon={ImageIcon}
            >
              {images.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  No product images
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative h-28 w-28 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
                    >
                      <img
                        src={image.imageUrl}
                        alt="Product"
                        className="h-full w-full object-cover"
                      />

                      {image.isCover && (
                        <span className="absolute bottom-2 left-2 rounded-md bg-orange-500 px-2 py-1 text-[10px] font-semibold text-white">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ======================
              RIGHT
          ======================= */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="sticky top-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-neutral-900">
                {isVerified
                  ? "Shipping Information"
                  : "Return Information"}
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                {isVerified
                  ? "Enter the shipment details for delivery to the buyer."
                  : "Enter the shipment details for returning the product to the seller."}
              </p>

              {/* CARRIER */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Carrier
                </label>

                <select
                  name="carrier"
                  value={form.carrier}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">
                    Select Carrier
                  </option>

                  {THAI_CARRIERS.map(
                    (carrier) => (
                      <option
                        key={carrier}
                        value={carrier}
                      >
                        {carrier}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* TRACKING */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Tracking Number
                </label>

                <textarea
                  name="trackingNumber"
                  value={
                    form.trackingNumber
                  }
                  onChange={handleChange}
                  required
                  minLength={
                    isVerified ? 5 : 3
                  }
                  maxLength={
                    isVerified
                      ? 100
                      : 150
                  }
                  rows={3}
                  placeholder="e.g. TH123456789"
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* FAILED INSPECTION NOTE */}
              {isRejected && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-600">
                    Inspection Notes
                  </p>

                  <p className="mt-1 text-xs text-red-400">
                    Notes recorded by the admin during product inspection.
                  </p>

                  <div className="mt-3 min-h-24 rounded-lg border border-red-100 bg-white p-3">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                      {order.inspection
                        ?.notes ||
                        "No inspection notes"}
                    </p>
                  </div>
                </div>
              )}

              {/* DESTINATION */}
              <div className="mt-5 rounded-xl bg-neutral-50 p-4">
                <div className="flex gap-3">
                  <MapPin
                    size={18}
                    className={
                      isVerified
                        ? "mt-0.5 shrink-0 text-orange-500"
                        : "mt-0.5 shrink-0 text-red-500"
                    }
                  />

                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {isVerified
                        ? "Ship To"
                        : "Return To"}
                    </p>

                    <p className="mt-2 text-sm font-medium text-neutral-700">
                      {isVerified
                        ? order
                            .deliveryAddress
                            ?.recipientName ||
                          buyerName ||
                          "-"
                        : sellerName ||
                          "-"}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {isVerified
                        ? order
                            .deliveryAddress
                            ?.address ||
                          "-"
                        : seller?.address ||
                          "-"}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {isVerified
                        ? order
                            .deliveryAddress
                            ?.phone ||
                          "-"
                        : seller?.phone ||
                          "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    navigate(
                      "/admin/orders/ready-to-ship",
                    )
                  }
                  className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isVerified
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {isPending
                    ? "Processing..."
                    : isVerified
                      ? "Confirm Shipment"
                      : "Confirm Return"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        {Icon && (
          <Icon
            size={18}
            className="text-orange-500"
          />
        )}

        <h2 className="text-base font-semibold text-neutral-900">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function InfoGrid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      {children}
    </div>
  );
}

function Info({
  label,
  value,
  full = false,
}) {
  return (
    <div
      className={
        full ? "sm:col-span-2" : ""
      }
    >
      <p className="text-xs font-medium text-neutral-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-neutral-800">
        {value || "-"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "VERIFIED") {
    return (
      <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
        Inspection Passed
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-600">
        Inspection Failed
      </span>
    );
  }

  return (
    <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-600">
      {status}
    </span>
  );
}

function formatPrice(price) {
  return `฿${Number(
    price || 0,
  ).toLocaleString("th-TH")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default ShippingDetail;