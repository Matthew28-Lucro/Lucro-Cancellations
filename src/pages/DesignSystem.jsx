import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { LUCRO_DESIGN_SYSTEM } from "../constants/lucroDesignSystem.js";

const { colors, componentRules, source, typography, usageNotes, voice } = LUCRO_DESIGN_SYSTEM;

const practiceStats = [
  { label: "Monthly collections gap", value: "R84k", suffix: "missed", caption: "Average leakage from under-read treatment plans" },
  { label: "Treatment plan close rate", value: "68", suffix: "%", caption: "Owner-level KPI for patient conversion" },
  { label: "Recall opportunity", value: "214", suffix: "patients", caption: "Patients overdue for revenue-positive care" },
];

const tableRows = [
  ["New patients", "142", "R412k", "Strong intake demand"],
  ["Plan acceptance", "68%", "R126k gap", "Coach consultation script"],
  ["Recall base", "214", "R198k upside", "Book reactivation block"],
  ["Claims lag", "11 days", "R74k held", "Tighten admin rhythm"],
];

const trendData = [
  { month: "Jan", collections: 410, target: 430 },
  { month: "Feb", collections: 438, target: 440 },
  { month: "Mar", collections: 424, target: 450 },
  { month: "Apr", collections: 462, target: 465 },
  { month: "May", collections: 471, target: 475 },
  { month: "Jun", collections: 486, target: 485 },
];

const mixData = [
  { name: "Adjustments", value: 58 },
  { name: "Rehab", value: 24 },
  { name: "Products", value: 11 },
  { name: "Other", value: 7 },
];

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-3 text-[11px] font-bold uppercase text-lucro-brand-ink-40 after:h-px after:flex-1 after:bg-lucro-brand-line">
        {eyebrow}
      </div>
      <h2 className="font-display text-[28px] font-semibold leading-tight text-lucro-brand-navy-ink">{title}</h2>
      {children ? <p className="mt-2 max-w-3xl text-[15px] leading-7 text-lucro-brand-ink-70">{children}</p> : null}
    </div>
  );
}

function ColorCard({ color }) {
  const isDark = color.hex === "#171A23" || color.hex === "#1B2A4A";

  return (
    <article className="overflow-hidden rounded-[12px] border border-lucro-brand-line bg-lucro-brand-paper shadow-panel">
      <div
        className="flex h-24 items-end justify-between border-b border-lucro-brand-line p-4"
        style={{ backgroundColor: color.hex }}
      >
        <span className={`font-display text-[18px] font-semibold ${isDark ? "text-white" : "text-lucro-brand-navy-ink"}`}>
          {color.token}
        </span>
        <span className={`font-mono text-[12px] ${isDark ? "text-white/70" : "text-lucro-brand-ink-70"}`}>{color.hex}</span>
      </div>
      <div className="p-4">
        <div className="font-mono text-[12px] text-lucro-brand-navy-tint">{color.tailwind}</div>
        <p className="mt-3 text-[13px] leading-6 text-lucro-brand-ink-70">{color.use}</p>
      </div>
    </article>
  );
}

function TypographyCard({ item }) {
  return (
    <article className="rounded-[12px] border border-lucro-brand-line bg-lucro-brand-paper p-5 shadow-panel">
      <div className="mb-3 text-[11px] font-bold uppercase text-lucro-brand-ink-40">{item.role}</div>
      <div className={item.family === "Space Grotesk" ? "font-display text-[28px] font-semibold text-lucro-brand-navy-ink" : "text-[16px] leading-7 text-lucro-brand-ink-70"}>
        {item.family}
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-[12px] text-lucro-brand-ink-70">
        <div>
          <dt className="font-bold text-lucro-brand-navy-ink">Size</dt>
          <dd>{item.size}</dd>
        </div>
        <div>
          <dt className="font-bold text-lucro-brand-navy-ink">Weight</dt>
          <dd>{item.weight}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[13px] leading-6 text-lucro-brand-ink-70">{item.use}</p>
    </article>
  );
}

function RuleCard({ title, body }) {
  return (
    <article className="rounded-[12px] border border-lucro-brand-line bg-lucro-brand-paper p-5 shadow-panel">
      <div className="mb-2 font-display text-[18px] font-semibold text-lucro-brand-navy-ink">{title}</div>
      <p className="text-[13px] leading-6 text-lucro-brand-ink-70">{body}</p>
    </article>
  );
}

