import { useMemo } from "react";
import {
  calculateRetentionRate,
  calculateSaveOpportunityRate,
  createBarItems,
  createCancellationTrendData,
  createPeriodOptions,
  createReasonBreakdownData,
  createRetentionPieData,
  filterCancellationData,
  generateInsights,
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

export default function useMetrics({ cancellations, filters, selectedPeriod, sort }) {
  const allClients = useMemo(() => mapApiCancellationsToClientRecords(cancellations), [cancellations]);
  const periodOptions = useMemo(() => createPeriodOptions(allClients), [allClients]);
  const activeOption = useMemo(
    () => periodOptions.find((option) => option.id === selectedPeriod) || periodOptions[0],
    [periodOptions, selectedPeriod]
  );

  const dateBounds = useMemo(() => {
    const dates = allClients.map((client) => client.date).filter(Boolean).sort();
    return { min: dates[0] || "", max: dates[dates.length - 1] || "" };
  }, [allClients]);

  const cancellationReasons = useMemo(() => getUniqueOptions(allClients, "cancellationReason"), [allClients]);
  const accountManagers = useMemo(() => getUniqueOptions(allClients, "accountManager"), [allClients]);
  const globalFilteredClients = useMemo(
    () => filterCancellationData(allClients, filters),
    [allClients, filters]
  );
  const scopedClients = useMemo(() => {
    if (selectedPeriod === "overview") return globalFilteredClients;
    return globalFilteredClients.filter((client) => client.periodId === selectedPeriod);
  }, [globalFilteredClients, selectedPeriod]);
  const sortedClients = useMemo(
    () => sortCancellationData(scopedClients, sort),
    [scopedClients, sort]
  );
  const dynamicKpis = useMemo(() => buildDynamicKpis(scopedClients), [scopedClients]);
  const driverBars = useMemo(() => createBarItems(scopedClients, "cancellationReason"), [scopedClients]);
  const leadSourceBars = useMemo(() => createBarItems(scopedClients, "leadSource"), [scopedClients]);
  const trendData = useMemo(
    () => createCancellationTrendData(scopedClients, selectedPeriod === "overview" ? "month" : "day"),
    [scopedClients, selectedPeriod]
  );
  const reasonChartData = useMemo(() => createReasonBreakdownData(scopedClients), [scopedClients]);
  const retentionPieData = useMemo(() => createRetentionPieData(scopedClients), [scopedClients]);
  const insights = useMemo(() => generateInsights(scopedClients, trendData), [scopedClients, trendData]);

  return {
    accountManagers,
    activeOption,
    allClients,
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
    scopedClients,
    sortedClients,
    trendData,
  };
}
