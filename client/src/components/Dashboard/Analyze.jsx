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
  const [chartType, setChartType] = useState("bar");

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

  useEffect(() => {
    const fetchFileData = async () => {
      if (!selectedFileId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/files/${selectedFileId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFileData(res.data);
        setXAxis("");
        setYAxis("");
      } catch (err) {
        console.error("Failed to fetch file data.");
      }
    };
    fetchFileData();
  }, [selectedFileId, token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[#2E3C43]">Analyze Your Data</h1>

      <FileSelector
        files={files}
        selectedFileId={selectedFileId}
        setSelectedFileId={setSelectedFileId}
      />

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
        </>
      )}

      <div className="bg-white p-6 rounded shadow">
        <ChartRenderer
          fileData={fileData}
          xAxis={xAxis}
          yAxis={yAxis}
          chartType={chartType}
        />
      </div>
    </div>
  );
}

export default Analyze;