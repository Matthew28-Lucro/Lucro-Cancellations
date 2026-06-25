const ACCOUNT_MANAGERS = [
  "Avery Lane",
  "Jordan Cruz",
  "Morgan Patel",
  "Riley Chen",
  "Taylor Brooks",
];

const MONTH_INDEX_BY_NAME = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const WIDTH_BUCKETS = [
  { max: 0, className: "w-0" },
  { max: 10, className: "w-[10%]" },
  { max: 20, className: "w-[20%]" },
  { max: 30, className: "w-[30%]" },
  { max: 40, className: "w-[40%]" },
  { max: 50, className: "w-[50%]" },
  { max: 60, className: "w-[60%]" },
  { max: 70, className: "w-[70%]" },
  { max: 80, className: "w-[80%]" },
  { max: 90, className: "w-[90%]" },
  { max: 100, className: "w-full" },
];

const BAR_TONES = ["rust", "warn", "olive", "teal", "ok", "purple", "slate", "danger", "accent2"];

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function findColumnIndex(columns, patterns) {
  return columns.findIndex((column) => {
    const normalizedColumn = column.toLowerCase();
    return patterns.some((pattern) => normalizedColumn.includes(pattern));
  });
}

function getCellText(columns, row, patterns, fallback = "") {
  const index = findColumnIndex(columns, patterns);
  return index >= 0 ? row.cells[index]?.text || fallback : fallback;
}

function getCellVariant(columns, row, patterns) {
  const index = findColumnIndex(columns, patterns);
  return index >= 0 ? row.cells[index]?.tagVariant || null : null;
}

function parsePeriodDate(period, rowIndex) {
  const [monthName, yearValue] = period.toLowerCase().split(" ");
  const monthIndex = MONTH_INDEX_BY_NAME[monthName] ?? 0;
  const year = Number(yearValue) || 2026;
  const day = String((rowIndex % 27) + 1).padStart(2, "0");
  const month = String(monthIndex + 1).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function inferRevenueAtRisk(revenueTier) {
  const tier = revenueTier.toLowerCase();

  if (tier.includes("$250") || tier.includes("250k+")) return 275000;
  if (tier.includes("$151") || tier.includes("151k")) return 200000;
  if (tier.includes("$101") || tier.includes("101k")) return 150000;
  if (tier.includes("$51") || tier.includes("51k")) return 75000;
  if (tier.includes("$0") || tier.includes("50k")) return 35000;
  if (tier.includes("unknown") || tier.includes("not available") || tier === "-") return 25000;

  return 50000;
}

function inferRecoveryRevenue({ status, preventable, revenueAtRisk }) {
  if (/paused/i.test(status)) return revenueAtRisk * 0.45;
  if (/yes/i.test(preventable)) return revenueAtRisk * 0.3;
  if (/unclear/i.test(preventable)) return revenueAtRisk * 0.1;

  return revenueAtRisk * 0.04;
}

function toDateOnly(value) {
  if (!value) return "";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value).slice(0, 10);
  return parsedDate.toISOString().slice(0, 10);
}

function getPeriodId(date) {
  return date ? date.slice(0, 7) : "unknown";
}

