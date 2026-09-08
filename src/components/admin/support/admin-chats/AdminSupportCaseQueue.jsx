import { Search } from "lucide-react";

import SupportCaseListItem from "./SupportCaseListItem";
import {
  CaseListSkeleton,
  EmptyQueue,
  QueueError,
} from "./AdminChatsStates";
import { STATUS_FILTERS } from "./adminChats.utils";

function AdminSupportCaseQueue({
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  isCasesPending,
  isCasesError,
  refetchCases,
  filteredSupportCases,
  currentUserId,
  selectedSupportCaseId,
  handleSelectSupportCase,
}) {
  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-200 p-4">
        <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
          <Search size={18} className="shrink-0 text-neutral-400" />

          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search order, user or issue..."
            className="h-11 min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="mt-3 h-11 w-full cursor-pointer rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        >
          {STATUS_FILTERS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto p-2">
        {isCasesPending ? (
          <CaseListSkeleton />
        ) : isCasesError ? (
          <QueueError onRetry={refetchCases} />
        ) : filteredSupportCases.length === 0 ? (
          <EmptyQueue />
        ) : (
          <div className="space-y-1.5">
            {filteredSupportCases.map((supportCase) => (
              <SupportCaseListItem
                key={supportCase.id}
                supportCase={supportCase}
                currentUserId={currentUserId}
                isSelected={
                  Number(selectedSupportCaseId) === Number(supportCase.id)
                }
                onSelect={() => handleSelectSupportCase(supportCase.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default AdminSupportCaseQueue;
