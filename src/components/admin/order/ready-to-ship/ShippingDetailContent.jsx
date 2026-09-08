import {
  ImageIcon,
  Package,
  UserRound,
} from "lucide-react";

function ShippingDetailContent({
  order,
  isVerified,
  isRejected,
  buyerName,
  sellerName,
}) {
  const listing = order.listing;
  const seller = order.seller;

  const images = listing?.images ?? [];

  const coverImage =
    images.find((image) => image.isCover) ||
    images[0];

  return (
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
                src={coverImage.imageUrl}
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
                value={listing?.location}
              />
            </div>

            {listing?.description && (
              <div className="mt-5">
                <p className="text-xs font-medium text-neutral-400">
                  Product Description
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                  {listing.description}
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

export default ShippingDetailContent;