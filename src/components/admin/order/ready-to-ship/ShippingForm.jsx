import { MapPin } from "lucide-react";

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

function ShippingForm({
  order,
  seller,
  buyerName,
  sellerName,
  isVerified,
  isRejected,
  isPending,
  form,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div>
      <form
        onSubmit={onSubmit}
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
            onChange={onChange}
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
            value={form.trackingNumber}
            onChange={onChange}
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
                {order.inspection?.notes ||
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
                  ? order.deliveryAddress
                      ?.recipientName ||
                    buyerName ||
                    "-"
                  : sellerName || "-"}
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                {isVerified
                  ? order.deliveryAddress
                      ?.address || "-"
                  : seller?.address || "-"}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                {isVerified
                  ? order.deliveryAddress
                      ?.phone || "-"
                  : seller?.phone || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={onCancel}
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
  );
}

export default ShippingForm;