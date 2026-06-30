import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartEmptyState, ChartLoadingState } from "./ChartStates.jsx";

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-lucro-border bg-lucro-card px-3 py-2 text-[11px] shadow-panel">
      <div className="mb-1 font-bold text-lucro-text">{label}</div>
      <div className="text-lucro-muted">
        Requests: <span className="font-bold text-lucro-rust">{payload[0].value}</span>
      </div>
    </div>
  );
}

export default function CancellationTrendChart({ data, isLoading }) {
  if (isLoading) return <ChartLoadingState />;
  if (!data.length) return <ChartEmptyState message="No dated cancellation requests match the filters." />;

  return (
    <div className="h-72 transition duration-300 hover:scale-[1.005]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 20, left: -16, bottom: 8 }}>
          <CartesianGrid stroke="#d8daf0" strokeDasharray="4 4" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#505880", fontSize: 10, fontFamily: "Verdana, Geneva, sans-serif" }}
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
            cursor={{ stroke: "#5c72f0", strokeWidth: 1 }}
            content={<TrendTooltip />}
          />
          <Line
            type="monotone"
            dataKey="cancellations"
            name="Requests"
            stroke="#c94020"
            strokeWidth={3}
            dot={{ r: 4, fill: "#c94020", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#1f35c4" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
