import { tagClasses } from "./styleMaps.js";

export default function Tag({ children, variant }) {
  if (!variant) return children;

  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] ${
        tagClasses[variant] || tagClasses.blue
      }`}
    >
      {children}
    </span>
  );
}
