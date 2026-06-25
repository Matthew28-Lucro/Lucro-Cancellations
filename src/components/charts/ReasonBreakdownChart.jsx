import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartEmptyState, ChartLoadingState } from "./ChartStates.jsx";

function ReasonTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="max-w-64 rounded-lg border border-lucro-border bg-lucro-card px-3 py-2 text-[11px] shadow-panel">
      <div className="mb-1 font-bold text-lucro-text">{label}</div>
      <div className="text-lucro-muted">
        Cancellations: <span className="font-bold text-lucro-accent2">{payload[0].value}</span>
      </div>
    </div>
  );
}

export default function ReasonBreakdownChart({ data, isLoading }) {
  if (isLoading) return <ChartLoadingState />;
  if (!data.length) return <ChartEmptyState message="No cancellation reasons match the filters." />;

  const visibleData = data.slice(0, 8);

  return (
    <div className="h-72 transition duration-300 hover:scale-[1.005]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={visibleData} margin={{ top: 12, right: 18, left: -16, bottom: 42 }}>
          <CartesianGrid stroke="#d8daf0" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-28}
            textAnchor="end"
            height={58}
            tick={{ fill: "#505880", fontSize: 9, fontFamily: "Verdana, Geneva, sans-serif" }}
            axisLine={{ stroke: "#c2c7e0" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#505880", fontSize: 10, fontFamily: "Verdana, Geneva, sans-serif" }}
            axisLine={{ stroke: "#c2c7e0" }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(92, 114, 240, 0.08)" }}
            content={<ReasonTooltip />}
          />
          <Bar dataKey="cancellations" name="Cancellations" fill="#1f35c4" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
