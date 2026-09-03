import React from "react";
import { ShoppingBag, Tag, ShieldCheck, MessageSquare, ChevronRight } from "lucide-react";

const stats = [
  { label: "กำลังซื้อ", value: "2", icon: ShoppingBag, color: "text-accent" },
  { label: "กำลังขาย", value: "3", icon: Tag, color: "text-accent" },
  { label: "รอตรวจสอบ", value: "1", icon: ShieldCheck, color: "text-accent" },
  { label: "ข้อความใหม่", value: "4", icon: MessageSquare, color: "text-accent" },
];

export default function StatCardsGroup() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className="card hardware-surface p-4 flex flex-row items-center justify-between cursor-pointer hover:border-accent transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-base-200/80 group-hover:bg-accent/10 transition-colors">
                <IconComponent className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <span className="text-xs text-base-content/70 font-semibold block">
                  {item.label}
                </span>
                <span className="text-xl font-bold text-base-content">
                  {item.value}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-base-content/40 group-hover:text-base-content group-hover:translate-x-0.5 transition-all" />
          </div>
        );
      })}
    </div>
  );
}

export function StatCardsGroupSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card hardware-surface p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 w-full">
            <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
            <div className="space-y-2 w-full">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-6 w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}