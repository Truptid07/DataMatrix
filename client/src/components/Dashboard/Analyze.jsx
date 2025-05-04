import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { FunnelController } from "chartjs-chart-funnel";
import FileSelector from "../Analyze/FileSelector";
import AxisSelector from "../Analyze/AxisSelector";
import ChartTypeSelector from "../Analyze/ChartTypeSelector";
import ChartRenderer from "../Analyze/ChartRenderer";
import ThreeDChart from "../Analyze/ThreeDChart";
import ThreeDChartSelector from "../Analyze/ThreeDChartSelector";
import html2canvas from "html2canvas";
import { useFilesContext } from "../../context/FileContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  FunnelController
);

function Analyze() {
  const { token } = useSelector((state) => state.auth);
  const { files, selectedFileId, setSelectedFileId, fileData, setFileData } = useFilesContext();
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("none");
  const [selected3DChartType, setSelected3DChartType] = useState("none");
  const chartRef = useRef();
  const canvasRef = useRef(null);

  const handle2DownloadChart = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = "chart.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handle3Download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "3d_chart.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  // Clear all selections when no file is selected
  useEffect(() => {
    if (!selectedFileId) {
      setFileData(null);
      setXAxis("");
      setYAxis("");
      setChartType("none");
      setSelected3DChartType("none");
    }
  }, [selectedFileId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#2E3C43]">
        Analyze Your Data
      </h1>

      {/* File Selector */}
      <FileSelector
        files={files}
        selectedFileId={selectedFileId}
        setSelectedFileId={setSelectedFileId}
      />

      {/* Show 2D controls only when a file is selected */}
      {fileData && (
        <>
          <AxisSelector
            headers={fileData.headers}
            xAxis={xAxis}
            yAxis={yAxis}
            setXAxis={setXAxis}
            setYAxis={setYAxis}
          />

          <ChartTypeSelector
            chartType={chartType}
            setChartType={setChartType}
          />

          {/* Render 2D chart only when axes and chart type are selected */}
          {chartType !== "none" && xAxis && yAxis && (
            <div>
              <div className="bg-white p-6 rounded shadow mb-6" ref={chartRef}>
                <ChartRenderer
                  fileData={fileData}
                  xAxis={xAxis}
                  yAxis={yAxis}
                  chartType={chartType}
                />
              </div>
              <button
                onClick={handle2DownloadChart}
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Download Chart as PNG
              </button>
            </div>
          )}

          {/* 3D Chart Options Section */}
          <section className="mt-6 bg-white shadow-md rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              3D Chart Options
            </h2>

            <ThreeDChartSelector
              selected3DChartType={selected3DChartType}
              setSelected3DChartType={setSelected3DChartType}
            />

            {/* Render 3D chart only when selected, and axes are chosen */}
            {selected3DChartType !== "none" && xAxis && yAxis && (
              <div>
                <div className="w-full overflow-x-auto">
                  <ThreeDChart
                    fileData={fileData}
                    xAxis={xAxis}
                    yAxis={yAxis}
                    selected3DChartType={selected3DChartType}
                    canvasRef={canvasRef}
                  />
                </div>
                <button
                  onClick={handle3Download}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Download 3D Chart
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Analyze;
