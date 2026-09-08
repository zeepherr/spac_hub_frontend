import {
  FileText,
  ImageIcon,
  Package,
  UserRound,
} from "lucide-react";

function InspectionDetailContent({
  order,
}) {
  const listing = order.listing;
  const seller = order.seller;
  const images =
    listing?.images ?? [];

  const sellerName =
    `${seller?.firstName ?? ""} ${seller?.lastName ?? ""}`.trim() ||
    "-";

  const coverImage =
    images.find(
      (image) => image.isCover,
    )?.imageUrl ||
    images[0]?.imageUrl ||
    null;

  return (
    <div className="space-y-5">
      {/* ORDER */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <FileText size={19} />

          <h2 className="font-semibold text-neutral-900">
            Order Information
          </h2>
        </div>

        <div className="grid gap-x-14 gap-y-5 md:grid-cols-2">
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
            label="Order Date"
            value={formatDate(
              order.createdAt,
            )}
          />

          <div>
            <p className="text-xs text-neutral-400">
              Current Status
            </p>

            <div className="mt-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                {order.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SELLER */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <UserRound size={19} />

          <h2 className="font-semibold text-neutral-900">
            Seller Information
          </h2>
        </div>

        <div className="grid gap-x-14 gap-y-5 md:grid-cols-2">
          <Info
            label="Seller Name"
            value={sellerName}
          />

          <Info
            label="Email"
            value={seller?.email}
          />

          <Info
            label="Phone Number"
            value={seller?.phone}
          />

          <Info
            label="Seller ID"
            value={seller?.id}
          />
        </div>
      </section>

      {/* PRODUCT */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Package size={19} />

          <h2 className="font-semibold text-neutral-900">
            Product Information
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-[230px_1fr]">
          {/* COVER */}
          <div className="overflow-hidden rounded-xl bg-neutral-100">
            {coverImage ? (
              <img
                src={coverImage}
                alt={
                  listing?.title ||
                  "Product"
                }
                className="aspect-[4/3] h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center">
                <ImageIcon
                  size={36}
                  className="text-neutral-300"
                />
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {listing?.title || "-"}
            </h3>

            <div className="mt-6 grid gap-x-12 gap-y-5 sm:grid-cols-2">
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

              <div>
                <p className="text-xs text-neutral-400">
                  Estimated Condition
                </p>

                <div className="mt-2">
                  <ConditionBadge
                    condition={
                      listing?.estimatedCondition
                    }
                  />
                </div>
              </div>

              <Info
                label="Location"
                value={
                  listing?.location
                }
              />
            </div>
          </div>
        </div>

        {listing?.description && (
          <div className="mt-5 border-t border-neutral-100 pt-4">
            <p className="text-sm font-semibold text-neutral-800">
              Product Description
            </p>

            <p className="mt-2 text-sm leading-6 text-neutral-600">
              {listing.description}
            </p>
          </div>
        )}
      </section>

      {/* IMAGES */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <ImageIcon size={19} />

          <h2 className="font-semibold text-neutral-900">
            Product Images
          </h2>

          <span className="text-sm text-neutral-500">
            ({images.length} images)
          </span>
        </div>

        {images.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl bg-neutral-50">
            <span className="text-sm text-neutral-400">
              No product images
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {images.map(
              (image, index) => (
                <div
                  key={
                    image.id ?? index
                  }
                  className="h-32 w-32 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
                >
                  <img
                    src={
                      image.imageUrl
                    }
                    alt={`${listing?.title || "Product"} ${
                      index + 1
                    }`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-neutral-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-neutral-900">
        {value ?? "-"}
      </p>
    </div>
  );
}

function ConditionBadge({
  condition,
}) {
  if (!condition) {
    return (
      <span className="text-sm text-neutral-500">
        -
      </span>
    );
  }

  return (
    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
      {condition}
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

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(date));
}

export default InspectionDetailContent;