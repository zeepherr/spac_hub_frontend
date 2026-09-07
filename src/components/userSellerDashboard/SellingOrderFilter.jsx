import React from "react";
import { Search } from "lucide-react";

export const FILTER_TABS = [
  {
    id: "ALL",
    label: "All Sales",
    activeClass: "bg-orange-500 text-white shadow-md shadow-orange-500/20",
    badgeActive: "bg-white/20 text-white",
  },
  {
    id: "PAID",
    label: "To Ship",
    activeClass: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
    badgeActive: "bg-white/20 text-white",
  },
  {
    id: "SELLER_SHIPPING",
    label: "In Transit to Admin",
    activeClass: "bg-blue-500 text-white shadow-md shadow-blue-500/20",
    badgeActive: "bg-white/20 text-white",
  },
  {
    id: "INSPECTION",
    label: "Inspection",
    activeClass: "bg-indigo-500 text-white shadow-md shadow-indigo-500/20",
    badgeActive: "bg-white/20 text-white",
  },
  {
    id: "COMPLETED",
    label: "Completed",
    activeClass: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
    badgeActive: "bg-white/20 text-white",
  },
  {
    id: "CANCELLED",
    label: "Cancelled",
    activeClass: "bg-rose-500 text-white shadow-md shadow-rose-500/20",
    badgeActive: "bg-white/20 text-white",
  },
];

export default function SellingOrderFilter({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  validOrders = [],
}) {
  const getTabCount = (tabId) => {
    if (tabId === "ALL") return validOrders.length;
    if (tabId === "INSPECTION") {
      return validOrders.filter((o) =>
        [
          "INSPECTION_PENDING",
          "INSPECTING",
          "NEEDS_REVIEW",
          "VERIFIED",
          "SHIPPING_TO_BUYER",
        ].includes(o.status)
      ).length;
    }
    if (tabId === "CANCELLED") {
      return validOrders.filter((o) =>
        ["CANCELLED", "REJECTED"].includes(o.status)
      ).length;
    }
    return validOrders.filter((o) => o.status === tabId).length;
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-100 scrollbar-none">
        {FILTER_TABS.map((tab) => {
          const count = getTabCount(tab.id);
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full shrink-0 transition-all cursor-pointer ${
                isActive
                  ? tab.activeClass
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                  isActive
                    ? tab.badgeActive
                    : "bg-neutral-200/80 text-neutral-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by order number or product title..."
          className="w-full rounded-full border border-neutral-200 bg-neutral-50/50 py-2.5 pl-11 pr-4 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
        />
      </div>
    </div>
  );
}