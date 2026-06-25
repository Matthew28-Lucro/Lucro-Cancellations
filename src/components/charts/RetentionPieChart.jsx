import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { calculateRetentionRate } from "../../utils/metrics.js";
import { ChartEmptyState, ChartLoadingState } from "./ChartStates.jsx";

const COLORS = ["#0a7a4a", "#c41f3b"];

function RetentionTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="rounded-lg border border-lucro-border bg-lucro-card px-3 py-2 text-[11px] shadow-panel">
      <div className="font-bold text-lucro-text">{item.name}</div>
      <div className="text-lucro-muted">{item.value} accounts</div>
    </div>
  );
}

export default function RetentionPieChart({ data, clients, isLoading }) {
  if (isLoading) return <ChartLoadingState />;
  if (!data.length || !clients.length) return <ChartEmptyState message="No retention data matches the filters." />;

  return (
    <div className="grid min-h-72 items-center gap-4 md:grid-cols-[1fr_140px]">
      <div className="h-72 transition duration-300 hover:scale-[1.005]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<RetentionTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-lg border border-lucro-border bg-lucro-surface p-4 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-lucro-muted">Retention</div>
        <div className="mt-2 text-4xl font-extrabold text-lucro-ok">{calculateRetentionRate(clients).toFixed(1)}%</div>
        <div className="mt-2 text-[11px] leading-5 text-lucro-muted">Estimated from filtered lost accounts.</div>
      </div>
    </div>
  );
}
