export function ChartLoadingState() {
  return (
    <div className="flex h-72 animate-pulse items-end gap-3 rounded-lg border border-lucro-border bg-lucro-surface p-4">
      <div className="h-1/3 flex-1 rounded bg-lucro-border/70" />
      <div className="h-2/3 flex-1 rounded bg-lucro-border/70" />
      <div className="h-1/2 flex-1 rounded bg-lucro-border/70" />
      <div className="h-5/6 flex-1 rounded bg-lucro-border/70" />
      <div className="h-3/5 flex-1 rounded bg-lucro-border/70" />
    </div>
  );
}

export function ChartEmptyState({ message = "No chart data for the current filters." }) {
  return (
    <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-lucro-border bg-lucro-surface px-4 text-center text-[12px] text-lucro-muted">
      {message}
    </div>
  );
}
