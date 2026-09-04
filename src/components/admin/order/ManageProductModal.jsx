function ManageProductModal({ order, onClose }) {
  const shipment = getSellerShipment(order);
  const coverImage = getCoverImage(order);
  const shipmentStatus = getShipmentStatus(shipment?.status);

  const receiveOrderMutation = useReceiveOrderFromSeller();

  const handleReceive = () => {
    receiveOrderMutation.mutate(
      {
        orderId: order.id,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-neutral-900">
            จัดการสินค้า
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={receiveOrderMutation.isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Product */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={order.listing?.title || "สินค้า"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package
                    size={26}
                    className="text-neutral-300"
                  />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-neutral-900">
                {order.listing?.title || "-"}
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                {order.listing?.brand || "-"}
                {order.listing?.model
                  ? ` • ${order.listing.model}`
                  : ""}
              </p>

              <p className="mt-2 text-lg font-semibold text-orange-500">
                {formatPrice(order.agreedPrice)}
              </p>
            </div>
          </div>

          <div className="my-6 border-t border-neutral-200" />

          {/* Details */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-neutral-400">
                Order Number
              </p>

              <p className="mt-1 break-all text-sm font-medium text-neutral-800">
                {order.orderNumber || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">
                บริษัทขนส่ง
              </p>

              <p className="mt-1 text-sm font-medium text-neutral-800">
                {shipment?.carrier || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">
                วันที่สร้าง
              </p>

              <p className="mt-1 text-sm font-medium text-neutral-800">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">
                เลข Tracking
              </p>

              <p className="mt-1 text-sm font-medium text-neutral-800">
                {shipment?.trackingNumber || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">
                ผู้ขาย
              </p>

              <p className="mt-1 text-sm font-medium text-neutral-800">
                {getSellerName(order)}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">
                สถานะการจัดส่ง
              </p>

              <span
                className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${shipmentStatus.className}`}
              >
                {shipmentStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={receiveOrderMutation.isPending}
            className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={handleReceive}
            disabled={receiveOrderMutation.isPending}
            className="flex min-w-[130px] items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {receiveOrderMutation.isPending
              ? "กำลังรับสินค้า..."
              : "รับสินค้าแล้ว"}
          </button>
        </div>
      </div>
    </div>
  );
}