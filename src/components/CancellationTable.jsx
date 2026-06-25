import Tag from "./Tag.jsx";

export default function CancellationTable({
  columns,
  rows,
  sortableColumns = [],
  sortState,
  onSort,
  pagination,
}) {
  const sortableColumnSet = new Set(sortableColumns);
  const visibleRows = pagination ? rows.slice(pagination.startIndex, pagination.endIndex) : rows;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {columns.map((column) => {
                const isSortable = sortableColumnSet.has(column);
                const isSorted = sortState?.column === column;

                return (
                  <th
                    key={column}
                    className="border-b border-lucro-border px-2.5 py-2 text-left text-[9px] uppercase tracking-[0.1em] text-lucro-muted"
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(column)}
                        className="flex items-center gap-1 font-bold uppercase tracking-[0.1em] transition hover:text-lucro-accent"
                      >
                        <span>{column}</span>
                        <span className="text-[9px]">{isSorted ? (sortState.direction === "asc" ? "up" : "down") : "-"}</span>
                      </button>
                    ) : (
                      column
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, rowIndex) => (
              <tr
                key={`${pagination?.startIndex || 0}-${rowIndex}-${row.cells[0]?.text || "row"}`}
                className={`${row.emphasis ? "bg-lucro-accent3/5 font-semibold" : ""} group`}
              >
                {columns.map((column, cellIndex) => {
                  const cell = row.cells[cellIndex] || { text: "" };
                  const isReason = column.toLowerCase().includes("reason") || column.toLowerCase().includes("why");

                  return (
                    <td
                      key={`${column}-${cellIndex}`}
                      className={`border-b border-lucro-border px-2.5 py-2.5 align-top group-last:border-b-0 group-hover:bg-lucro-accent3/5 ${
                        isReason ? "text-lucro-muted" : ""
                      }`}
                    >
                      <Tag variant={cell.tagVariant}>{cell.text}</Tag>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-lucro-border pt-4">
          <div className="text-[11px] text-lucro-muted">
            Showing <span className="font-bold text-lucro-text">{pagination.startIndex + 1}</span>-
            <span className="font-bold text-lucro-text">{Math.min(pagination.endIndex, rows.length)}</span> of{" "}
            <span className="font-bold text-lucro-text">{rows.length}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-[11px] text-lucro-muted">
              Rows
              <select
                value={pagination.pageSize}
                onChange={(event) => pagination.onPageSizeChange(Number(event.target.value))}
                className="rounded-lg border border-lucro-border bg-lucro-surface px-2 py-1.5 text-[11px] text-lucro-text focus:border-lucro-accent focus:outline-none"
              >
                {pagination.pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={pagination.onPreviousPage}
              disabled={pagination.page === 1}
              className="rounded-lg border border-lucro-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-lucro-muted transition hover:border-lucro-accent hover:text-lucro-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-[11px] text-lucro-muted">
              Page <span className="font-bold text-lucro-text">{pagination.page}</span> of{" "}
              <span className="font-bold text-lucro-text">{pagination.totalPages}</span>
            </span>
            <button
              type="button"
              onClick={pagination.onNextPage}
              disabled={pagination.page === pagination.totalPages}
              className="rounded-lg border border-lucro-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-lucro-muted transition hover:border-lucro-accent hover:text-lucro-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