function StatCard({ stat, highlighted }) {
  return (
    <article className="rounded-[12px] border border-lucro-brand-line bg-lucro-brand-paper p-5 shadow-panel">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-[11px] font-bold uppercase text-lucro-brand-ink-40">{stat.label}</div>
        {highlighted ? (
          <span className="rounded-md bg-lucro-brand-navy-ink px-2.5 py-1 text-[11px] font-bold text-lucro-brand-signal-gold">
            Focus
          </span>
        ) : null}
      </div>
      <div className="font-display text-[44px] font-bold leading-none text-lucro-brand-navy-ink">
        {stat.value}
        <span className="ml-2 text-[18px] text-lucro-brand-muted-gold">{stat.suffix}</span>
      </div>
      <p className="mt-3 text-[13px] leading-6 text-lucro-brand-ink-70">{stat.caption}</p>
    </article>
  );
}

function DemoTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-lucro-brand-line bg-lucro-brand-paper px-3 py-2 text-[12px] shadow-panel">
      <div className="mb-1 font-bold text-lucro-brand-navy-ink">{label}</div>
      {payload.map((item) => (
        <div key={item.dataKey} className="text-lucro-brand-ink-70">
          {item.name}: <span className="font-bold text-lucro-brand-navy-ink">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function ButtonSpecimen() {
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" className="rounded-md bg-lucro-brand-navy-ink px-4 py-2 text-[13px] font-bold text-lucro-brand-signal-gold">
        Primary
      </button>
      <button type="button" className="rounded-md bg-lucro-brand-signal-gold px-4 py-2 text-[13px] font-bold text-lucro-brand-navy-ink">
        Gold CTA
      </button>
      <button type="button" className="rounded-md border border-lucro-brand-navy-ink px-4 py-2 text-[13px] font-bold text-lucro-brand-navy-ink">
        Secondary
      </button>
    </div>
  );
}

function TableSpecimen() {
  return (
    <div className="overflow-hidden rounded-[12px] border border-lucro-brand-line bg-lucro-brand-paper shadow-panel">
      <table className="w-full border-collapse text-[13px]">
        <thead className="bg-lucro-brand-navy-ink text-white">
          <tr>
            {["Practice lever", "Current", "Value at stake", "Owner action"].map((heading) => (
              <th key={heading} className="px-4 py-3 text-left text-[11px] font-bold uppercase">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={row[0]} className={index % 2 ? "bg-lucro-brand-surface" : "bg-lucro-brand-paper"}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cell}
                  className={`border-t border-lucro-brand-line px-4 py-3 ${
                    cellIndex === 0 ? "font-bold text-lucro-brand-navy-ink" : "text-lucro-brand-ink-70"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartSpecimen() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
      <section className="rounded-[12px] border border-lucro-brand-line bg-lucro-brand-paper p-5 shadow-panel">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="text-[11px] font-bold uppercase text-lucro-brand-ink-40">Collections vs Target</div>
          <span className="rounded-md bg-lucro-brand-signal-gold px-2.5 py-1 text-[11px] font-bold text-lucro-brand-navy-ink">
            Gold answers the question
          </span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 18, left: -18, bottom: 8 }}>
              <CartesianGrid stroke="#E4E5EA" strokeDasharray="4 4" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#9296A1", fontSize: 11, fontFamily: "Inter, sans-serif" }}
                axisLine={{ stroke: "#E4E5EA" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#9296A1", fontSize: 11, fontFamily: "Inter, sans-serif" }}
                axisLine={{ stroke: "#E4E5EA" }}
                tickLine={false}
              />
              <Tooltip cursor={{ stroke: "#C9A84C", strokeWidth: 1 }} content={<DemoTooltip />} />
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#1B2A4A"
                strokeWidth={3}
                dot={{ r: 4, fill: "#1B2A4A", strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="collections"
                name="Collections"
                stroke="#FEE42F"
                strokeWidth={4}
                dot={{ r: 4, fill: "#171A23", strokeWidth: 2, stroke: "#FEE42F" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[12px] border border-lucro-brand-line bg-lucro-brand-paper p-5 shadow-panel">
        <div className="mb-5 text-[11px] font-bold uppercase text-lucro-brand-ink-40">Revenue Mix</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mixData} margin={{ top: 12, right: 10, left: -24, bottom: 8 }}>
              <CartesianGrid stroke="#E4E5EA" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#9296A1", fontSize: 11, fontFamily: "Inter, sans-serif" }}
                axisLine={{ stroke: "#E4E5EA" }}
                tickLine={false}
              />
              <YAxis hide allowDecimals={false} />
              <Tooltip cursor={{ fill: "rgba(27, 42, 74, 0.06)" }} content={<DemoTooltip />} />
              <Bar dataKey="value" name="Share" fill="#1B2A4A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default function DesignSystem({ navigation }) {
  return (
    <DashboardLayout
      navigation={navigation}
      headerProps={{
        brand: "Lucro - Chiropractic Dashboard System",
        titlePrefix: "Lucro",
        titleAccent: "Design System",
        period: "Brand Reference",
      }}
    >
      <section className="mb-10 overflow-hidden rounded-[12px] bg-lucro-brand-navy-ink shadow-panel">
        <div className="grid gap-8 p-6 text-white lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:p-8">
          <div>
            <div className="mb-4 inline-flex rounded-md bg-lucro-brand-signal-gold px-3 py-1 text-[12px] font-bold text-lucro-brand-navy-ink">
              {voice.name}
            </div>
            <h2 className="font-display text-[44px] font-bold leading-tight lg:text-[56px]">Practice owners need the point, not the spreadsheet.</h2>
            <p className="mt-5 max-w-3xl text-[16px] leading-8 text-white/75">{voice.description}</p>
          </div>
          <div className="self-end border-l border-white/15 pl-6">
            <div className="text-[11px] font-bold uppercase text-white/55">Rule of thumb</div>
            <p className="mt-3 text-[22px] leading-8 text-white">
              Navy carries the authority. Gold marks the one thing that matters.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeading eyebrow="01 Voice" title="Fractional-CFO Direct">
          The voice is calm, commercial, and plain-spoken. It should make a practice owner feel oriented, not audited.
        </SectionHeading>
        <div className="grid gap-4 md:grid-cols-3">
          <RuleCard title="Lead With The Decision" body="Say what the number means for the owner before explaining the metric mechanics." />
          <RuleCard title="Stay Data-Forward" body="Use the number, range, or movement that proves the point. Avoid vague performance language." />
          <RuleCard title="Speak To Operators" body="Use practice language: patients, collections, plans, recalls, claims, treatment rooms, and owner action." />
        </div>
      </section>

      <section className="mb-10">
        <SectionHeading eyebrow="02 Color" title="Lucro Tokens">
          Use navy for authority and structure. Use gold as a decision marker, not a general decoration.
        </SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {colors.map((color) => (
            <ColorCard key={color.token} color={color} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionHeading eyebrow="03 Typography" title="Report-Grade Type">
          Space Grotesk carries headings and key numerals. Inter carries the working UI and explanatory copy.
        </SectionHeading>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {typography.map((item) => (
            <TypographyCard key={item.role} item={item} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionHeading eyebrow="04 Components" title="Buttons, Cards, Tables, Charts">
          The component rules are deliberately restrained so every dashboard feels like a financial document.
        </SectionHeading>
        <div className="mb-4 rounded-[12px] border border-lucro-brand-line bg-lucro-brand-paper p-5 shadow-panel">
          <ButtonSpecimen />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {componentRules.map((item) => (
            <RuleCard key={item.component} title={item.component} body={item.rule} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionHeading eyebrow="05 Stats" title="Owner-Level Metrics">
          Large numerals should read as business facts. Units and suffixes can use Muted Gold.
        </SectionHeading>
        <div className="grid gap-4 lg:grid-cols-3">
          {practiceStats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} highlighted={index === 0} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionHeading eyebrow="06 Charts" title="Gold Answers The Question">
          Navy Tint is the default series. Signal Gold is reserved for the outcome the page is asking the owner to notice.
        </SectionHeading>
        <ChartSpecimen />
      </section>

      <section className="mb-10">
        <SectionHeading eyebrow="07 Tables" title="Financial Report Tables">
          Use a navy header, paper rows, surface striping, and crisp row dividers.
        </SectionHeading>
        <TableSpecimen />
      </section>

      <section className="mb-10">
        <SectionHeading eyebrow="08 Usage Notes" title="Guardrails">
          These are the rules to keep nearby when building a new Lucro dashboard.
        </SectionHeading>
        <div className="grid gap-4 md:grid-cols-2">
          {usageNotes.map((note) => (
            <RuleCard key={note} title="Usage Note" body={note} />
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-[12px] border border-lucro-brand-line bg-lucro-brand-paper p-5 shadow-panel">
        <div className="text-[11px] font-bold uppercase text-lucro-brand-ink-40">Source Reference</div>
        <p className="mt-3 text-[13px] leading-6 text-lucro-brand-ink-70">{source}</p>
      </section>
    </DashboardLayout>
  );
}
