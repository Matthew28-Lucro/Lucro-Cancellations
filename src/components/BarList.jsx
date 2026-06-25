import { getToneClasses } from "./styleMaps.js";

export default function BarList({ items }) {
  return (
    <div>
      {items.map((item) => {
        const toneClass = getToneClasses(item.tone);

        return (
          <div key={`${item.label}-${item.count}`} className="mb-[13px] flex items-center gap-3 text-[11px] last:mb-0">
            <div className="w-40 shrink-0 truncate text-lucro-text">{item.label}</div>
            <div className="h-2 flex-1 overflow-hidden rounded bg-lucro-border">
              <div className={`h-full rounded transition-[width] duration-700 ${toneClass.bg} ${item.widthClass}`} />
            </div>
            <div className="w-7 shrink-0 text-right text-lucro-muted">{item.count}</div>
          </div>
        );
      })}
    </div>
  );
}
