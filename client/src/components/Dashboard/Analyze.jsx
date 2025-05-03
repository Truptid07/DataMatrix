import { useEffect, useState } from "react";
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
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [fileData, setFileData] = useState(null);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("none");
  const [selected3DChartType, setSelected3DChartType] = useState("none");

  // Fetch uploaded files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(res.data);
      } catch (err) {
        console.error("Failed to fetch files.");
      }
    };
    fetchFiles();
  }, [token]);

  // Fetch data for selected file
  useEffect(() => {
    const fetchFileData = async () => {
      if (!selectedFileId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/files/${selectedFileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFileData(res.data);
        // Reset selections when new file is chosen
        setXAxis("");
        setYAxis("");
        setChartType("none");
        setSelected3DChartType("none");
      } catch (err) {
        console.error("Failed to fetch file data.");
      }
    };
    fetchFileData();
  }, [selectedFileId, token]);

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
            <div className="bg-white p-6 rounded shadow mb-6">
              <ChartRenderer
                fileData={fileData}
                xAxis={xAxis}
                yAxis={yAxis}
                chartType={chartType}
              />
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
              <div className="w-full overflow-x-auto">
                <ThreeDChart
                  fileData={fileData}
                  xAxis={xAxis}
                  yAxis={yAxis}
                  selected3DChartType={selected3DChartType}
                />
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Analyze;
