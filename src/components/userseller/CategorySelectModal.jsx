import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X, Check, Layers } from "lucide-react";
import { authApi } from "@/api/axios";
import { useCategories } from "@/hook/category/useCategory";

// เดียวกับ GLASS_MODAL/GLASS_INPUT/GLASS_IDLE ที่ใช้ทั้งเว็บ
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";
const GLASS_INPUT =
  "w-full rounded-xl border border-neutral-300 bg-white/70 backdrop-blur-sm px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
const GLASS_IDLE =
  "border border-neutral-200/70 bg-white/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)]";

export default function CategorySelectModal({
  isOpen,
  onClose,
  selectedCategoryId,
  onSelectCategory,
}) {
  //   const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories, isPending } = useCategories({
    includeInactive: false,
  });

  if (!isOpen) return null;

  // กรองหมวดหมู่ตามช่องค้นหา
  const filteredCategories = categories?.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-fadeIn"
      onClick={onClose}
    >
      {/* Container ตัว Modal */}
      <div
        className={`rounded-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] ${GLASS_MODAL}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-4 border-b border-neutral-200/70 flex items-center justify-between bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
              Select Category
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ช่อง Search ค้นหา */}
        <div className="p-4 border-b border-neutral-200/70">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search categories e.g. GPU, CPU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${GLASS_INPUT} pl-9`}
            />
          </div>
        </div>

        {/* List หมวดหมู่ */}
        <div className="p-3 overflow-y-auto flex-1 space-y-1">
          {isPending ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-neutral-500">
              <span className="loading loading-spinner loading-md text-orange-500" />
              <span className="text-sm font-medium">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500 text-sm font-medium">
              {error}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-8 text-center text-neutral-400 text-sm">
              No categories found
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat);
                    onClose();
                  }}
                  className={`w-full cursor-pointer text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all border ${
                    isSelected
                      ? "bg-orange-500/10 border-orange-500 text-orange-600 font-bold"
                      : "border-transparent hover:bg-orange-50/70 text-neutral-900 hover:border-orange-200 font-semibold"
                  }`}
                >
                  <span className="text-sm">{cat.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-orange-500" />}
                </button>
              );
            })
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-3 border-t border-neutral-200/70 bg-white/30 backdrop-blur-sm flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex cursor-pointer items-center rounded-xl px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-orange-300 hover:bg-orange-50/70 hover:text-orange-600 ${GLASS_IDLE}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