function getPeriodLabel(date) {
  const parsedDate = new Date(`${date || "1970-01-01"}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return "Unknown Date";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function getReasonVariant(reason) {
  const normalizedReason = String(reason).toLowerCase();
  if (normalizedReason.includes("satisfied") || normalizedReason.includes("misalignment")) return "red";
  if (normalizedReason.includes("paused") || normalizedReason.includes("financial") || normalizedReason.includes("cpa")) return "orange";
  if (normalizedReason.includes("in-house") || normalizedReason.includes("value") || normalizedReason.includes("unclear")) return "blue";
  return "orange";
}

function normalizeStatus(columns, row) {
  const explicitStatus = getCellText(columns, row, ["status"]);
  if (explicitStatus) return explicitStatus;

  const rowText = row.cells.map((cell) => cell.text).join(" ");
  return /paused/i.test(rowText) ? "Paused" : "Cancelled";
}

function normalizeWidthClass(percent) {
  const width = Math.max(0, Math.min(100, Math.round(percent)));
  return WIDTH_BUCKETS.find((bucket) => width <= bucket.max)?.className || "w-full";
}

function normalizeTableRows(dashboard, dashboardId, rowOffset) {
  const { columns, rows } = dashboard.clientTable;
  const period = dashboard.period || dashboard.label;

  return rows.map((row, rowIndex) => {
    const client = row.cells[0]?.text || "Unknown Client";
    const status = normalizeStatus(columns, row);
    const phase = getCellText(columns, row, ["phase"], "Unknown");
    const cancellationReason = getCellText(columns, row, ["primary driver", "driver"], "Unclear");
    const revenueTier = getCellText(columns, row, ["revenue"], "Unknown");
    const tone = getCellText(columns, row, ["tone"], "Unknown");
    const preventable = getCellText(columns, row, ["preventable"], "Unclear");
    const leadSource = getCellText(columns, row, ["lead"], "Unknown / Not Recorded");
    const clientReason = getCellText(columns, row, ["client reason", "reason"], "-");
    const revenueAtRisk = inferRevenueAtRisk(revenueTier);
    const accountManager = ACCOUNT_MANAGERS[(rowOffset + rowIndex) % ACCOUNT_MANAGERS.length];

    return {
      id: `${dashboardId}-${rowIndex}-${client.replace(/\W+/g, "-").toLowerCase()}`,
      periodId: dashboardId,
      period,
      date: parsePeriodDate(period, rowIndex),
      client,
      status,
      statusVariant: getCellVariant(columns, row, ["status"]) || (status === "Paused" ? "orange" : "red"),
      phase,
      phaseVariant: getCellVariant(columns, row, ["phase"]) || "blue",
      cancellationReason,
      reasonVariant: getCellVariant(columns, row, ["primary driver", "driver"]) || "orange",
      accountManager,
      revenueTier,
      revenueAtRisk,
      recoveredRevenue: inferRecoveryRevenue({ status, preventable, revenueAtRisk }),
      tone,
      preventable,
      preventableVariant: getCellVariant(columns, row, ["preventable"]) || "blue",
      leadSource: leadSource === "-" ? "Unknown / Not Recorded" : leadSource,
      clientReason,
    };
  });
}

export function buildCancellationDataset(dashboardData) {
  let rowOffset = 0;

  return Object.entries(dashboardData).flatMap(([dashboardId, dashboard]) => {
    const rows = normalizeTableRows(dashboard, dashboardId, rowOffset);
    rowOffset += rows.length;
    return rows;
  });
}

export function mapApiCancellationsToClientRecords(cancellations) {
  return cancellations.map((row, index) => {
    const date = toDateOnly(row.created_at);
    const status = row.status || "Cancelled";
    const cancellationReason = row.cancellation_reason || "Unclear";
    const revenueAtRisk = Number(row.revenue) || 0;

    return {
      id: row.id || `cancellation-${index}`,
      periodId: getPeriodId(date),
      period: getPeriodLabel(date),
      date,
      client: row.client_name || "Unknown Client",
      status,
      statusVariant: /paused/i.test(status) ? "orange" : "red",
      phase: row.phase || "Unknown",
      phaseVariant: row.phase ? "blue" : null,
      cancellationReason,
      reasonVariant: getReasonVariant(cancellationReason),
      accountManager: row.account_manager || "Unassigned",
      revenueTier: row.revenue_tier || "Backend revenue",
      revenueAtRisk,
      recoveredRevenue: Number(row.recovered_revenue) || inferRecoveryRevenue({
        status,
        preventable: row.preventable || "Unclear",
        revenueAtRisk,
      }),
      tone: row.tone || "Unknown",
      preventable: row.preventable || "Unclear",
      preventableVariant: /yes/i.test(row.preventable || "") ? "green" : /no/i.test(row.preventable || "") ? "red" : "blue",
      leadSource: row.lead_source || "Unknown / Not Recorded",
      clientReason: row.client_reason || "-",
      raw: row,
    };
  });
}

export function createPeriodOptions(data) {
  const periods = new Map();

  data.forEach((item) => {
    if (!item.periodId || item.periodId === "unknown") return;
    periods.set(item.periodId, item.period);
  });

  return [
    { id: "overview", label: "Overview", period: "", badge: "All Months", badgeVariant: "live" },
    ...[...periods.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, label]) => ({ id, label, period: label, badge: "Live", badgeVariant: "live" })),
  ];
}

export function calculateRetentionRate(data) {
  if (!data.length) return 100;

  const estimatedAccountBase = data.length + 185;
  const retainedAccounts = estimatedAccountBase - data.length;

  return (retainedAccounts / estimatedAccountBase) * 100;
}

export function calculateRevenueAtRisk(data) {
  return data.reduce((total, item) => total + item.revenueAtRisk, 0);
}

export function calculateRecoveryRate(data) {
  const revenueAtRisk = calculateRevenueAtRisk(data);
  if (!revenueAtRisk) return 0;

  const recoveredRevenue = data.reduce((total, item) => total + item.recoveredRevenue, 0);
  return (recoveredRevenue / revenueAtRisk) * 100;
}

export function getUniqueOptions(data, key) {
  return [...new Set(data.map((item) => item[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function filterCancellationData(data, filters) {
  return data.filter((item) => {
    const reasonMatch = !filters.cancellationReason || item.cancellationReason === filters.cancellationReason;
    const managerMatch = !filters.accountManager || item.accountManager === filters.accountManager;
    const startMatch = !filters.dateRange.from || item.date >= filters.dateRange.from;
    const endMatch = !filters.dateRange.to || item.date <= filters.dateRange.to;

    return reasonMatch && managerMatch && startMatch && endMatch;
  });
}

export function sortCancellationData(data, sortConfig) {
  const direction = sortConfig.direction === "asc" ? 1 : -1;

  return [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "revenueAtRisk") return (aValue - bValue) * direction;
    return String(aValue).localeCompare(String(bValue)) * direction;
  });
}

export function createBarItems(data, key) {
  const counts = data.reduce((map, item) => {
    const label = item[key] || "Unknown / Not Recorded";
    map.set(label, (map.get(label) || 0) + 1);
    return map;
  }, new Map());

  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = Math.max(...entries.map(([, count]) => count), 1);

  return entries.map(([label, count], index) => ({
    label,
    count: String(count),
    tone: BAR_TONES[index % BAR_TONES.length],
    widthClass: normalizeWidthClass((count / max) * 100),
  }));
}

function formatDateLabel(date, granularity) {
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;

  if (granularity === "day") {
    return `${MONTH_LABELS[parsedDate.getMonth()]} ${parsedDate.getDate()}`;
  }

  return `${MONTH_LABELS[parsedDate.getMonth()]} ${String(parsedDate.getFullYear()).slice(-2)}`;
}

export function createCancellationTrendData(data, granularity = "month") {
  const counts = data.reduce((map, item) => {
    const key = granularity === "day" ? item.date : item.date.slice(0, 7);
    const current = map.get(key) || { key, cancellations: 0, revenueAtRisk: 0 };
    current.cancellations += 1;
    current.revenueAtRisk += item.revenueAtRisk;
    map.set(key, current);
    return map;
  }, new Map());

  return [...counts.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((item) => ({
      ...item,
      label: formatDateLabel(granularity === "day" ? item.key : `${item.key}-01`, granularity),
    }));
}

export function createReasonBreakdownData(data) {
  const counts = data.reduce((map, item) => {
    const current = map.get(item.cancellationReason) || {
      name: item.cancellationReason,
      cancellations: 0,
      revenueAtRisk: 0,
    };
    current.cancellations += 1;
    current.revenueAtRisk += item.revenueAtRisk;
    map.set(item.cancellationReason, current);
    return map;
  }, new Map());

  return [...counts.values()].sort((a, b) => b.cancellations - a.cancellations || a.name.localeCompare(b.name));
}

export function createRetentionPieData(data) {
  const lost = data.length;
  const estimatedAccountBase = lost + 185;
  const retained = Math.max(estimatedAccountBase - lost, 0);

  return [
    { name: "Retained", value: retained },
    { name: "Lost", value: lost },
  ];
}

export function generateInsights(data, trendData) {
  if (!data.length) {
    return [
      "No cancellations match the current filters.",
      "Widen the date range or clear a filter to restore analytics.",
    ];
  }

  const reasonData = createReasonBreakdownData(data);
  const topReason = reasonData[0];
  const revenueAtRisk = calculateRevenueAtRisk(data);
  const recoveryRate = calculateRecoveryRate(data);
  const preventableCount = data.filter((item) => /^yes$/i.test(item.preventable)).length;
  const latest = trendData[trendData.length - 1];
  const previous = trendData[trendData.length - 2];
  let trendInsight = "Not enough time-series data to compare retention movement yet.";

  if (latest && previous) {
    const delta = previous.cancellations
      ? ((previous.cancellations - latest.cancellations) / previous.cancellations) * 100
      : 0;
    const direction = delta >= 0 ? "improved" : "declined";
    trendInsight = `Retention ${direction} by ${Math.abs(delta).toFixed(1)}% versus the previous visible period.`;
  }

  return [
    `Most cancellations happen due to ${topReason.name} (${topReason.cancellations} records).`,
    trendInsight,
    `${formatCurrency(revenueAtRisk)} is currently at risk across the filtered dataset.`,
    `${preventableCount} cancellations are marked clearly preventable; estimated recovery rate is ${recoveryRate.toFixed(1)}%.`,
  ];
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: value >= 1000000 ? "compact" : "standard",
  }).format(value);
}
