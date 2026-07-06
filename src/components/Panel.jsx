import { getToneClasses } from "./styleMaps.js";

export function PanelTitle({ children, tone = "accent" }) {
  const toneClass = getToneClasses(tone);

  return (
    <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase text-lucro-muted">
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneClass.bg}`} />
      <span>{children}</span>
    </div>
  );
}

export function PanelDivider() {
  return <div className="my-4 h-px bg-lucro-border" />;
}

export default function Panel({ title, titleTone = "accent", children, className = "" }) {
  return (
    <section className={`animate-card-in rounded-[12px] border border-lucro-border bg-lucro-card p-[22px] shadow-panel transition duration-200 hover:border-lucro-accent/50 hover:shadow-dropdown ${className}`}>
      {title ? <PanelTitle tone={titleTone}>{title}</PanelTitle> : null}
      {children}
    </section>
  );
}
