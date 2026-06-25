export const toneClasses = {
  accent: {
    text: "text-lucro-accent",
    bg: "bg-lucro-accent",
    before: "before:bg-lucro-accent",
    stroke: "stroke-lucro-accent",
    fill: "fill-lucro-accent",
  },
  accent2: {
    text: "text-lucro-accent2",
    bg: "bg-lucro-accent2",
    before: "before:bg-lucro-accent2",
    stroke: "stroke-lucro-accent2",
    fill: "fill-lucro-accent2",
  },
  accent3: {
    text: "text-lucro-accent3",
    bg: "bg-lucro-accent3",
    before: "before:bg-lucro-accent3",
    stroke: "stroke-lucro-accent3",
    fill: "fill-lucro-accent3",
  },
  rust: {
    text: "text-lucro-rust",
    bg: "bg-lucro-rust",
    before: "before:bg-lucro-rust",
    stroke: "stroke-lucro-rust",
    fill: "fill-lucro-rust",
  },
  danger: {
    text: "text-lucro-danger",
    bg: "bg-lucro-danger",
    before: "before:bg-lucro-danger",
    stroke: "stroke-lucro-danger",
    fill: "fill-lucro-danger",
  },
  warn: {
    text: "text-lucro-warn",
    bg: "bg-lucro-warn",
    before: "before:bg-lucro-warn",
    stroke: "stroke-lucro-warn",
    fill: "fill-lucro-warn",
  },
  teal: {
    text: "text-lucro-teal",
    bg: "bg-lucro-teal",
    before: "before:bg-lucro-teal",
    stroke: "stroke-lucro-teal",
    fill: "fill-lucro-teal",
  },
  olive: {
    text: "text-lucro-olive",
    bg: "bg-lucro-olive",
    before: "before:bg-lucro-olive",
    stroke: "stroke-lucro-olive",
    fill: "fill-lucro-olive",
  },
  ok: {
    text: "text-lucro-ok",
    bg: "bg-lucro-ok",
    before: "before:bg-lucro-ok",
    stroke: "stroke-lucro-ok",
    fill: "fill-lucro-ok",
  },
  slate: {
    text: "text-lucro-slate",
    bg: "bg-lucro-slate",
    before: "before:bg-lucro-slate",
    stroke: "stroke-lucro-slate",
    fill: "fill-lucro-slate",
  },
  purple: {
    text: "text-lucro-purple",
    bg: "bg-lucro-purple",
    before: "before:bg-lucro-purple",
    stroke: "stroke-lucro-purple",
    fill: "fill-lucro-purple",
  },
  hot: {
    text: "text-lucro-hot",
    bg: "bg-lucro-hot",
    before: "before:bg-lucro-hot",
    stroke: "stroke-lucro-hot",
    fill: "fill-lucro-hot",
  },
  text: {
    text: "text-lucro-text",
    bg: "bg-lucro-text",
    before: "before:bg-lucro-text",
    stroke: "stroke-lucro-text",
    fill: "fill-lucro-text",
  },
};

export const tagClasses = {
  red: "border-lucro-danger/35 bg-lucro-danger/10 text-lucro-danger",
  orange: "border-lucro-warn/35 bg-lucro-warn/10 text-lucro-warn",
  green: "border-lucro-ok/35 bg-lucro-ok/10 text-lucro-ok",
  blue: "border-lucro-accent2/35 bg-lucro-accent2/10 text-lucro-accent2",
};

export const badgeClasses = {
  live: "border-lucro-ok/35 bg-lucro-ok/15 text-lucro-ok",
  soon: "border-lucro-slate/30 bg-lucro-slate/10 text-lucro-muted",
  test: "border-lucro-warn/35 bg-lucro-warn/10 text-lucro-warn",
};

export function getToneClasses(tone = "accent") {
  return toneClasses[tone] || toneClasses.accent;
}
