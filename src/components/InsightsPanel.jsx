import Panel from "./Panel.jsx";

export default function InsightsPanel({ insights, isLoading }) {
  return (
    <Panel title="Insights Panel" titleTone="accent2">
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 animate-pulse rounded bg-lucro-border/70" />
          <div className="h-4 animate-pulse rounded bg-lucro-border/70" />
          <div className="h-4 animate-pulse rounded bg-lucro-border/70" />
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((insight) => (
            <div
              key={insight}
              className="rounded-lg border border-lucro-border bg-lucro-surface p-4 text-[12px] leading-6 text-lucro-text transition duration-200 hover:-translate-y-0.5 hover:border-lucro-accent hover:shadow-panel"
            >
              {insight}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
