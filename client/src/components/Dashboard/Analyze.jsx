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
import { motion } from "framer-motion";
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

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
    <motion.div
      className="p-4 sm:p-6 lg:p-10"
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-2xl font-bold mb-6 text-[#2E3C43]"
        variants={fadeUp}
        custom={1}
      >
        Analyze Your Data
      </motion.h1>

      <motion.div variants={fadeUp} custom={2}>
        <FileSelector
          files={files}
          selectedFileId={selectedFileId}
          setSelectedFileId={setSelectedFileId}
        />
      </motion.div>

      {fileData && (
        <>
          <motion.div variants={fadeUp} custom={3}>
            <AxisSelector
              headers={fileData.headers}
              xAxis={xAxis}
              yAxis={yAxis}
              setXAxis={setXAxis}
              setYAxis={setYAxis}
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={4}>
            <ChartTypeSelector
              chartType={chartType}
              setChartType={setChartType}
            />
          </motion.div>

          {chartType !== "none" && xAxis && yAxis && (
            <motion.div variants={fadeUp} custom={5}>
              <div
                className="bg-white p-4 sm:p-6 rounded shadow mb-6 overflow-x-auto"
                ref={chartRef}
              >
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
            </motion.div>
          )}

          <motion.section
            variants={fadeUp}
            custom={6}
            className="mt-6 bg-white shadow-md rounded-lg p-4 space-y-4"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              3D Chart Options
            </h2>

            <ThreeDChartSelector
              selected3DChartType={selected3DChartType}
              setSelected3DChartType={setSelected3DChartType}
            />

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
          </motion.section>
        </>
      )}
    </motion.div>
  );
}

export default Analyze;
