function CategoryFilters({ search, setSearch, status, setStatus }) {
  return (
    <div className="mb-3 flex justify-between">
      <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="w-[320px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B1A]"
      />

      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B1A]"
      >
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="disabled">Disabled</option>
      </select>
    </div>
  );
}

export default CategoryFilters;