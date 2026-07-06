export const LUCRO_DESIGN_SYSTEM = {
  name: "Lucro",
  voice: {
    name: "fractional-CFO-direct",
    description:
      "Confident, data-forward, calm under a lot of numbers. Speaks to chiropractic practice owners, not to finance departments.",
  },
  colors: [
    {
      token: "Navy Ink",
      tailwind: "lucro.brand.navy-ink",
      hex: "#171A23",
      use: "Primary background, headers, and body text on white.",
    },
    {
      token: "Navy Tint",
      tailwind: "lucro.brand.navy-tint",
      hex: "#1B2A4A",
      use: "Secondary surfaces, chart series, and hover states.",
    },
    {
      token: "Signal Gold",
      tailwind: "lucro.brand.signal-gold",
      hex: "#FEE42F",
      use: "Primary accent for CTAs, key stats, and highlights. Use sparingly, one per view.",
    },
    {
      token: "Muted Gold",
      tailwind: "lucro.brand.muted-gold",
      hex: "#C9A84C",
      use: "Secondary accent, chart series, and badges on light backgrounds.",
    },
    {
      token: "Paper",
      tailwind: "lucro.brand.paper",
      hex: "#FFFFFF",
      use: "Report pages and card backgrounds.",
    },
    {
      token: "Surface",
      tailwind: "lucro.brand.surface",
      hex: "#F5F6F8",
      use: "Low-emphasis panels and table row striping.",
    },
    {
      token: "Ink 70%",
      tailwind: "lucro.brand.ink-70",
      hex: "#4A4E5A",
      use: "Body copy on white.",
    },
    {
      token: "Ink 40%",
      tailwind: "lucro.brand.ink-40",
      hex: "#9296A1",
      use: "Captions and muted labels.",
    },
    {
      token: "Line",
      tailwind: "lucro.brand.line",
      hex: "#E4E5EA",
      use: "Hairline borders and dividers.",
    },
  ],
  typography: [
    {
      role: "Display / H1",
      family: "Space Grotesk",
      size: "44-56px",
      weight: "700",
      use: "Use for dashboard titles, report covers, and page-defining statements.",
    },
    {
      role: "H2",
      family: "Space Grotesk",
      size: "28px",
      weight: "600",
      use: "Use for major report sections and panel groups.",
    },
    {
      role: "Eyebrow / Label",
      family: "Inter",
      size: "11-12px",
      weight: "700",
      use: "Use uppercase labels for sections, filters, and table metadata.",
    },
    {
      role: "Body",
      family: "Inter",
      size: "15-16px",
      weight: "400",
      use: "Use generous 1.7 line height because the reader is studying the numbers closely.",
    },
    {
      role: "Data / Mono Label",
      family: "Inter or Inter Mono",
      size: "12.5px",
      weight: "400-500",
      use: "Use for captions, axis labels, and small numeric metadata.",
    },
  ],
  componentRules: [
    {
      component: "Buttons",
      rule: "Small radius, 6-8px. Primary uses navy fill with gold text. Gold CTA uses gold fill with navy text and appears only once per screen. Secondary uses navy outline.",
    },
    {
      component: "Cards",
      rule: "Use 12px radius, hairline border, and at most one badge. A badge can use navy fill with gold text, but do not stack accents inside one card.",
    },
    {
      component: "Tables",
      rule: "Use a navy header row with white uppercase labels, alternating surface rows, and thin line dividers.",
    },
    {
      component: "Charts",
      rule: "Use Navy Tint as the default series. Reserve Signal Gold for the series that answers the page question.",
    },
    {
      component: "Stats",
      rule: "Use a large Space Grotesk numeral in navy, Muted Gold for the unit or suffix, and a small caption beneath.",
    },
  ],
  usageNotes: [
    "Gold is a highlight, not a background. One gold element per view, maximum.",
    "Navy carries the authority; gold marks the one thing that matters.",
    "Keep large surfaces navy or white. Do not make both surfaces busy in the same composition.",
    "Corner radii stay small throughout. This is a financial document, not a consumer app.",
  ],
  source:
    "Lucro Chiropractic Industry Report cover and interior pages. Navy #171A23 and gold #FEE42F sampled directly from source; navy tint and muted gold carried over from existing Lucro churn-tracker branding.",
};
