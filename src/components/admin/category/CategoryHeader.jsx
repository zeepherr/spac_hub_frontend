function CategoryHeader({ onAdd }) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">หมวดหมู่</h1>

        <p className="mt-1 text-sm text-gray-500">
          <p>
            สร้างและจัดการหมวดหมู่สินค้าที่ใช้กับประกาศขายทั้งหมดในตลาดซื้อขาย
          </p>
        </p>
      </div>

      <button
        onClick={onAdd}
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#FF6B1A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#E85D0F]"
      >
        Add Category
      </button>
    </div>
  );
}

export default CategoryHeader;
