import { lazy, Suspense, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import BarList from "../components/BarList.jsx";
import CancellationTable from "../components/CancellationTable.jsx";
import DashboardLayout from "../components/DashboardLayout.jsx";
import Filters from "../components/Filters.jsx";
import KpiGrid from "../components/KpiGrid.jsx";
import Panel, { PanelDivider } from "../components/Panel.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import {
  APP_META,
  CANCELLATION_COLUMNS,
  INITIAL_SORT,
  SORTABLE_COLUMN_MAP,
} from "../constants/dashboard.js";
import useFilters from "../hooks/useFilters.js";
import useMetrics from "../hooks/useMetrics.js";
import usePagination from "../hooks/usePagination.js";
import { fetchCancellations, fetchMetrics } from "../services/api.js";
import { formatCurrency } from "../utils/metrics.js";

const VisualAnalyticsSection = lazy(() => import("../components/VisualAnalyticsSection.jsx"));

const initialState = {
  selectedPeriod: "overview",
  sort: INITIAL_SORT,
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case "selectPeriod":
      return { ...state, selectedPeriod: action.value };
    case "sortColumn": {
      const key = SORTABLE_COLUMN_MAP[action.column];
      if (!key) return state;

      const direction =
        state.sort.column === action.column && state.sort.direction === "asc" ? "desc" : "asc";

      return { ...state, sort: { column: action.column, key, direction } };
    }
    default:
      return state;
  }
}

function makePreventabilityNote(clients) {
  const preventable = clients.filter((client) => /^yes$/i.test(client.preventable)).length;
  const structural = clients.length - preventable;
  const exitWord = preventable === 1 ? "exit" : "exits";

  return `${preventable} preventable ${exitWord}. ${structural} structural or unclear.`;
}

function makeTableRows(clients) {
  return clients.map((client) => ({
    cells: [
      { text: client.date },
      { text: client.client },
      { text: client.status, tagVariant: client.statusVariant },
      { text: client.phase },
      { text: client.cancellationReason, tagVariant: client.reasonVariant },
      { text: client.accountManager },
      { text: formatCurrency(client.revenueAtRisk) },
      { text: formatCurrency(client.recoveredRevenue) },
      { text: client.leadSource },
      { text: client.clientReason },
    ],
  }));
}

function EmptyState({ message = "No matching cancellation records." }) {
  return (
    <div className="rounded-lg border border-dashed border-lucro-border bg-lucro-surface px-4 py-8 text-center text-[12px] text-lucro-muted">
      {message}
    </div>
  );
}

function LoadingDashboard() {
  return (
    <>
      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-[14px] border border-lucro-border bg-lucro-card shadow-panel" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-[14px] border border-lucro-border bg-lucro-card shadow-panel" />
        <div className="h-80 animate-pulse rounded-[14px] border border-lucro-border bg-lucro-card shadow-panel" />
      </div>
    </>
  );
}

function ErrorPanel({ message, onRetry }) {
  return (
    <Panel title="Backend Connection Error" titleTone="danger">
      <p className="mb-4 text-[12px] leading-6 text-lucro-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-lucro-danger/35 bg-lucro-danger/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-lucro-danger transition hover:border-lucro-danger hover:bg-lucro-danger/15"
      >
        Retry
      </button>
    </Panel>
  );
}

function DynamicRecordsTable({ title, clients, sortState, onSort }) {
  const rows = useMemo(() => makeTableRows(clients), [clients]);
  const pagination = usePagination(rows.length);

  return (
    <Panel title={title} titleTone="accent2" className="mb-4">
      {clients.length ? (
        <CancellationTable
          columns={CANCELLATION_COLUMNS}
          rows={rows}
          pagination={pagination}
          sortableColumns={Object.keys(SORTABLE_COLUMN_MAP)}
          sortState={sortState}
          onSort={onSort}
        />
      ) : (
        <EmptyState />
      )}
    </Panel>
  );
}

function DynamicBars({ items }) {
  return items.length ? <BarList items={items} /> : <EmptyState />;
}

