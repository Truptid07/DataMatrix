import React, { useState, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { exportInsightsPdf, exportInsightsTxt } from "./function";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TrendDetection = ({
  selectedFileId,
  localFile,
  fileData,
  availableColumns,
}) => {
  const [trendColumn, setTrendColumn] = useState("");
  const [dateColumn, setDateColumn] = useState("");
  const [trendResult, setTrendResult] = useState(null);
  const [trendLoading, setTrendLoading] = useState(false);
  const [trendError, setTrendError] = useState(null);
  const chartRef = useRef(null);

  const handleDetectTrend = async () => {
    if (!trendColumn) return;

    setTrendLoading(true);
    setTrendError(null);
    setTrendResult(null);

    try {
      const activeFile = selectedFileId === "local" ? localFile : fileData;

      const response = await axios.post(
        `${BASE_URL}/api/trends`,
        {
          fileData: activeFile.data,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      setTrendResult(response.data);
    } catch (error) {
      setTrendError("Failed to detect trend. Please try again.");
    } finally {
      setTrendLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!trendResult) return;

    const chartInstance = chartRef.current;
    let imageDataUrl = null;
    if (chartInstance) {
      imageDataUrl = chartInstance.toBase64Image();
    }

    exportInsightsPdf(
      trendInsightsForExport,
      "trend-summary.pdf",
      imageDataUrl
    );
  };

  const trendInsightsForExport = trendResult
    ? [{ type: "Trend Summary", text: trendResult.summary }]
    : [];

  return (
    <div className="trend-detection-section mt-6 p-4 border rounded shadow bg-gray-50">
      <h3 className="text-blue-800 font-semibold mb-2">Trend Detection</h3>

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <select
          className="p-2 border rounded"
          value={trendColumn}
          onChange={(e) => setTrendColumn(e.target.value)}
        >
          <option value="">Select Numeric Column</option>
          {availableColumns
            .filter((col) => {
              const sampleValue =
                localFile?.data?.[0]?.[col] || fileData?.data?.[0]?.[col];
              return typeof sampleValue === "number";
            })
            .map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
        </select>

        <select
          className="p-2 border rounded"
          value={dateColumn}
          onChange={(e) => setDateColumn(e.target.value)}
        >
          <option value="">Select Date Column (optional)</option>
          {availableColumns
            .filter((col) => {
              const sampleValue =
                localFile?.data?.[0]?.[col] || fileData?.data?.[0]?.[col];
              return (
                typeof sampleValue === "string" &&
                !isNaN(Date.parse(sampleValue))
              );
            })
            .map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
        </select>

        <button
          onClick={handleDetectTrend}
          disabled={!trendColumn || trendLoading}
          className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {trendLoading ? "Detecting..." : "Detect Trend"}
        </button>
      </div>

      {trendError && (
        <p className="text-red-600 font-semibold mb-2">{trendError}</p>
      )}

      {trendResult && (
        <div className="trend-result mt-4">
          <h4 className="font-semibold mb-2 text-gray-800">Trend Summary:</h4>
          <p className="mb-4 whitespace-pre-wrap">{trendResult.summary}</p>

          <Line
            ref={chartRef}
            data={{
              labels: trendResult.chart.labels,
              datasets: [
                {
                  label: trendResult.chart.label,
                  data: trendResult.chart.data,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  fill: true,
                  tension: 0.3,
                },
                {
                  label: trendResult.chart.regressionLine.label,
                  data: trendResult.chart.regressionLine.data,
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderDash: [5, 5],
                  borderWidth: 2,
                  fill: false,
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
              },
            }}
          />

          {/* Export Buttons */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleExportPdf}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download PDF
            </button>

            <button
              onClick={() =>
                exportInsightsTxt(trendInsightsForExport, "trend-summary.txt")
              }
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Download TXT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendDetection;
