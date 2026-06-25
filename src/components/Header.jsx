import { useEffect, useRef, useState } from "react";
import { badgeClasses } from "./styleMaps.js";

export default function Header({
  brand,
  titlePrefix,
  titleAccent,
  period,
  quarterOptions,
  selectedQuarter,
  onQuarterChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const activeOption = quarterOptions.find((option) => option.id === selectedQuarter);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

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

      <div className="flex flex-wrap items-center gap-3">
        {period ? (
          <div className="rounded-full border border-lucro-border px-3.5 py-1.5 text-xs text-lucro-muted">
            {period}
          </div>
        ) : null}

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="flex items-center gap-2 rounded-[10px] border border-lucro-border bg-white px-4 py-2.5 text-[13px] font-bold tracking-[0.04em] text-lucro-text shadow-[0_2px_8px_rgba(31,53,196,0.12)] transition hover:border-lucro-accent hover:shadow-[0_4px_14px_rgba(31,53,196,0.20)]"
          >
            <span>{activeOption?.label || "Overview"}</span>
            <span
              className={`text-[10px] text-lucro-muted transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              v
            </span>
          </button>

          {isOpen ? (
            <div className="absolute right-0 z-20 mt-2 max-h-80 min-w-48 overflow-y-auto rounded-xl border border-lucro-border bg-white shadow-dropdown">
              {quarterOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => {
                    onQuarterChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-4 border-b border-lucro-border px-4 py-3 text-left text-xs font-semibold tracking-[0.04em] text-lucro-text transition last:border-b-0 hover:bg-[#dde0f0] ${
                    option.id === selectedQuarter ? "bg-lucro-accent2/10 text-lucro-accent" : ""
                  }`}
                >
                  <span>{option.label}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] ${
                      badgeClasses[option.badgeVariant] || badgeClasses.live
                    }`}
                  >
                    {option.badge}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