function VisualAnalyticsFallback() {
  return (
    <>
      <SectionLabel>Visual Analytics</SectionLabel>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-[14px] border border-lucro-border bg-lucro-card shadow-panel" />
        <div className="h-80 animate-pulse rounded-[14px] border border-lucro-border bg-lucro-card shadow-panel" />
      </div>
    </>
  );
}

function AnalyticsDashboard({
  label,
  kpis,
  clients,
  sortState,
  onSort,
  driverBars,
  leadSourceBars,
  charts,
}) {
  return (
    <>
      <SectionLabel>{label}</SectionLabel>
      <KpiGrid items={kpis} />

      <Suspense fallback={<VisualAnalyticsFallback />}>
        <VisualAnalyticsSection clients={clients} {...charts} />
      </Suspense>

      <SectionLabel>Cancellation Records</SectionLabel>
      <DynamicRecordsTable title={`${label} Records`} clients={clients} sortState={sortState} onSort={onSort} />

      <SectionLabel>Breakdowns</SectionLabel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Cancellation Reasons" titleTone="accent2">
          <DynamicBars items={driverBars} />
          {clients.length ? (
            <>
              <PanelDivider />
              <p className="text-[11px] leading-7 text-lucro-muted">
                <strong className="text-lucro-text">Preventable vs Structural:</strong>
                <br />
                {makePreventabilityNote(clients)}
              </p>
            </>
          ) : null}
        </Panel>

        <Panel title="Lead Sources" titleTone="accent2">
          <DynamicBars items={leadSourceBars} />
        </Panel>
      </div>
    </>
  );
}

export default function Dashboard() {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const [apiState, setApiState] = useState({
    status: "loading",
    cancellations: [],
    metrics: null,
    error: null,
  });
  const { debouncedFilters, filters, resetFilters, updateFilters } = useFilters();
  const filtersPending = filters !== debouncedFilters;

  const loadDashboardData = useCallback(async () => {
    setApiState((current) => ({ ...current, status: "loading", error: null }));

    try {
      const [cancellations, metrics] = await Promise.all([fetchCancellations(), fetchMetrics()]);
      setApiState({ status: "success", cancellations, metrics, error: null });
    } catch (error) {
      setApiState({
        status: "error",
        cancellations: [],
        metrics: null,
        error: error instanceof Error ? error.message : "Unable to load dashboard data.",
      });
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const {
    accountManagers,
    activeOption,
    cancellationReasons,
    dateBounds,
    driverBars,
    dynamicKpis,
    globalFilteredClients,
    insights,
    leadSourceBars,
    periodOptions,
    reasonChartData,
    retentionPieData,
    sortedClients,
    trendData,
  } = useMetrics({
    cancellations: apiState.cancellations,
    filters: debouncedFilters,
    selectedPeriod: state.selectedPeriod,
    sort: state.sort,
  });

  const charts = {
    trendData,
    reasonChartData,
    retentionPieData,
    insights,
    isLoading: apiState.status === "loading" || filtersPending,
  };

  return (
    <DashboardLayout
      headerProps={{
        ...APP_META,
        period: activeOption?.period || "",
        quarterOptions: periodOptions,
        selectedQuarter: state.selectedPeriod,
        onQuarterChange: (value) => dispatch({ type: "selectPeriod", value }),
      }}
    >
      {apiState.status === "error" ? (
        <ErrorPanel message={apiState.error} onRetry={loadDashboardData} />
      ) : (
        <>
          <Filters
            filters={filters}
            cancellationReasons={cancellationReasons}
            accountManagers={accountManagers}
            dateBounds={dateBounds}
            resultCount={globalFilteredClients.length}
            onChange={updateFilters}
            onReset={resetFilters}
          />

          {apiState.status === "loading" ? (
            <LoadingDashboard />
          ) : (
            <AnalyticsDashboard
              label={state.selectedPeriod === "overview" ? "All Months at a Glance" : activeOption.label}
              kpis={dynamicKpis}
              clients={sortedClients}
              sortState={state.sort}
              onSort={(column) => dispatch({ type: "sortColumn", column })}
              driverBars={driverBars}
              leadSourceBars={leadSourceBars}
              charts={charts}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
