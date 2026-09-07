import React from "react";
import { Search } from "lucide-react";

export function TransactionFilter({
  activeTab = "ALL",
  setActiveTab,
  tabCounts = {},
  searchQuery = "",
  setSearchQuery,
}) {
  // นิยาม Tab ทั้งหมดตามดีไซน์ในรูป
  const tabs = [
    { key: "ALL", label: "All Sales" },
    { key: "TO_SHIP", label: "To Ship" },
    { key: "IN_TRANSIT", label: "In Transit to Admin" },
    { key: "INSPECTION", label: "Inspection" },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="card bg-base-100 border border-base-200/80 shadow-sm rounded-3xl p-5 md:p-6 space-y-4">
      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tabCounts[tab.key] ?? 0;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-base-200/60 text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-extrabold transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-base-300/80 text-base-content/70"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order number or product title..."
          className="w-full bg-base-100 border border-base-200/90 rounded-full pl-11 pr-4 py-3 text-xs font-medium text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all"
        />
      </div>
    </div>
  );
}