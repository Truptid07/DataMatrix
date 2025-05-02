function ChartTypeSelector({ chartType, setChartType }) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Chart Type:</label>
      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="none">None</option>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="area">Area</option>
        <option value="pie">Pie</option>
        <option value="doughnut">Doughnut</option>
        <option value="polar">Polar Area</option>
        <option value="radar">Radar</option>
        <option value="scatter">Scatter</option>
        <option value="bubble">Bubble</option>
        <option value="funnel">Funnel</option>
        <option value="waterfall">Waterfall</option>
      </select>
    </div>
  );
}

export default ChartTypeSelector;
