import { useMemo } from "react";
import {
  calculateRetentionRate,
  calculateSaveOpportunityRate,
  createBarItems,
  createCancellationTrendData,
  createMonthOptions,
  createReasonBreakdownData,
  createRetentionPieData,
  createYearOptions,
  filterCancellationData,
  generateInsights,
  getActivePeriodLabel,
  getUniqueOptions,
  getTopRevenueTier,
  mapApiCancellationsToClientRecords,
  sortCancellationData,
} from "../utils/metrics.js";

function buildDynamicKpis(clients) {
  const topRevenueTier = getTopRevenueTier(clients);

  return [
    {
      label: "Total Cancellations",
      value: String(clients.length),
      subtext: "Matching current filters",
      tone: "rust",
    },
    {
      label: "Retention Rate",
      value: `${calculateRetentionRate(clients).toFixed(1)}%`,
      subtext: "Estimated retained account base",
      tone: "ok",
    },
    {
      label: "Top Revenue Tier",
      value: topRevenueTier.label,
      subtext: `${topRevenueTier.count} matching records`,
      tone: "warn",
    },
    {
      label: "Save Opportunity",
      value: `${calculateSaveOpportunityRate(clients).toFixed(1)}%`,
      subtext: "Paused or clearly preventable",
      tone: "accent2",
    },
  ];
}

export default function useMetrics({ cancellations, filters, optionFilters = filters, sort }) {
  const allClients = useMemo(() => mapApiCancellationsToClientRecords(cancellations), [cancellations]);

  const cancellationReasons = useMemo(() => getUniqueOptions(allClients, "cancellationReason"), [allClients]);
  const accountManagers = useMemo(() => getUniqueOptions(allClients, "accountManager"), [allClients]);
  const yearOptions = useMemo(() => createYearOptions(allClients), [allClients]);
  const monthOptions = useMemo(() => createMonthOptions(allClients, optionFilters.year), [allClients, optionFilters.year]);
  const activePeriodLabel = useMemo(() => getActivePeriodLabel(filters), [filters]);
  const globalFilteredClients = useMemo(
    () => filterCancellationData(allClients, filters),
    [allClients, filters]
  );
  const sortedClients = useMemo(
    () => sortCancellationData(globalFilteredClients, sort),
    [globalFilteredClients, sort]
  );
  const dynamicKpis = useMemo(() => buildDynamicKpis(globalFilteredClients), [globalFilteredClients]);
  const driverBars = useMemo(() => createBarItems(globalFilteredClients, "cancellationReason"), [globalFilteredClients]);
  const leadSourceBars = useMemo(() => createBarItems(globalFilteredClients, "leadSource"), [globalFilteredClients]);
  const trendData = useMemo(
    () =>
      createCancellationTrendData(
        globalFilteredClients,
        filters.year && filters.month && filters.month !== "ytd" ? "day" : "month"
      ),
    [globalFilteredClients, filters.year, filters.month]
  );
  const reasonChartData = useMemo(() => createReasonBreakdownData(globalFilteredClients), [globalFilteredClients]);
  const retentionPieData = useMemo(() => createRetentionPieData(globalFilteredClients), [globalFilteredClients]);
  const insights = useMemo(() => generateInsights(globalFilteredClients, trendData), [globalFilteredClients, trendData]);

  return {
    accountManagers,
    activePeriodLabel,
    allClients,
    cancellationReasons,
    driverBars,
    dynamicKpis,
    globalFilteredClients,
    insights,
    leadSourceBars,
    monthOptions,
    reasonChartData,
    retentionPieData,
    sortedClients,
    trendData,
    yearOptions,
  };
}
