import { Search } from "lucide-react";

function CategoryFilters({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="
              h-11 w-full
              rounded-xl
              border border-neutral-200
              bg-white
              pl-11 pr-4
              text-sm text-neutral-800
              outline-none
              transition
              placeholder:text-neutral-400
              focus:border-orange-400
              focus:ring-2
              focus:ring-orange-100
            "
          />
        </div>

        {/* STATUS FILTER */}
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="
            h-11 shrink-0 cursor-pointer
            rounded-xl
            border border-neutral-200
            bg-white
            px-4
            text-sm text-neutral-700
            outline-none
            transition
            focus:border-orange-400
            focus:ring-2
            focus:ring-orange-100
          "
        >
          <option value="all">
            All statuses
          </option>

          <option value="active">
            Active
          </option>

          <option value="disabled">
            Disabled
          </option>
        </select>
      </div>
    </div>
  );
}

export default CategoryFilters;