function AxisSelector({ headers, xAxis, yAxis, setXAxis, setYAxis }) {
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-medium">X Axis:</label>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Choose --</option>
            {headers.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium">Y Axis:</label>
          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Choose --</option>
            {headers.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
  
  export default AxisSelector;
  