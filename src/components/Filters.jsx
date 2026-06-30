export default function Filters({
  filters,
  cancellationReasons,
  accountManagers,
  yearOptions,
  monthOptions,
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
            Year
          </span>
          <select
            value={filters.year}
            onChange={(event) => onChange({ year: event.target.value, month: event.target.value ? "ytd" : "" })}
            className="w-full appearance-none rounded-lg border border-lucro-border bg-lucro-surface px-3 py-2 text-[11px] text-lucro-text transition hover:border-lucro-accent focus:border-lucro-accent focus:outline-none"
          >
            <option value="">All Years</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-lucro-muted">
            Month
          </span>
          <select
            value={filters.month}
            disabled={!filters.year}
            onChange={(event) => onChange({ month: event.target.value })}
            className="w-full appearance-none rounded-lg border border-lucro-border bg-lucro-surface px-3 py-2 text-[11px] text-lucro-text transition hover:border-lucro-accent focus:border-lucro-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">{filters.year ? "Select Month" : "Select Year First"}</option>
            {filters.year ? <option value="ytd">Year to Date</option> : null}
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
