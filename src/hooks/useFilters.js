import { useEffect, useMemo, useState } from "react";
import { FILTER_DEBOUNCE_MS, FILTER_STORAGE_KEY, INITIAL_FILTERS } from "../constants/dashboard.js";

function readStoredFilters() {
  if (typeof window === "undefined") return INITIAL_FILTERS;

  try {
    const raw = window.localStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) return INITIAL_FILTERS;

    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_FILTERS,
      ...parsed,
      dateRange: {
        ...INITIAL_FILTERS.dateRange,
        ...parsed.dateRange,
      },
    };
  } catch {
    return INITIAL_FILTERS;
  }
}

export default function useFilters() {
  const [filters, setFilters] = useState(() => readStoredFilters());
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedFilters(filters), FILTER_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const actions = useMemo(
    () => ({
      updateFilters(value) {
        setFilters((current) => ({ ...current, ...value }));
      },
      resetFilters() {
        setFilters(INITIAL_FILTERS);
      },
    }),
    []
  );

  return { filters, debouncedFilters, ...actions };
}
