export default function SectionLabel({ children }) {
  return (
    <div className="mb-3.5 mt-8 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.18em] text-lucro-muted after:h-px after:flex-1 after:bg-lucro-border">
      {children}
    </div>
  );
}
