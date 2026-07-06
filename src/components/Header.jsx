export default function Header({ brand, titlePrefix, titleAccent, period }) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-[13px] font-semibold uppercase text-lucro-muted">
          {brand}
        </div>
        <h1 className="mt-1 font-display text-[32px] font-extrabold leading-none text-lucro-text sm:text-[44px] lg:text-[52px]">
          {titlePrefix} <span className="text-lucro-accent">{titleAccent}</span>
        </h1>
      </div>

      <div className="rounded-lg border border-lucro-border bg-white px-4 py-2.5 text-[13px] font-bold text-lucro-text shadow-panel">
        {period || "All Months"}
      </div>
    </header>
  );
}
