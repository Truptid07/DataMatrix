import AxisSelector from "../useranalyze/AxisSelector";
import ChartTypeSelector from "../useranalyze/ChartTypeSelector";

const InsightControls = ({
  availableColumns,
  xAxis,
  yAxis,
  setXAxis,
  setYAxis,
  chartType,
  setChartType,
  onGenerate,
  loading,
}) => (
  <div className="animate-fade-in-up">
    <AxisSelector
      headers={availableColumns}
      xAxis={xAxis}
      yAxis={yAxis}
      setXAxis={setXAxis}
      setYAxis={setYAxis}
    />
    <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
    <button
      onClick={onGenerate}
      disabled={!xAxis || !yAxis}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition duration-300"
    >
      {loading ? "Generating..." : "Generate Insights"}
    </button>
  </div>
);

export default InsightControls;
