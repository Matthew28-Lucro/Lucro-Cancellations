import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const sourcePath = process.argv[2];
const outputPath = resolve("src/data/cancellations.js");

if (!sourcePath) {
  throw new Error("Provide a source CSV path.");
}

const csv = readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, "");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((entry) => entry.some((value) => String(value).trim() !== ""));
}

function clean(value, fallback = "") {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  if (/^(n\.?a\.?|na|n\/a|-|null|undefined)$/i.test(text)) return fallback;
  return text.replace(/^"(.*)"$/, "$1").trim() || fallback;
}

function get(row, headers, name, fallback = "") {
  const index = headers.indexOf(name);
  return index >= 0 ? clean(row[index], fallback) : fallback;
}

function firstMeaningful(values, fallback = "Unclear") {
  const found = values.map((value) => clean(value)).find(Boolean);
  return found || fallback;
}

function parseRequestDate(value) {
  const raw = clean(value);
  const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return "";

  const [, monthValue, dayValue, yearValue] = match;
  const month = Number(monthValue);
  const day = Number(dayValue);
  const year = Number(yearValue);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return "";
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function inferRevenueTierValue(revenueTier) {
  const tier = clean(revenueTier).toLowerCase().replace(/\s+/g, "");
  if (!tier) return 25000;
  if (tier.includes("250k")) return 275000;
  if (tier.includes("151k") || tier.includes("200k")) return 200000;
  if (tier.includes("101k") || tier.includes("150k")) return 150000;
  if (tier.includes("51k") || tier.includes("100")) return 75000;
  if (tier.includes("$0") || tier.includes("50k")) return 35000;
  if (tier.includes("data") || tier.includes("available") || tier.includes("unknown")) return 25000;
  return 50000;
}

function slug(value, fallback) {
  return clean(value, fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || fallback;
}

const parsed = parseCsv(csv);
const headers = parsed[0].map((header) => clean(header));
const rows = parsed.slice(1);

const cancellations = rows.map((row, index) => {
  const practice = get(row, headers, "Practice Name", "Unknown Practice");
  const rawRequestDate = clean(get(row, headers, "Cancellation Request Date")) || "Before Tracker";
  const primaryDriver = get(row, headers, "Primary Churn Driver");
  const generalReason = get(row, headers, "General Reason");
  const secondaryDriver = get(row, headers, "Secondary Driver");
  const clientReason =
    get(row, headers, "Client-Stated Reason (Short)") ||
    get(row, headers, "Internal Root Cause Summary") ||
    "-";
  const ongoingManager = get(row, headers, "Ongoing Account Manager");
  const onboardingManager = get(row, headers, "Onboarding Manager");
  const revenueTier = get(row, headers, "Monthly Revenue Tier", "Unknown");

  return {
    id: `${String(index + 1).padStart(3, "0")}-${slug(practice, `practice-${index + 1}`)}`,
    client_name: practice,
    cancellation_reason: firstMeaningful([generalReason, primaryDriver, secondaryDriver], "Unclear"),
    primary_churn_driver: firstMeaningful([primaryDriver, generalReason, secondaryDriver], "Unclear"),
    revenue: inferRevenueTierValue(revenueTier),
    revenue_tier: revenueTier,
    status: get(row, headers, "Cancelled or Paused", "Unknown"),
    account_manager: firstMeaningful([ongoingManager, onboardingManager], "Unassigned"),
    created_at: parseRequestDate(rawRequestDate),
    cancellation_request_date: rawRequestDate,
    final_month: get(row, headers, "Final Month"),
    paused_follow_up_date: get(row, headers, "Paused Follow-up Date"),
    phase: get(row, headers, "Phase", "Unknown"),
    preventable: get(row, headers, "Preventable?", "Unclear"),
    engagement_level: get(row, headers, "Engagement Level (Last 90 Days)", "Unknown"),
    tone: get(row, headers, "Tone at Cancellations", "Unknown"),
    lead_source: get(row, headers, "Lead Source/ Referral", "Unknown / Not Recorded"),
    client_reason: clientReason,
    time_phase: get(row, headers, "Time phase", "Unknown"),
    months_with_lucro: get(row, headers, "# Months w/Lucro"),
    estimated_days_in_onboarding: get(row, headers, "Estimated Days in OB+"),
  };
});

const sourceSummary = {
  source_file: sourcePath.split(/[\\/]/).pop(),
  row_count: cancellations.length,
  dated_records: cancellations.filter((row) => row.created_at).length,
  undated_records: cancellations.filter((row) => !row.created_at).length,
  june_2026_records: cancellations.filter((row) => row.final_month === "Jun 2026").length,
};

const contents = `// Generated from ${sourceSummary.source_file}.
// Deliberately excludes client emails and personal contact names for the public dashboard bundle.

export const cancellationSourceSummary = ${JSON.stringify(sourceSummary, null, 2)};

export const localCancellations = ${JSON.stringify(cancellations, null, 2)};
`;

writeFileSync(outputPath, contents, "utf8");
console.log(JSON.stringify(sourceSummary, null, 2));
