import CancellationTrendChart from "./charts/CancellationTrendChart.jsx";
import InsightsPanel from "./InsightsPanel.jsx";
import Panel from "./Panel.jsx";
import ReasonBreakdownChart from "./charts/ReasonBreakdownChart.jsx";
import RetentionPieChart from "./charts/RetentionPieChart.jsx";
import SectionLabel from "./SectionLabel.jsx";

export default function VisualAnalyticsSection({
  clients,
  trendData,
  reasonChartData,
  retentionPieData,
  insights,
  isLoading,
}) {
  return (
    <>
      <SectionLabel>Visual Analytics</SectionLabel>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Cancellation Requests Over Time" titleTone="rust">
          <CancellationTrendChart data={trendData} isLoading={isLoading} />
        </Panel>

        <Panel title="Cancellations by Reason" titleTone="accent2">
          <ReasonBreakdownChart data={reasonChartData} isLoading={isLoading} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Panel title="Retention vs Lost" titleTone="ok">
          <RetentionPieChart data={retentionPieData} clients={clients} isLoading={isLoading} />
        </Panel>
        <InsightsPanel insights={insights} isLoading={isLoading} />
      </div>
    </>
  );
}
