import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X, Check, Layers } from "lucide-react";
import { authApi } from "@/api/axios";
import { useCategories } from "@/hook/category/useCategory";

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
  const {data:categories,isPending} = useCategories({includeInactive:false})

// //   useEffect(() => {
// //     if (!isOpen) return;

// //     const fetchCategories = async () => {
// //       try {
// //         setLoading(true);
// //         // เรียก Endpoint API getAllCategoriesForUser
// //         const response = await authApi.get("/categories");
// //         console.log(response.data)
// //         if (response.data && response.data.data) {
// //           setCategories(response.data.data);
// //         }
// //       } catch (err) {
// //         console.error("Failed to fetch categories:", err);
// //         setError("ไม่สามารถโหลดรายการหมวดหมู่ได้");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

//     fetchCategories();
//   }, [isOpen]);

  if (!isOpen) return null;

  // กรองหมวดหมู่ตามช่องค้นหา
  const filteredCategories = categories?.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Container ตัว Modal */}
      <div className="bg-base-100 border border-base-300 rounded-box w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header Modal */}
        <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-200/50">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#f97316]" />
            <h3 className="text-lg font-bold text-base-content tracking-tight">
              เลือกหมวดหมู่สินค้า
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost btn-circle text-base-content hover:bg-base-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ช่อง Search ค้นหา */}
        <div className="p-4 border-b border-base-300 bg-base-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral/70" />
            <input
              type="text"
              placeholder="ค้นหาหมวดหมู่ เช่น การ์ดจอ, ซีพียู..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-9 rounded-field text-sm focus:border-[#f97316] bg-base-100 text-base-content"
            />
          </div>
        </div>

        {/* List หมวดหมู่ */}
        <div className="p-3 overflow-y-auto flex-1 space-y-1">
          {isPending ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-neutral">
              <span className="loading loading-spinner loading-md text-[#f97316]" />
              <span className="text-sm font-medium">กำลังโหลดหมวดหมู่...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-error text-sm font-medium">
              {error}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-8 text-center text-neutral/70 text-sm">
              ไม่พบหมวดหมู่ที่ค้นหา
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
                  className={`w-full text-left px-4 py-3 rounded-field flex items-center justify-between transition-all border ${
                    isSelected
                      ? "bg-[#f97316]/10 border-[#f97316] text-[#f97316] font-bold"
                      : "border-transparent hover:bg-base-200 text-base-content hover:border-base-300 font-semibold"
                  }`}
                >
                  <span className="text-sm">{cat.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#f97316]" />}
                </button>
              );
            })
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-3 border-t border-base-300 bg-base-200/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-outline border-base-300 text-base-content hover:bg-base-300"
          >
            ยกเลิก
          </button>
        </div>

      </div>
    </div>
  );
}