import KpiCard from "./KpiCard.jsx";

export default function KpiGrid({ items }) {
  return (
    <div className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
      {items.map((item) => (
        <KpiCard key={`${item.label}-${item.value}`} {...item} />
      ))}
    </div>
  );
}
