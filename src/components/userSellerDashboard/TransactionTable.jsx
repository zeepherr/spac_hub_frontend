import React from "react";
import { Filter, Package } from "lucide-react";
import { OrderProductImage } from "./OrderProductImage";

export function TransactionTable({ orders, statusFilter, setStatusFilter }) {
  return (
    <div className="card bg-base-100 border border-base-200/80 shadow-sm rounded-3xl overflow-hidden p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-base-200 pb-4">
        <div>
          <h2 className="font-bold text-base text-base-content">Sales Transactions</h2>
          <p className="text-xs text-base-content/60">Detailed list of seller orders and listings</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-base-content/50" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-sm select-bordered rounded-xl text-xs font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed Only</option>
            <option value="PENDING">Pending / Processing</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full text-xs">
          <thead>
            <tr className="text-base-content/60 border-b border-base-200">
              <th className="py-3">Product</th>
              <th className="py-3">Category</th>
              <th className="py-3">Date</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-base-content/50">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No sales transaction found for this filter.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const listing = order.listing || order.product || {};
                const title = listing.title || order.title || `Order #${order.id}`;
                const categoryName = listing.category?.name || order.categoryName || "General";
                const imagesSource = listing.images || listing.image || order.images || order.imageUrl;
                const price = Number(order.agreedPrice || order.totalPrice || 0);
console.log('listing', listing)
                return (
                  <tr key={order.id} className="hover:bg-base-200/40 transition-colors border-b border-base-200/40">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <OrderProductImage images={imagesSource} title={title} className="w-12 h-12" />
                        <div>
                          <p className="font-bold text-sm text-base-content line-clamp-1">{title}</p>
                          <p className="text-[10px] text-base-content/50 font-medium">Order ID: #{order.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-lg bg-base-200 text-base-content/70 font-semibold text-[11px]">
                        {categoryName}
                      </span>
                    </td>

                    <td className="py-3 font-medium text-base-content/70">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "-"}
                    </td>

                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                          order.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-3 text-right font-black text-sm text-base-content">
                      ฿{price.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}