export default function Filters({
  filters,
  cancellationReasons,
  accountManagers,
  dateBounds,
  resultCount,
  onChange,
  onReset,
}) {
  return (
    <section className="mb-6 rounded-[14px] border border-lucro-border bg-lucro-card p-4 shadow-panel">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-lucro-muted">Global Filters</div>
          <div className="mt-1 text-[11px] text-lucro-muted">
            Showing <span className="font-bold text-lucro-accent">{resultCount}</span> matching cancellation records
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-lucro-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-lucro-muted transition hover:border-lucro-accent hover:text-lucro-accent"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label>
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-lucro-muted">
            Cancellation Reason
          </span>
          <select
            value={filters.cancellationReason}
            onChange={(event) => onChange({ cancellationReason: event.target.value })}
            className="w-full appearance-none rounded-lg border border-lucro-border bg-lucro-surface px-3 py-2 text-[11px] text-lucro-text transition hover:border-lucro-accent focus:border-lucro-accent focus:outline-none"
          >
            <option value="">All Reasons</option>
            {cancellationReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-lucro-muted">
            Account Manager
          </span>
          <select
            value={filters.accountManager}
            onChange={(event) => onChange({ accountManager: event.target.value })}
            className="w-full appearance-none rounded-lg border border-lucro-border bg-lucro-surface px-3 py-2 text-[11px] text-lucro-text transition hover:border-lucro-accent focus:border-lucro-accent focus:outline-none"
          >
            <option value="">All Managers</option>
            {accountManagers.map((manager) => (
              <option key={manager} value={manager}>
                {manager}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-lucro-muted">
            Start Date
          </span>
          <input
            type="date"
            min={dateBounds.min}
            max={dateBounds.max}
            value={filters.dateRange.from}
            onChange={(event) => onChange({ dateRange: { ...filters.dateRange, from: event.target.value } })}
            className="w-full rounded-lg border border-lucro-border bg-lucro-surface px-3 py-2 text-[11px] text-lucro-text transition hover:border-lucro-accent focus:border-lucro-accent focus:outline-none"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-lucro-muted">
            End Date
          </span>
          <input
            type="date"
            min={dateBounds.min}
            max={dateBounds.max}
            value={filters.dateRange.to}
            onChange={(event) => onChange({ dateRange: { ...filters.dateRange, to: event.target.value } })}
            className="w-full rounded-lg border border-lucro-border bg-lucro-surface px-3 py-2 text-[11px] text-lucro-text transition hover:border-lucro-accent focus:border-lucro-accent focus:outline-none"
          />
        </label>
      </div>
    </section>
  );
}
