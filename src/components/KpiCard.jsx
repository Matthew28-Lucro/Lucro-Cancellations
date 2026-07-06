import { getToneClasses } from "./styleMaps.js";

export default function KpiCard({ label, value, subtext, tone = "accent" }) {
  const toneClass = getToneClasses(tone);
  const isCompactValue = String(value).length > 6 || Number.isNaN(Number(value));

  return (
    <article
      className={`relative overflow-hidden rounded-[12px] border border-lucro-border bg-lucro-card px-[18px] py-5 shadow-panel transition-transform duration-200 hover:-translate-y-0.5 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:rounded-t-[12px] ${toneClass.before}`}
    >
      <div className="mb-2.5 text-[10px] uppercase text-lucro-muted">
        {label}
      </div>
      <div
        className={`${toneClass.text} font-display font-extrabold leading-none ${
          isCompactValue ? "pt-1 text-lg" : "text-4xl"
        }`}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[10px] text-lucro-muted">{subtext}</div>
    </article>
  );
}
