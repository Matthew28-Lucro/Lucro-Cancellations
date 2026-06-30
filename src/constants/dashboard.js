export const APP_META = {
  brand: "Lucro - Strategy & Retention",
  titlePrefix: "Cancellation",
  titleAccent: "Tracker",
};

export const CANCELLATION_COLUMNS = [
  "Request Date",
  "Client",
  "Status",
  "Phase",
  "Cancellation Reason",
  "Account Manager",
  "Revenue Tier",
  "Preventable",
  "Lead Source",
  "Client Reason",
];

export const SORTABLE_COLUMN_MAP = {
  "Request Date": "date",
  Client: "client",
  "Revenue Tier": "revenueTierValue",
};

export const INITIAL_FILTERS = {
  cancellationReason: "",
  accountManager: "",
  dateRange: { from: "", to: "" },
};

export const INITIAL_SORT = {
  column: "Request Date",
  key: "date",
  direction: "desc",
};

export const PAGE_SIZE_OPTIONS = [10, 25, 50];

export const DEFAULT_PAGE_SIZE = 10;

export const FILTER_STORAGE_KEY = "lucro-dashboard-filters";

export const FILTER_DEBOUNCE_MS = 250;
