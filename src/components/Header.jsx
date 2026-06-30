export default function Header({ brand, titlePrefix, titleAccent, period }) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-lucro-muted">
          {brand}
        </div>
        <h1 className="mt-1 text-[clamp(28px,5vw,52px)] font-extrabold leading-none text-lucro-text">
          {titlePrefix} <span className="text-lucro-accent">{titleAccent}</span>
        </h1>
      </div>

      <div className="rounded-[10px] border border-lucro-border bg-white px-4 py-2.5 text-[13px] font-bold tracking-[0.04em] text-lucro-text shadow-[0_2px_8px_rgba(31,53,196,0.12)]">
        {period || "All Months"}
      </div>
    </header>
  );
}
