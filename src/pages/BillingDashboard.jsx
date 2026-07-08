import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardLayout from "../components/DashboardLayout.jsx";
import KpiCard from "../components/KpiCard.jsx";
import Panel, { PanelDivider } from "../components/Panel.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import Tag from "../components/Tag.jsx";
import { fetchBillingSummary } from "../services/billingApi.js";

const PLAN_OPTIONS = ["All Plans", "Annual", "Month-to-month", "Payment plan", "One-time"];
const STATUS_OPTIONS = ["All Statuses", "Active", "Past due", "Canceling", "Trialing", "Complete"];
const BILLING_REFRESH_MS = 5 * 60 * 1000;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD",
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  notation: "compact",
  style: "currency",
  currency: "USD",
});

const statusVariantMap = {
  Active: "green",
  "Past due": "red",
  Canceling: "orange",
  Trialing: "blue",
  Complete: "blue",
};

function formatCurrency(value, compact = false) {
  return compact ? compactCurrencyFormatter.format(value) : currencyFormatter.format(value);
}

function formatDate(value) {
  if (!value) return "No invoice scheduled";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${value}T00:00:00`)
  );
}

function sum(items, key) {
  return items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
}

function EmptyBillingState({ message }) {
  return (
    <div className="rounded-lg border border-dashed border-lucro-border bg-lucro-surface px-4 py-8 text-center text-[12px] text-lucro-muted">
      {message}
    </div>
  );
}

function groupByPlan(clients) {
  const groups = new Map();

  clients.forEach((client) => {
    const current = groups.get(client.planType) || {
      plan: client.planType,
      clients: 0,
      revenue: 0,
      overdue: 0,
    };

    current.clients += 1;
    current.revenue += client.contractValue;
    current.overdue += client.balanceDue;
    groups.set(client.planType, current);
  });

  return [...groups.values()].sort((a, b) => b.revenue - a.revenue);
}

function groupByStatus(clients) {
  const groups = new Map();

  clients.forEach((client) => {
    const current = groups.get(client.status) || { status: client.status, clients: 0 };
    current.clients += 1;
    groups.set(client.status, current);
  });

  return [...groups.values()].sort((a, b) => b.clients - a.clients);
}

function BillingTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-lucro-border bg-lucro-card px-3 py-2 text-[11px] shadow-panel">
      <div className="mb-1 font-bold text-lucro-text">{label}</div>
      {payload.map((item) => (
        <div key={item.dataKey} className="text-lucro-muted">
          {item.name}:{" "}
          <span className="font-bold text-lucro-text">
            {item.dataKey === "clients" ? item.value : formatCurrency(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function BillingFilters({
  generatedAt,
  mode,
  planFilter,
  status,
  statusFilter,
  resultCount,
  onPlanChange,
  onStatusChange,
}) {
  const badgeText = mode === "live" ? "Live Stripe" : "Mock Data";
  const updatedText = generatedAt
    ? `Last updated ${new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }).format(new Date(generatedAt))}`
    : "Local preview data";

  return (
    <section className="mb-6 rounded-[12px] border border-lucro-border bg-lucro-card p-4 shadow-panel">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase text-lucro-muted">Billing View</div>
          <div className="mt-1 text-[11px] text-lucro-muted">
            Showing <span className="font-bold text-lucro-accent">{resultCount}</span> Stripe-style client records
            <span className="mx-2 text-lucro-faint">/</span>
            {status === "loading" ? "Refreshing billing data" : updatedText}
          </div>
        </div>
        <div className="rounded-md bg-lucro-signal px-3 py-1.5 text-[11px] font-bold text-lucro-text">{badgeText}</div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label>
          <span className="mb-1.5 block text-[10px] font-bold uppercase text-lucro-muted">Plan Type</span>
          <select
            value={planFilter}
            onChange={(event) => onPlanChange(event.target.value)}
            className="w-full rounded-lg border border-lucro-border bg-lucro-surface px-3 py-2 text-[11px] text-lucro-text transition hover:border-lucro-accent focus:border-lucro-accent focus:outline-none"
          >
            {PLAN_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] font-bold uppercase text-lucro-muted">Client Status</span>
          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
            className="w-full rounded-lg border border-lucro-border bg-lucro-surface px-3 py-2 text-[11px] text-lucro-text transition hover:border-lucro-accent focus:border-lucro-accent focus:outline-none"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

function KpiGrid({ items }) {
  return (
    <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
      {items.map((item) => (
        <KpiCard key={item.label} {...item} />
      ))}
    </div>
  );
}

function RevenueTrendChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 20, left: -12, bottom: 8 }}>
          <CartesianGrid stroke="#E4E5EA" strokeDasharray="4 4" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#9296A1", fontSize: 10, fontFamily: "Inter, sans-serif" }}
            axisLine={{ stroke: "#E4E5EA" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9296A1", fontSize: 10, fontFamily: "Inter, sans-serif" }}
            axisLine={{ stroke: "#E4E5EA" }}
            tickFormatter={(value) => formatCurrency(value, true)}
            tickLine={false}
          />
          <Tooltip cursor={{ stroke: "#C9A84C", strokeWidth: 1 }} content={<BillingTooltip />} />
          <Line
            type="monotone"
            dataKey="invoiced"
            name="Invoiced"
            stroke="#1B2A4A"
            strokeWidth={3}
            dot={{ r: 4, fill: "#1B2A4A", strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="collected"
            name="Collected"
            stroke="#FEE42F"
            strokeWidth={4}
            dot={{ r: 4, fill: "#171A23", strokeWidth: 2, stroke: "#FEE42F" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function PlanRevenueChart({ data }) {
  if (!data.length) {
    return <EmptyBillingState message="No plan revenue records match the selected filters." />;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 36 }}>
          <CartesianGrid stroke="#E4E5EA" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="plan"
            angle={-18}
            height={50}
            textAnchor="end"
            tick={{ fill: "#9296A1", fontSize: 10, fontFamily: "Inter, sans-serif" }}
            axisLine={{ stroke: "#E4E5EA" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9296A1", fontSize: 10, fontFamily: "Inter, sans-serif" }}
            axisLine={{ stroke: "#E4E5EA" }}
            tickFormatter={(value) => formatCurrency(value, true)}
            tickLine={false}
          />
          <Tooltip cursor={{ fill: "rgba(27, 42, 74, 0.06)" }} content={<BillingTooltip />} />
          <Bar dataKey="revenue" name="Contract Value" fill="#1B2A4A" radius={[6, 6, 0, 0]} />
          <Bar dataKey="overdue" name="Overdue" fill="#C9A84C" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatusMix({ data, totalClients }) {
  if (!data.length) {
    return <EmptyBillingState message="No client status records match the selected filters." />;
  }

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = totalClients ? Math.round((item.clients / totalClients) * 100) : 0;

        return (
          <div key={item.status}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px]">
              <span className="font-bold text-lucro-text">{item.status}</span>
              <span className="text-lucro-muted">
                {item.clients} clients / {percentage}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-lucro-border">
              <div
                className="h-full rounded bg-lucro-accent transition-[width] duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Watchlist({ clients }) {
  if (!clients.length) {
    return <EmptyBillingState message="No payment watchlist records in this view." />;
  }

  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <div
          key={client.id}
          className="rounded-lg border border-lucro-border bg-lucro-surface p-4 text-[12px] leading-6"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="font-bold text-lucro-text">{client.client}</div>
            <Tag variant={statusVariantMap[client.status]}>{client.status}</Tag>
          </div>
          <div className="grid gap-2 text-lucro-muted sm:grid-cols-3">
            <span>{client.planType}</span>
            <span>{formatCurrency(client.balanceDue)} due</span>
            <span>{client.ownerAction}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BillingTable({ clients }) {
  if (!clients.length) {
    return <EmptyBillingState message="No billing records match the selected filters." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[11px]">
        <thead className="bg-lucro-accent2 text-white">
          <tr>
            {["Client", "Plan", "Status", "Invoice", "Contract", "Next Invoice", "Payment", "Owner Action"].map(
              (column) => (
                <th key={column} className="px-3 py-3 text-left text-[9px] font-bold uppercase">
                  {column}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={client.id} className={index % 2 ? "bg-lucro-surface" : "bg-lucro-card"}>
              <td className="border-b border-lucro-border px-3 py-3 font-bold text-lucro-text">{client.client}</td>
              <td className="border-b border-lucro-border px-3 py-3 text-lucro-muted">{client.planType}</td>
              <td className="border-b border-lucro-border px-3 py-3">
                <Tag variant={statusVariantMap[client.status]}>{client.status}</Tag>
              </td>
              <td className="border-b border-lucro-border px-3 py-3 text-lucro-muted">{client.invoiceStatus}</td>
              <td className="border-b border-lucro-border px-3 py-3 font-bold text-lucro-text">
                {formatCurrency(client.contractValue)}
              </td>
              <td className="border-b border-lucro-border px-3 py-3 text-lucro-muted">
                {formatDate(client.nextInvoiceDate)}
              </td>
              <td className="border-b border-lucro-border px-3 py-3 text-lucro-muted">{client.paymentMethod}</td>
              <td className="border-b border-lucro-border px-3 py-3 text-lucro-muted">{client.ownerAction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BillingDashboard({ navigation }) {
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [billingState, setBillingState] = useState({
    clients: [],
    error: "",
    generatedAt: null,
    mode: "mock",
    status: "loading",
    trend: [],
    warning: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadBillingSummary() {
      setBillingState((current) => ({ ...current, status: "loading" }));
      const summary = await fetchBillingSummary();

      if (!isMounted) return;

      setBillingState({
        clients: summary.clients,
        error: summary.error || "",
        generatedAt: summary.generatedAt,
        mode: summary.mode,
        status: "success",
        trend: summary.trend,
        warning: summary.warning || "",
      });
    }

    loadBillingSummary();
    const refresh = window.setInterval(loadBillingSummary, BILLING_REFRESH_MS);

    return () => {
      isMounted = false;
      window.clearInterval(refresh);
    };
  }, []);

  const filteredClients = useMemo(
    () =>
      billingState.clients.filter((client) => {
        const matchesPlan = planFilter === "All Plans" || client.planType === planFilter;
        const matchesStatus = statusFilter === "All Statuses" || client.status === statusFilter;
        return matchesPlan && matchesStatus;
      }),
    [billingState.clients, planFilter, statusFilter]
  );

  const planData = useMemo(() => groupByPlan(filteredClients), [filteredClients]);
  const statusData = useMemo(() => groupByStatus(filteredClients), [filteredClients]);
  const watchlistClients = useMemo(
    () =>
      filteredClients
        .filter((client) => client.balanceDue > 0 || client.status === "Past due" || client.status === "Canceling")
        .sort((a, b) => b.balanceDue - a.balanceDue)
        .slice(0, 4),
    [filteredClients]
  );

  const activeClients = filteredClients.filter((client) => ["Active", "Trialing"].includes(client.status)).length;
  const pastDueClients = filteredClients.filter((client) => client.status === "Past due").length;
  const overdueAmount = sum(filteredClients, "balanceDue");
  const monthlyRecurring = sum(filteredClients, "mrr");
  const contractValue = sum(filteredClients, "contractValue");

  const kpis = [
    {
      label: "Active Clients",
      value: activeClients,
      subtext: `${filteredClients.length} records in view`,
      tone: "accent2",
    },
    {
      label: "Monthly Run Rate",
      value: formatCurrency(monthlyRecurring, true),
      subtext: "Recurring monthly plans",
      tone: "accent",
    },
    {
      label: "Contract Value",
      value: formatCurrency(contractValue, true),
      subtext: "Annualized and one-time value",
      tone: "ok",
    },
    {
      label: "Open Balance",
      value: formatCurrency(overdueAmount, true),
      subtext: "Open or failed invoices",
      tone: overdueAmount ? "warn" : "ok",
    },
  ];

  return (
    <DashboardLayout
      navigation={navigation}
      headerProps={{
        brand: "Lucro - Billing Operations",
        titlePrefix: "Billing",
        titleAccent: "Dashboard",
        period: billingState.mode === "live" ? "Live Stripe" : "Stripe Mirror",
      }}
    >
      <BillingFilters
        generatedAt={billingState.generatedAt}
        mode={billingState.mode}
        planFilter={planFilter}
        status={billingState.status}
        statusFilter={statusFilter}
        resultCount={filteredClients.length}
        onPlanChange={setPlanFilter}
        onStatusChange={setStatusFilter}
      />

      {billingState.error || billingState.warning ? (
        <div className="mb-6 rounded-[12px] border border-lucro-border bg-lucro-card px-4 py-3 text-[12px] leading-6 text-lucro-muted shadow-panel">
          <strong className="text-lucro-text">
            {billingState.mode === "live" ? "Billing API" : "Mock Mode"}:
          </strong>{" "}
          {billingState.error || billingState.warning}
        </div>
      ) : null}

      <SectionLabel>Revenue Snapshot</SectionLabel>
      <KpiGrid items={kpis} />

      <SectionLabel>Billing Movement</SectionLabel>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Panel title="Collected vs Invoiced" titleTone="accent2">
          <RevenueTrendChart data={billingState.trend} />
        </Panel>
        <Panel title="Contract Value by Plan" titleTone="accent">
          <PlanRevenueChart data={planData} />
        </Panel>
      </div>

      <SectionLabel>Client Mix</SectionLabel>
      <div className="grid gap-4 xl:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.25fr)]">
        <Panel title="Status Mix" titleTone="ok">
          <StatusMix data={statusData} totalClients={filteredClients.length} />
          <PanelDivider />
          <p className="text-[11px] leading-6 text-lucro-muted">
            <strong className="text-lucro-text">Past Due:</strong> {pastDueClients} clients need billing follow-up.
          </p>
        </Panel>
        <Panel title="Payment Watchlist" titleTone="warn">
          <Watchlist clients={watchlistClients} />
        </Panel>
      </div>

      <SectionLabel>Client Records</SectionLabel>
      <Panel title="Billing Client Register" titleTone="accent2">
        <BillingTable clients={filteredClients} />
      </Panel>
    </DashboardLayout>
  );
}
