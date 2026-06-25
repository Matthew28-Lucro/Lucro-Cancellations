import { useEffect, useMemo, useState } from "react";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "../constants/dashboard.js";

export default function usePagination(totalItems) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setPage(1);
  }, [totalItems, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return useMemo(
    () => ({
      endIndex: page * pageSize,
      onNextPage: () => setPage((current) => Math.min(current + 1, totalPages)),
      onPageSizeChange: setPageSize,
      onPreviousPage: () => setPage((current) => Math.max(current - 1, 1)),
      page,
      pageSize,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      startIndex: (page - 1) * pageSize,
      totalPages,
    }),
    [page, pageSize, totalPages]
  );
}
